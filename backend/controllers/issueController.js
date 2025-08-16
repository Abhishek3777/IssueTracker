const express = require('express');
const router = express.Router();
const Issue = require("../models/IssueModel");
const User = require("../models/user")
const mongoose = require('mongoose')
// Helper to generate issueId like BG001, BG002 etc.
const generateIssueId = async () => {
    const count = await Issue.countDocuments();
    return `BG${String(count + 1).padStart(3, '0')}`;
};



// create router
exports.createIssue = async (req, res) => {
    const user = req.user;

    try {
        const issueId = await generateIssueId();

        const newIssue = new Issue({
            issueId,
            ...req.body,
            createdBy: user.userId,
        });


        const saved = await newIssue.save();
        res.status(201).json(saved);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err.message);
    }
}
//get all issues

exports.getAllIssues = async (req, res) => {
   

    try {
        
        
        // if (currUser.role === 'worker') {
        //     const issuesForWorker = await Issue.find({ assignedTo: user })
        //         .populate("assignedTo", "name email")
        //         .sort({ createdDate: -1 });


        //     return res.json(issuesForWorker);
        // }
        const issues = await Issue.find()
            .populate('assignedTo', 'name email') // populate only needed fields
            .sort({ createdDate: -1 });

        return res.json(issues);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// delete issue
// exports.deleteIssues = async (req, res) => {
//     try {
//         const { id } = req.params;
//         await Issue.findByIdAndDelete(id);
//         res.status(200).json({ message: 'Issue deleted successfully' });
//     }
//     catch (err) {
//         console.error('Delete Error:', err.message);
//         res.status(500).json({ error: 'Server error while deleting issue' });
//     }
// }
// update status logic

// exports.updateIssueStatus = async (req, res) => {
//     const { id } = req.params;
//     const { status: newStatus } = req.body;

//     try {
//         const issue = await Issue.findById(id); // ❗ await was missing
//         if (!issue)
//             return res.status(404).json({ message: 'Issue not found' });

//         if (issue.status === newStatus) {
//             return res.status(400).json({ message: 'Status unchanged' });
//         }

//         // Main logic
//         if (newStatus === 'Closed') {
//             const lastStart = issue.lastReopenedAt || issue.createdDate; // ❗ correct field name
//             issue.totalOpenDuration = (issue.totalOpenDuration || 0) + (new Date() - lastStart);
//             issue.closedAt = new Date();
//         }
//         else if (issue.status === 'Closed' && (newStatus === 'Open' || newStatus === 'In Progress')) {
//             issue.lastReopenedAt = new Date();
//         }

//         issue.status = newStatus;
//         await issue.save();

//         res.status(200).json(issue);
//     } catch (err) {
//         console.error(err); // For debugging
//         res.status(500).json({ error: "Server error" });
//     }
// };
// summary for issues
exports.getSummary = async (req, res) => {
    try {
        const total = await Issue.countDocuments();
        const open = await Issue.countDocuments({ status: 'Open' });
        const closed = await Issue.countDocuments({ status: 'Closed' });
        const inProgress = await Issue.countDocuments({ status: 'In Progress' });

        // Overdue issues
        const overdue = await Issue.countDocuments({
            dueDate: { $lt: new Date() },
            status: { $ne: 'Closed' }
        });

        return res.status(200).json({
            total,
            open,
            closed,
            inProgress,
            overdue
        });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: 'Error fetching summary' });
    }
};

// update status route -> valid transitions
// Open -> In Progress
// In Progress -> Resolved
// Resolved -> Closed or Unresolved
// UnResolved -> Resolved
const allowedTransitions = {
    Open: ["In Progress"],
    "In Progress": ["Resolved"],
    Resolved: ["Closed", "UnResolved"],
    Unresolved: ["In Progress"],
};
exports.updateStatus = async (req, res) => {

    const { id } = req.params; // issue id
    const { status } = req.body;
    const user = req.user;
    console.log(req.user)

    try {
        const issue = await Issue.findById(id);
        if (!issue) return res.status(404).json({ message: 'Issue not found' });

        const currentStatus = issue.status;

        const nextAllowed = allowedTransitions[currentStatus] || [];

        if (!nextAllowed.includes(status)) {
            return res.status(400).json({
                message: `Invalid status transition from '${currentStatus}' to '${status}'`,
            });

        }

        if (status === 'Resolved') {
            if (!issue.assignedTo || !issue.assignedTo.equals(new mongoose.Types.ObjectId(user.userId))
            ) {
                console.log(new mongoose.Types.ObjectId(user._id), issue.assignedTo);
                return res.status(403).json({ message: 'Only assigned worker can resolve the issue' });
            }
        }

        if ((status === 'Closed' || status === 'UnResolved') && (!issue.createdBy || !issue.createdBy.equals(new mongoose.Types.ObjectId(user.userId)))) {
            return res.status(403).json({ message: 'Only issue creator can close or unresolve the issue' });
        }
        if (status === 'UnResolved') {
            issue.status = 'In Progress';
        }
        else {
            issue.status = status;
        }


        // if in progress set due date for that issue automatically
        if (issue.status === 'In Progress' && !issue.dueDate) {
            issue.dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        }

        await issue.save();
        res.status(200).json({ message: "Status updated successfully", issue });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

exports.assignWork = async (req, res) => {
    const { id } = req.params;
    const { workerId } = req.body;
    const user = req.user;

    if (user.role !== 'admin') {
        return res.status(403).json({ message: 'Only admin can assign workers' });
    }

    try {
        const issue = await Issue.findById(id);
        if (!issue) {
            return res.status(404).json({ message: 'Issue does not exist' });
        }

        if (!workerId) return res.status(400).json({ message: "Worker ID is required" });

        issue.assignedTo = workerId;
        issue.status = 'In Progress';
        issue.dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await issue.save();

        return res.json({ message: 'Worker assigned', issue });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Server error' });
    }
};

// edit issues
exports.editIssues = async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    const { title, description, priority, type } = req.body;
    try {

        const issue = await Issue.findById(id);
        if (!issue)
            return res.status(404).json({ message: 'Issue does not exist!' });

        // check if issue sent by creator id
        if ((!issue.createdBy || !issue.createdBy.equals(new mongoose.Types.ObjectId(user.userId)))) {
            return res.status(403).json({ message: 'Only issue creator can update the issue' });
        }
        // edit only allowed fields
        if (title !== undefined) issue.title = title;
        if (description !== undefined) issue.description = description;
        if (priority !== undefined) issue.priority = priority;
        if (type !== undefined) issue.type = type;


        await issue.save();

        return res.status(200).json({
            updatedIssue: issue,
            'message': 'Issue updated successfully'
        });
    }
    catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: 'Server error' });
    }
}

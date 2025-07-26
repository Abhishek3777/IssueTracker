const express = require('express');
const router = express.Router();
const Issue = require("../models/IssueModel");

// Helper to generate issueId like BG001, BG002 etc.
const generateIssueId = async () => {
    const count = await Issue.countDocuments();
    return `BG${String(count + 1).padStart(3, '0')}`;
};



// create router
exports.createIssue = async (req, res) => {
    try {
        const issueId = await generateIssueId();

        const newIssue = new Issue({
            issueId,
            ...req.body,
        });
        const saved = await newIssue.save();
        res.status(201).json(saved);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}
//get all issues

exports.getAllIssues = async (req, res) => {
    try {
        const issues = await Issue.find().sort({ createdDate: -1 });
        res.json(issues);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// delete issue
exports.deleteIssues = async (req, res) => {
    try {
        const { id } = req.params;
        await Issue.findByIdAndDelete(id);
        res.status(200).json({ message: 'Issue deleted successfully' });
    }
    catch (err) {
        console.error('Delete Error:', err.message);
        res.status(500).json({ error: 'Server error while deleting issue' });
    }
}
// update status logic

exports.updateIssueStatus = async (req, res) => {
    const { id } = req.params;
    const { status: newStatus } = req.body;

    try {
        const issue = await Issue.findById(id); // ❗ await was missing
        if (!issue)
            return res.status(404).json({ message: 'Issue not found' });

        if (issue.status === newStatus) {
            return res.status(400).json({ message: 'Status unchanged' });
        }

        // Main logic
        if (newStatus === 'Closed') {
            const lastStart = issue.lastReopenedAt || issue.createdDate; // ❗ correct field name
            issue.totalOpenDuration = (issue.totalOpenDuration || 0) + (new Date() - lastStart);
            issue.closedAt = new Date();
        }
        else if (issue.status === 'Closed' && (newStatus === 'Open' || newStatus === 'In Progress')) {
            issue.lastReopenedAt = new Date();
        }

        issue.status = newStatus;
        await issue.save();

        res.status(200).json(issue);
    } catch (err) {
        console.error(err); // For debugging
        res.status(500).json({ error: "Server error" });
    }
};
// summary for issues
exports.getSummary = async (req, res) => {
    try {
        const total = await Issue.countDocuments();
        const open = await Issue.countDocuments({ status: 'Open' });
        const closed = await Issue.countDocuments({ status: 'Closed' });
        const inProgress = await Issue.countDocuments({ status: 'In Progress' });

        // Overdue issues
        const overdue = await Issue.countDocuments({
            dueDate: { $lt: new Date()},
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


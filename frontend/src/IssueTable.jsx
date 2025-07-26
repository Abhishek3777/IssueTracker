import React from 'react'
import axios from 'axios';

import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Dashboard from './components/Dashboard';

const IssueTable = () => {
    const navigate = useNavigate();

    const [summary, setSummary] = useState({});
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);

    const getSummary = async () => {
        try {
            const res = await axios.get("http://localhost:8000/issues/summary");
            setSummary(res.data);
        }
        catch (err) {
            console.log(err);
        }
        finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        getSummary();
        fetchIssues();
    }, []);

    const getDaysOpen = (issue) => {
        const now = new Date();

        if (issue.status === "Closed") {
            // Use stored totalOpenDuration only
            return Math.floor(issue.totalOpenDuration / (1000 * 60)); // 1 min = 1 simulated day
        } else {
            const lastStart = new Date(issue.lastReopenedAt || issue.createdDate);
            const activeDuration = now - lastStart;
            const totalDuration = (issue.totalOpenDuration || 0) + activeDuration;
            return Math.floor(totalDuration / (1000 * 60)); // 1 min = 1 simulated day
        }
    };


    const fetchIssues = async () => {

        try {
            const res = await axios.get('http://localhost:8000/issues');
            setIssues(res.data);

        }
        catch (err) {

            console.error('Error fetching issues:', err);
        }
    }

    const handleDelete = async (id) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this issue");
        if (!isConfirmed) return;

        try {
            await axios.delete(`http://localhost:8000/issues/${id}`);
            toast.success("Deleted Successfully");
            setIssues((prev) => prev.filter((issue) => issue._id !== id));
            getSummary();
        }
        catch (err) {
            console.log(err.message);
            toast.error("Failed to delete issue")
        }

    }
    const handleStatusChange = async (id, newStatus) => {
        try {
            await axios.patch(`http://localhost:8000/issues/${id}/status`, { status: newStatus });
            fetchIssues();
            getSummary();
        }
        catch (err) {
            console.log(err.message);
        }
    }
    return (

        <div className="container mt-5">
            <h2 className="mb-4">Issue Tracker</h2>
            <Dashboard summary={summary} />
            <div className="table-responsive">
                <button
                    className="btn btn-primary mb-3"
                    onClick={() => navigate('/create')}
                >
                    Create New Issue
                </button>
                <table className="table table-bordered table-striped table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>Issue ID</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Assignee</th>
                            <th>Priority</th>
                            <th>Status</th>
                            <th>Type</th>
                            <th>Created Date</th>
                            <th>Minutes Open</th>
                            <th>Due Date</th>
                            <th>Comments</th>
                            <th>Delete Issue</th>
                        </tr>
                    </thead>
                    <tbody>
                        {issues.map((issue) => {

                            const isOverDue = issue.dueDate && new Date(issue.dueDate) < new Date() && issue.status !== 'Closed';

                            return (

                                <tr key={issue._id} className={isOverDue ? 'table-danger' : ""}>
                                    <td>{issue.issueId}</td>
                                    <td>{issue.title}</td>
                                    <td>{issue.description}</td>
                                    <td>{issue.assignee}</td>
                                    <td>{issue.priority}</td>
                                    {/* status change start */}
                                    <select value={issue.status} onChange={(e) => handleStatusChange(issue._id, e.target.value)}>
                                        <option value="Open">Open</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Closed">Closed</option>
                                    </select>


                                    {/* // status change end */}
                                    <td>{issue.type}</td>
                                    <td>{new Date(issue.createdDate).toLocaleDateString()}</td>
                                    <td>{getDaysOpen(issue)}</td>
                                    <td>{new Date(issue.dueDate).toLocaleDateString()}</td>
                                    <td>{issue.comments || ''}</td>
                                    <td>
                                        <button className="btn btn-danger" onClick={() => handleDelete(issue._id)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            );

                        }
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default IssueTable;

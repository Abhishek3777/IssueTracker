import React from 'react'
import axios from 'axios';

import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Dashboard from './components/Dashboard';
import { getAuthHeader } from './api/authHeader';
import './css/IssueTable.css'

const IssueTable = ({ issues,
    loading,
    refreshIssues,
    refreshSummary }) => {
    const navigate = useNavigate();

    const currUser = JSON.parse(localStorage.getItem("user"));


    const [summary, setSummary] = useState({});

    const [assignee, setAssignee] = useState({});
    const [workers, setWorkers] = useState([]);
    const [selectedWorker, setSelectedWorker] = useState({});


    useEffect(() => {
        getWorkers();

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


    // const handleDelete = async (id) => {
    //     const isConfirmed = window.confirm("Are you sure you want to delete this issue");
    //     if (!isConfirmed) return;

    //     try {
    //         await axios.delete(`http://localhost:8000/issues/${id}`);
    //         toast.success("Deleted Successfully");

    //     }
    //     catch (err) {
    //         console.log(err.message);
    //         toast.error("Failed to delete issue")
    //     }

    // }


    const handleAssigneeSubmit = async (e, id) => {
        e.preventDefault();
        try {
            const res = await axios.patch(
                `http://localhost:8000/issues/${id}/assign`,
                { assignee: assignee[id] },
                { headers: getAuthHeader() }
            );
            toast.success(`Assignee set to ${assignee[id]}`);
        } catch (err) {
            console.log("Error in setting assignee", err.message);
        }
    };

    const getWorkers = async () => {
        try {
            const res = await axios.get('http://localhost:8000/auth/users?role=worker');
            setWorkers(res.data.users); // ✅ store workers

        } catch (err) {
            console.error("Error fetching workers:", err);
        }
    };

    const handleStatusChange = async (id, newStatus) => {

        try {
            console.log("Updating issue:", id);
            await axios.patch(`http://localhost:8000/issues/${id}/status`, { status: newStatus }, { headers: getAuthHeader() });
            refreshIssues();
            toast.success(`Status changed to ${newStatus}`);
        }
        catch (err) {
            console.log(err.message);
            toast.error(`Error changing status`);
        }
    }

    return (
        <div className="container mt-5">
            {/* <h2 className="mb-4">Issue Tracker</h2> */}

            {/* <Dashboard summary={summary} /> */}

            <div className="table-responsive">
                <button
                    className="btn btn-primary mb-3"
                    onClick={() => navigate('/create')}
                >
                    Create New Issue
                </button>

                <table className="table table-bordered table-hover align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>Issue ID</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th className='narrow-column'>Assignee</th>
                            <th>Priority</th>
                            <th>Status</th>
                            <th>Type</th>
                            <th>Created Date</th>
                            <th>Minutes Open </th>
                            <th>Due Date</th>
                            <th>Comments</th>
                            <th>Edit</th>
                            {/* <th>Delete</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {!issues || issues.length === 0 ? (
                            <tr>
                                <td colSpan="12" className="text-center text-muted py-3">
                                    No issues to display.
                                </td>
                            </tr>
                        ) : (
                            issues.map((issue) => {
                                const isOverDue =
                                    issue.dueDate &&
                                    new Date(issue.dueDate) < new Date() &&
                                    issue.status !== 'Closed';

                                return (
                                    <tr key={issue._id} className={isOverDue ? 'table-danger' : ''}>
                                        <td>{issue._id}</td>
                                        <td>{issue.title}</td>
                                        <td>{issue.description}</td>

                                        <td className='narrow-column'>
                                            {issue.assignedTo ? (
                                                // if worker already assigned

                                                <>
                                                    <strong>{issue.assignedTo.name}</strong><br />
                                                    <small>{issue.assignedTo.email}</small>
                                                </>
                                            ) : (
                                                <form
                                                    onSubmit={(e) => {
                                                        e.preventDefault();

                                                        const selectedWorkerId = selectedWorker[issue._id];

                                                        if (!selectedWorkerId) {
                                                            toast.error("Please select a worker before assigning.");
                                                            return;
                                                        }

                                                        console.log("PATCH to:", `http://localhost:8000/issues/${issue._id}/assign`);
                                                        console.log("Body:", { workerId: selectedWorkerId });

                                                        axios
                                                            .patch(`http://localhost:8000/issues/${issue._id}/assign`, {
                                                                workerId: selectedWorkerId
                                                            }, { headers: getAuthHeader() })
                                                            .then(() => {
                                                                toast.success("Worker assigned!");
                                                                refreshIssues(); // reload table after assigning
                                                            })
                                                            .catch((err) => {
                                                                toast.error("Assignment failed");
                                                                console.error(err);
                                                            });
                                                    }}
                                                >
                                                    <select
                                                        value={selectedWorker[issue._id] || ''}
                                                        onChange={(e) => setSelectedWorker({
                                                            ...selectedWorker,
                                                            [issue._id]: e.target.value
                                                        })}
                                                    >
                                                        <option value="">Select a worker</option>
                                                        {workers.map(worker => (
                                                            <option key={worker._id} value={worker._id}>
                                                                {worker.name} {worker.email}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <button className="btn btn-sm btn-success mt-1" disabled={!selectedWorker}>
                                                        Assign
                                                    </button>
                                                </form>
                                            )}

                                        </td>



                                        <td>{issue.priority}</td>

                                        {/* ✅ Status dropdown */}
                                        <td>
                                            {
                                                issue._id ? (
                                                    <select
                                                        className="form-select form-select-sm"
                                                        style={{ minWidth: '130px' }}
                                                        value={issue.status}
                                                        onChange={(e) =>
                                                            handleStatusChange(issue._id, e.target.value)
                                                        }
                                                    >
                                                        <option value="Open">Open</option>
                                                        <option value="In Progress">In Progress</option>
                                                        <option value="Resolved">Resolved</option>
                                                        <option value="UnResolved">UnResolved</option>
                                                        <option value="Closed">Closed</option>
                                                    </select>
                                                ) : (
                                                    <span>Loading...</span>
                                                )
                                            }

                                        </td>

                                        <td>{issue.type}</td>
                                        <td>{new Date(issue.createdDate).toLocaleDateString()}</td>
                                        <td>{getDaysOpen(issue)}</td>
                                        <td>
                                            {issue.dueDate
                                                ? new Date(issue.dueDate).toLocaleDateString()
                                                : '-'}
                                        </td>
                                        <td>{issue.comments || ''}</td>

                                        <td>
                                            <button
                                                className="btn btn-sm btn-success"
                                                onClick={() => navigate(`/${issue._id}/edit`)}
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );



};

export default IssueTable;

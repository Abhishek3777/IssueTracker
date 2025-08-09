import React from 'react'
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAuthHeader } from './api/authHeader';
const api = import.meta.env.VITE_API_URL


const CreateIssueForm = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        issueId: '',
        title: '',
        description: '',
        assignee: '',
        priority: 'Low',
        status: 'Open',
        type: 'Bug',
    });


    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${api}/issues`, formData, { headers: getAuthHeader() });
            const createdIssue = response.data;
            toast.success(`Ticket ${createdIssue._id} created successfully!`);
            navigate('/');
        } catch (err) {
            console.error('POST failed:', err.message);
            toast.error("Failed to create issue");
        }
    };


    return (
        <div className="container mt-4">
            <h3>Create New Issue</h3>
            <form onSubmit={handleSubmit}>
                {/* <div className="mb-3">
                    <label className="form-label">Issue ID</label>
                    <input
                        type="text"
                        className="form-control"
                        name="issueId"
                        value={formData.issueId}
                        onChange={handleChange}
                        required
                    />
                </div> */}
                <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                        type="text"
                        className="form-control"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                        className="form-control"
                        name="description"
                        rows="3"
                        value={formData.description}
                        onChange={handleChange}
                    ></textarea>
                </div>

                {/* due date start */}


                {/* // due date end */}
                <div className="row">
                    <div className="col">
                        <label className="form-label">Priority</label>
                        <select
                            className="form-select"
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                        >
                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>
                        </select>
                    </div>
                    {/* <div className="col">
                        <label className="form-label">Status</label>
                        <select
                            className="form-select"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option>Open</option>
                            <option>Closed</option>
                            <option>In Progress</option>
                        </select>
                    </div> */}
                    <div className="col">
                        <label className="form-label">Type</label>
                        <select
                            className="form-select"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                        >
                            <option>Bug</option>
                            <option>Feature</option>
                            <option>Task</option>
                        </select>
                    </div>
                </div>
                <button type="submit" className="btn btn-success mt-4">
                    Submit
                </button>
            </form>
        </div>
    );
}

export default CreateIssueForm;

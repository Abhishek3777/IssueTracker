import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { getAuthHeader } from './api/authHeader';
const api = import.meta.env.VITE_API_URL

const Edit = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [data, setData] = useState({
        title: '',
        description: '',
        priority: 'Low',
        type: 'Bug',
    });

    const handleChange = (e) => {
        setData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleEdit = async (e, id) => {
        e.preventDefault();
        console.log(data);
        try {
            await axios.patch(`${api}/issues/${id}/edit`, data, { headers: getAuthHeader() });
            toast.success('Edited issue successfully');
            navigate('/');
        }
        catch (err) {
            console.log(err.message);
        }
    }

    return (
        <div className="container mt-4">
            <h3>Edit Issue</h3>
            <button onClick={() => {navigate('/')}}><i className="bi bi-arrow-left"></i></button>
            <form onSubmit={(e) => handleEdit(e, id)}>


                <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                        type="text"
                        className="form-control"
                        name="title"
                        value={data.title}
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
                        value={data.description}
                        onChange={handleChange}
                    ></textarea>
                </div>


                <div className="row">
                    <div className="col">
                        <label className="form-label">Priority</label>
                        <select
                            className="form-select"
                            name="priority"
                            value={data.priority || 'Low'}
                            onChange={handleChange} required
                        >
                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>
                        </select>
                    </div>

                    <div className="col">
                        <label className="form-label">Type</label>
                        <select
                            className="form-select"
                            name="type"
                            value={data.type || 'Bug'}
                            onChange={handleChange} required
                        >
                            <option>Bug</option>
                            <option>Feature</option>
                        </select>
                    </div>
                </div>
                <button type="submit" className="btn btn-success mt-4">
                    Edit
                </button>
            </form>
        </div>
    )
}

export default Edit

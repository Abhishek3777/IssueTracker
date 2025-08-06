import React, { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'

const Dashboard = ({ summary, loading, onFilterChange }) => {



    return (
        <div className="container mt-4">
            <h4 className="mb-3">Issue Summary</h4>

            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '150px' }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <div className="row">
                    <div className="col-md-3" onClick={() => onFilterChange('')} style={{ cursor: 'pointer' }}>
                        <div className="card text-white bg-primary mb-3">
                            <div className="card-body">
                                <h5 className="card-title">Total</h5>
                                <p className="card-text fs-4">{summary.total}</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3" onClick={() => onFilterChange('Open')} style={{ cursor: 'pointer' }}>
                        <div className="card text-white bg-success mb-3">
                            <div className="card-body">
                                <h5 className="card-title">Open</h5>
                                <p className="card-text fs-4">{summary.open}</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3" onClick={() => onFilterChange('In Progress')} style={{ cursor: 'pointer' }}>
                        <div className="card text-white bg-warning mb-3">
                            <div className="card-body">
                                <h5 className="card-title">In Progress</h5>
                                <p className="card-text fs-4">{summary.inProgress}</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3" onClick={() => onFilterChange('Closed')} style={{ cursor: 'pointer' }}>
                        <div className="card text-white bg-danger mb-3">
                            <div className="card-body">
                                <h5 className="card-title">Closed</h5>
                                <p className="card-text fs-4">{summary.closed}</p>
                            </div>
                        </div>
                    </div>


                </div>
            )}
        </div>
    );
};

export default Dashboard;
import React, { useEffect, useState } from 'react';
import Dashboard from '../components/Dashboard';
import IssueTable from '../IssueTable'
import axios from 'axios';
import { getAuthHeader } from '../api/authHeader';

const DashboardPage = () => {
  const [summary, setSummary] = useState({});
  const [issues, setIssues] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch data on mount
  useEffect(() => {
    fetchIssues();
    fetchSummary();
  }, []);

  const fetchIssues = async () => {
    try {
      const res = await axios.get('http://localhost:8000/issues', { headers: getAuthHeader() });
      setIssues(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await axios.get('http://localhost:8000/issues/summary', { headers: getAuthHeader() });
      setSummary(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Filter issues based on dashboard click
  const filteredIssues = statusFilter === ''
    ? issues
    : issues.filter(issue => issue.status.toLowerCase() === statusFilter.toLowerCase());

  return (
    <div className="container mt-5">


      {/* Pass status filter controller */}
      <Dashboard summary={summary} loading={loading} onFilterChange={setStatusFilter} />

      <IssueTable
        issues={filteredIssues}
        loading={loading}
        refreshSummary={fetchSummary}
        refreshIssues={fetchIssues}
      />
    </div>
  );
};

export default DashboardPage;

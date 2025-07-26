import { useState } from 'react'
import IssueTable from './IssueTable'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import CreateIssueForm from './CreateIssueForm'
import { Routes, Route } from 'react-router-dom';
import Layout from './Layout'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function App() {


  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>

        <Route path="/" element={<Layout />}>
          <Route path="/" element={<IssueTable />} />
          <Route path="/create" element={<CreateIssueForm />} />
        </Route>
      </Routes>
    </>
  )
}

export default App

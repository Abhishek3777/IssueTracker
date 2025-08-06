import { useState } from 'react'
import IssueTable from './IssueTable'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import CreateIssueForm from './CreateIssueForm'
import { Routes, Route } from 'react-router-dom';
import Layout from './Layout'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Login from './components/Login'
import Register from './components/Register'
import PrivateRoute from './components/PrivateRoute'
import DashboardPage from './components/DashboardPage'

function App() {


  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        {/* Public Layout */}
        <Route path="/" element={<Layout />}>
          {/* Public Routes */}
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          {/* Private Routes */}
          <Route
            index element={<PrivateRoute>
              <DashboardPage/>
            </PrivateRoute>}
          />

          <Route path="/create" element={<PrivateRoute>
            <CreateIssueForm />
          </PrivateRoute>}

          />

        </Route>
      </Routes>
    </>
  )
}

export default App

// src/components/Navbar.jsx
import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LiveClock from './LiveClock';


const Navbar = ({ currUser, setCurrUser }) => {

  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);


  const toggleDarkMode = () => {
    document.body.classList.toggle("dark-mode");
    setDarkMode(!darkMode);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setCurrUser(null);
    navigate("/login");
    toast.success("Logged out");
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand d-flex align-items-center" to="/">
        <i className="bi bi-bug-fill me-2 fs-4 text-warning"></i>
        <span className="fs-5 fw-bold">IssueTracker</span>
      </Link>

      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ms-auto d-flex flex-row gap-2">
          <li className="nav-item">
            {!localStorage.getItem("token") && <Link to="/login" className="btn btn-outline-light btn-sm">
              Login
            </Link>}

          </li>
          <li className="nav-item d-flex align-items-center px-2">
            <LiveClock />
          </li>
          {/* dark mode setup  */}
          <button onClick={toggleDarkMode} className="btn btn-outline-secondary ms-auto">
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
          {/* dark mode setup end */}

          {/* profie section start */}

          <li className="nav-item d-flex align-items-center text-white me-3">
            {currUser && (
              <div className="d-flex align-items-center gap-2">
                {/* Profile image */}
                <img
                  src="https://www.w3schools.com/howto/img_avatar.png"
                  alt="profile"
                  width="32"
                  height="32"
                  className="rounded-circle border"
                />
                {/* Name and role */}
                <div className="d-flex flex-column">
                  <span className="fw-semibold">{currUser.name}</span>
                  <span className="badge bg-secondary text-light text-capitalize">{currUser.role}</span>
                </div>
              </div>
            )}
          </li>
          {/* profile section end */}

          <li className="nav-item">
            {!currUser && <Link to="/register" className="btn btn-warning btn-sm">
              Register
            </Link>}

          </li>
          {/* logout button start */}
          <li className="nav-item">
            {localStorage.getItem("token") && (<button onClick={handleLogout} className="btn btn-warning btn-sm">
              Logout
            </button>)}
          </li>
          {/* logout button end */}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

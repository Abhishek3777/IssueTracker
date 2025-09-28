import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LiveClock from './LiveClock';

const Navbar = ({ currUser, setCurrUser }) => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Rehydrate currUser from localStorage on page load
  useEffect(() => {
    if (!currUser) {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser && setCurrUser) setCurrUser(storedUser);
    }
  }, [currUser, setCurrUser]);

  const toggleDarkMode = () => {
    document.body.classList.toggle('dark-mode');
    setDarkMode(!darkMode);
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // keep it consistent
    localStorage.removeItem('user');
    if (setCurrUser) setCurrUser(null);
    navigate('/login');
    if (toast && typeof toast.success === 'function') {
      toast.success('Logged out');
    }
  };

  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand d-flex align-items-center" to="/">
        <i className="bi bi-bug-fill me-2 fs-4 text-warning"></i>
        <span className="fs-5 fw-bold">IssueTracker</span>
      </Link>

      {/* Toggler button for mobile */}
      <button
        className="navbar-toggler"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}>
        <ul className="navbar-nav ms-auto d-flex flex-column flex-lg-row gap-2">

          {/* Live Clock */}
          <li className="nav-item d-flex align-items-center px-2">
            <LiveClock />
          </li>

          {/* Dark Mode Toggle */}
          <li className="nav-item">
            <button
              onClick={toggleDarkMode}
              className="btn btn-outline-secondary btn-sm w-100"
            >
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </li>

          {/* Not logged in: show Login/Register */}
          {!isLoggedIn && (
            <>
              <li className="nav-item">
                <Link
                  to="/login"
                  className="btn btn-outline-light btn-sm w-100"
                >
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/register"
                  className="btn btn-warning btn-sm w-100"
                >
                  Register
                </Link>
              </li>
            </>
          )}

          {/* Logged in: show Profile + Logout */}
          {isLoggedIn && currUser && (
            <>
              <li className="nav-item d-flex align-items-center text-white me-3">
                <img
                  src="https://www.w3schools.com/howto/img_avatar.png"
                  alt="profile"
                  width="32"
                  height="32"
                  className="rounded-circle border"
                />
                <div className="d-flex flex-column ms-2">
                  <span className="fw-semibold">{currUser.name}</span>
                  <span className="badge bg-secondary text-light text-capitalize">
                    {currUser.role}
                  </span>
                </div>
              </li>

              <li className="nav-item">
                <button
                  onClick={handleLogout}
                  className="btn btn-warning btn-sm w-100"
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

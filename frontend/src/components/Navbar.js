import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">◈</span>
          <span>Gisul</span>
        </Link>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          {user?.role === 'student' && (
            <>
              <Link to="/catalog" className={`nav-link ${isActive('/catalog') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Catalog</Link>
              <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>My Learning</Link>
            </>
          )}
          {user?.role === 'admin' && (
            <>
              <Link to="/admin" className={`nav-link ${isActive('/admin') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link to="/catalog" className={`nav-link ${isActive('/catalog') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Catalog</Link>
            </>
          )}
          {!user && (
            <Link to="/catalog" className={`nav-link ${isActive('/catalog') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Catalog</Link>
          )}
        </div>

        <div className="navbar-actions">
          {user ? (
            <div className="user-menu">
              <div className="user-avatar" onClick={() => setMenuOpen(!menuOpen)}>
                <span>{user.name.charAt(0).toUpperCase()}</span>
              </div>
              {menuOpen && (
                <div className="dropdown">
                  <div className="dropdown-header">
                    <strong>{user.name}</strong>
                    <span className="role-tag">{user.role}</span>
                  </div>
                  <hr className="dropdown-divider" />
                  {user.role === 'student' && (
                    <Link to="/dashboard" className="dropdown-item" onClick={() => setMenuOpen(false)}>My Dashboard</Link>
                  )}
                  {user.role === 'admin' && (
                    <Link to="/admin" className="dropdown-item" onClick={() => setMenuOpen(false)}>Admin Dashboard</Link>
                  )}
                  <button className="dropdown-item danger" onClick={handleLogout}>Log Out</button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-ghost btn-sm">Log In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
      {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)} />}
    </nav>
  );
}

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const user = await register(form.name, form.email, form.password, form.role);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">◈</div>
          <h1>Create account</h1>
          <p>Start learning on Gisul today</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text" className="form-input"
              value={form.name} onChange={e => setForm({...form, name: e.target.value})}
              placeholder="Your name" required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email" className="form-input"
              value={form.email} onChange={e => setForm({...form, email: e.target.value})}
              placeholder="you@example.com" required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password" className="form-input"
              value={form.password} onChange={e => setForm({...form, password: e.target.value})}
              placeholder="Min. 6 characters" required
            />
          </div>
          <div className="form-group">
            <label className="form-label">I am a…</label>
            <div className="role-toggle">
              <button
                type="button"
                className={`role-btn ${form.role === 'student' ? 'active' : ''}`}
                onClick={() => setForm({...form, role: 'student'})}
              >Student</button>
              <button
                type="button"
                className={`role-btn ${form.role === 'admin' ? 'active' : ''}`}
                onClick={() => setForm({...form, role: 'admin'})}
              >Admin / Instructor</button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

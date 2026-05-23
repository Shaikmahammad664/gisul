import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get('/courses');
      setCourses(res.data.courses);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId) => {
    setDeletingId(courseId);
    try {
      await api.delete(`/courses/${courseId}`);
      setCourses(prev => prev.filter(c => c.id !== courseId));
      setConfirmDelete(null);
    } catch (err) {
      alert(err.response?.data?.error || 'Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  const totalEnrollments = courses.reduce((s, c) => s + (parseInt(c.enrollment_count) || 0), 0);

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Manage your courses and content, {user.name}</p>
          </div>
          <Link to="/admin/courses/new" className="btn btn-primary">+ New Course</Link>
        </div>

        <div className="admin-stats">
          <div className="stat-card">
            <div className="stat-value">{courses.length}</div>
            <div className="stat-label">Total Courses</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{totalEnrollments}</div>
            <div className="stat-label">Total Enrollments</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {[...new Set(courses.map(c => c.category))].length}
            </div>
            <div className="stat-label">Categories</div>
          </div>
        </div>

        {courses.length === 0 ? (
          <div className="empty-state">
            <h3>No courses yet</h3>
            <p>Create your first course to get started</p>
            <Link to="/admin/courses/new" className="btn btn-primary" style={{marginTop:'16px'}}>Create Course</Link>
          </div>
        ) : (
          <div className="courses-table-wrapper">
            <table className="courses-table">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Category</th>
                  <th>Lessons</th>
                  <th>Enrollments</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map(course => (
                  <tr key={course.id}>
                    <td>
                      <div className="table-course">
                        <div className="table-thumb">
                          {course.thumbnail
                            ? <img src={course.thumbnail} alt="" />
                            : <div className="table-thumb-placeholder">📚</div>
                          }
                        </div>
                        <div>
                          <div className="table-title">{course.title}</div>
                          <div className="table-desc">{course.description?.slice(0, 60)}…</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${course.category === 'Technology' ? 'badge-tech' : course.category === 'Data Science' ? 'badge-data' : course.category === 'Design' ? 'badge-design' : course.category === 'Business' ? 'badge-business' : 'badge-marketing'}`}>
                        {course.category}
                      </span>
                    </td>
                    <td className="table-num">{course.lesson_count || 0}</td>
                    <td className="table-num">{course.enrollment_count || 0}</td>
                    <td>
                      <div className="table-actions">
                        <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/courses/${course.id}`)}>View</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/admin/courses/${course.id}/edit`)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => setConfirmDelete(course)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {confirmDelete && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Delete Course?</h2>
              <button className="btn btn-ghost btn-sm" onClick={() => setConfirmDelete(null)}>✕</button>
            </div>
            <p style={{color:'var(--text-muted)',marginBottom:'24px'}}>
              Are you sure you want to delete <strong>"{confirmDelete.title}"</strong>?
              This will remove all lessons and enrollments. This action cannot be undone.
            </p>
            <div style={{display:'flex',gap:'12px',justifyContent:'flex-end'}}>
              <button className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(confirmDelete.id)}
                disabled={deletingId === confirmDelete.id}
              >
                {deletingId === confirmDelete.id ? 'Deleting…' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

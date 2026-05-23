import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './StudentDashboard.css';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/enrollments/my').then(res => setCourses(res.data.courses)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="page-header">
          <h1>My Learning</h1>
          <p>Welcome back, {user.name}! Continue where you left off.</p>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-value">{courses.length}</div>
            <div className="stat-label">Enrolled Courses</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {courses.reduce((s, c) => s + (c.completed_count || 0), 0)}
            </div>
            <div className="stat-label">Lessons Completed</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {courses.filter(c => c.lesson_count > 0 && c.completed_count >= c.lesson_count).length}
            </div>
            <div className="stat-label">Courses Finished</div>
          </div>
        </div>

        {courses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>No courses yet</h3>
            <p>Explore the catalog and enroll in your first course</p>
            <Link to="/catalog" className="btn btn-primary" style={{marginTop: '16px'}}>Browse Catalog</Link>
          </div>
        ) : (
          <>
            <h2 className="section-title">Continue Learning</h2>
            <div className="enrolled-courses">
              {courses.map(course => {
                const progress = course.lesson_count > 0
                  ? Math.round((course.completed_count / course.lesson_count) * 100)
                  : 0;
                const finished = course.lesson_count > 0 && course.completed_count >= course.lesson_count;
                return (
                  <div key={course.id} className="enrolled-card">
                    <div className="enrolled-thumb">
                      {course.thumbnail ? (
                        <img src={course.thumbnail} alt={course.title} />
                      ) : (
                        <div className="enrolled-thumb-placeholder">📚</div>
                      )}
                    </div>
                    <div className="enrolled-info">
                      <div className="enrolled-header">
                        <h3>{course.title}</h3>
                        {finished && <span className="finished-badge">✓ Completed</span>}
                      </div>
                      <div className="enrolled-meta">
                        <span className={`badge ${course.category === 'Technology' ? 'badge-tech' : course.category === 'Data Science' ? 'badge-data' : course.category === 'Design' ? 'badge-design' : course.category === 'Business' ? 'badge-business' : 'badge-marketing'}`}>
                          {course.category}
                        </span>
                        <span className="lesson-count">{course.lesson_count} lessons</span>
                      </div>
                      <div className="progress-row">
                        <div className="progress-bar-container" style={{flex:1}}>
                          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                        </div>
                        <span className="progress-num">{progress}%</span>
                      </div>
                      <div className="lessons-progress">
                        {course.completed_count} / {course.lesson_count} lessons
                      </div>
                    </div>
                    <Link to={`/courses/${course.id}`} className="btn btn-primary btn-sm">
                      {finished ? 'Review' : 'Continue'}
                    </Link>
                  </div>
                );
              })}
            </div>
          </>
        )}

        <div className="explore-more">
          <Link to="/catalog" className="btn btn-secondary">Explore More Courses →</Link>
        </div>
      </div>
    </div>
  );
}

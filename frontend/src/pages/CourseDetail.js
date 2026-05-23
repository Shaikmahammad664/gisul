import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './CourseDetail.css';

const CATEGORY_COLORS = {
  Technology: 'badge-tech', 'Data Science': 'badge-data', Design: 'badge-design',
  Business: 'badge-business', Marketing: 'badge-marketing',
};

export default function CourseDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchCourse();
  }, [id]);

  useEffect(() => {
    if (user && enrolled) {
      fetchProgress();
    }
  }, [enrolled, user]);

  const fetchCourse = async () => {
    try {
      const res = await api.get(`/courses/${id}`);
      setCourse(res.data.course);
      if (user) {
        const statusRes = await api.get(`/enrollments/${id}/status`);
        setEnrolled(statusRes.data.enrolled);
      }
    } catch (err) {
      setError('Course not found');
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async () => {
    try {
      const res = await api.get(`/enrollments/${id}/progress`);
      setCompletedLessons(res.data.completedLessons);
    } catch (err) {}
  };

  const handleEnroll = async () => {
    if (!user) { navigate('/login'); return; }
    setEnrolling(true);
    try {
      await api.post(`/enrollments/${id}`);
      setEnrolled(true);
      setSuccess('Successfully enrolled! Start learning below.');
    } catch (err) {
      setError(err.response?.data?.error || 'Enrollment failed');
    } finally {
      setEnrolling(false);
    }
  };

  const toggleLesson = async (lessonId) => {
    if (!enrolled) return;
    const isCompleted = completedLessons.includes(lessonId);
    try {
      if (isCompleted) {
        await api.delete(`/enrollments/lessons/${lessonId}/complete`);
        setCompletedLessons(prev => prev.filter(l => l !== lessonId));
      } else {
        await api.post(`/enrollments/lessons/${lessonId}/complete`);
        setCompletedLessons(prev => [...prev, lessonId]);
      }
    } catch (err) {}
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (!course) return <div className="container" style={{paddingTop:'60px'}}><div className="alert alert-error">{error}</div></div>;

  const totalLessons = course.lessons?.length || 0;
  const progress = totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 0;
  const badgeClass = CATEGORY_COLORS[course.category] || 'badge-default';

  return (
    <div className="course-detail">
      <div className="course-hero">
        <div className="container">
          <div className="course-hero-inner">
            <div className="course-hero-content">
              <Link to="/catalog" className="back-link">← Back to Catalog</Link>
              <span className={`badge ${badgeClass}`}>{course.category}</span>
              <h1>{course.title}</h1>
              <p className="course-desc">{course.description}</p>
              <div className="course-stats">
                <span>📖 {totalLessons} lessons</span>
                <span>👥 {course.enrollment_count} students</span>
                {course.instructor_name && <span>👨‍🏫 {course.instructor_name}</span>}
              </div>

              {error && <div className="alert alert-error">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              {user?.role === 'student' && (
                enrolled ? (
                  <div className="enrolled-status">
                    <span className="enrolled-badge">✓ Enrolled</span>
                    <Link to="/dashboard" className="btn btn-secondary">Go to Dashboard</Link>
                  </div>
                ) : (
                  <button className="btn btn-primary btn-lg" onClick={handleEnroll} disabled={enrolling}>
                    {enrolling ? 'Enrolling…' : 'Enroll Now — Free'}
                  </button>
                )
              )}
              {!user && (
                <button className="btn btn-primary btn-lg" onClick={() => navigate('/login')}>
                  Sign In to Enroll
                </button>
              )}
              {user?.role === 'admin' && (
                <Link to={`/admin/courses/${id}/edit`} className="btn btn-secondary">Edit Course</Link>
              )}
            </div>

            <div className="course-hero-image">
              {course.thumbnail ? (
                <img src={course.thumbnail} alt={course.title} />
              ) : (
                <div className="hero-placeholder">📚</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="course-content">
          {enrolled && totalLessons > 0 && (
            <div className="progress-section card">
              <div className="progress-header">
                <span className="progress-label">Your Progress</span>
                <span className="progress-pct">{progress}%</span>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
              </div>
              <span className="progress-text">{completedLessons.length} of {totalLessons} lessons completed</span>
            </div>
          )}

          {course.lessons && course.lessons.length > 0 && (
            <div className="lessons-section">
              <h2>Course Curriculum</h2>
              <div className="lessons-list">
                {course.lessons.map((lesson, idx) => {
                  const isCompleted = completedLessons.includes(lesson.id);
                  return (
                    <div
                      key={lesson.id}
                      className={`lesson-item ${isCompleted ? 'completed' : ''} ${enrolled ? 'clickable' : ''}`}
                      onClick={() => enrolled && toggleLesson(lesson.id)}
                    >
                      <div className="lesson-number">{isCompleted ? '✓' : idx + 1}</div>
                      <div className="lesson-info">
                        <div className="lesson-title">{lesson.title}</div>
                        {lesson.content && <div className="lesson-content">{lesson.content}</div>}
                      </div>
                      {enrolled && (
                        <div className="lesson-check">
                          <span className={`check-box ${isCompleted ? 'checked' : ''}`} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import './CourseCard.css';

const CATEGORY_COLORS = {
  Technology: 'badge-tech',
  'Data Science': 'badge-data',
  Design: 'badge-design',
  Business: 'badge-business',
  Marketing: 'badge-marketing',
};

const CATEGORY_PLACEHOLDERS = {
  Technology: 'linear-gradient(135deg, #6c63ff 0%, #3b35cc 100%)',
  'Data Science': 'linear-gradient(135deg, #43e8d8 0%, #1a9e94 100%)',
  Design: 'linear-gradient(135deg, #ff6584 0%, #cc3555 100%)',
  Business: 'linear-gradient(135deg, #ffb347 0%, #cc7a00 100%)',
  Marketing: 'linear-gradient(135deg, #43e8a0 0%, #1aad6b 100%)',
};

export default function CourseCard({ course, actions }) {
  const badgeClass = CATEGORY_COLORS[course.category] || 'badge-default';
  const placeholderBg = CATEGORY_PLACEHOLDERS[course.category] || 'linear-gradient(135deg, #6c63ff, #ff6584)';

  return (
    <div className="course-card">
      <Link to={`/courses/${course.id}`} className="course-card-thumbnail">
        {course.thumbnail ? (
          <img src={course.thumbnail} alt={course.title} />
        ) : (
          <div className="thumbnail-placeholder" style={{ background: placeholderBg }}>
            <span>{course.category?.charAt(0) || '📚'}</span>
          </div>
        )}
        <span className={`badge ${badgeClass} category-badge`}>{course.category}</span>
      </Link>

      <div className="course-card-body">
        <Link to={`/courses/${course.id}`} className="course-title">{course.title}</Link>
        <p className="course-description">{course.description}</p>

        <div className="course-meta">
          {course.lesson_count !== undefined && (
            <span className="meta-item">📖 {course.lesson_count} lessons</span>
          )}
          {course.enrollment_count !== undefined && (
            <span className="meta-item">👥 {course.enrollment_count} enrolled</span>
          )}
        </div>

        {course.instructor_name && (
          <div className="course-instructor">by {course.instructor_name}</div>
        )}

        {actions && <div className="course-actions">{actions}</div>}
      </div>
    </div>
  );
}

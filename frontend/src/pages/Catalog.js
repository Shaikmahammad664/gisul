import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import CourseCard from '../components/CourseCard';
import './Catalog.css';

const CATEGORIES = ['All', 'Technology', 'Data Science', 'Design', 'Business', 'Marketing'];

export default function Catalog() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, [search, category]);

  const fetchCourses = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (category !== 'all') params.category = category;
      const res = await api.get('/courses', { params });
      setCourses(res.data.courses);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="catalog-page">
      <div className="catalog-hero">
        <div className="container">
          <h1>Explore Courses</h1>
          <p>Discover top-quality courses across technology, design, business, and more</p>
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search courses…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="search-input"
            />
            {search && (
              <button className="search-clear" onClick={() => setSearch('')}>✕</button>
            )}
          </div>
        </div>
      </div>

      <div className="container">
        <div className="filter-bar">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${category === cat.toLowerCase() ? 'active' : ''}`}
              onClick={() => setCategory(cat.toLowerCase() === 'all' ? 'all' : cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-state"><div className="spinner" /></div>
        ) : courses.length === 0 ? (
          <div className="empty-state">
            <h3>No courses found</h3>
            <p>Try a different search or category</p>
          </div>
        ) : (
          <>
            <p className="results-count">{courses.length} course{courses.length !== 1 ? 's' : ''}</p>
            <div className="grid-3">
              {courses.map(course => (
                <CourseCard
                  key={course.id}
                  course={course}
                  actions={
                    <button className="btn btn-primary btn-sm" onClick={() => navigate(`/courses/${course.id}`)}>
                      View Course
                    </button>
                  }
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

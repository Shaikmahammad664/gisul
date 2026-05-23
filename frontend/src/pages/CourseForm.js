import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';
import './CourseForm.css';

const CATEGORIES = ['Technology', 'Data Science', 'Design', 'Business', 'Marketing', 'Health', 'Other'];

export default function CourseForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    title: '', description: '', category: 'Technology', thumbnail: ''
  });
  const [lessons, setLessons] = useState([{ title: '', content: '' }]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      api.get(`/courses/${id}`)
        .then(res => {
          const c = res.data.course;
          setForm({ title: c.title, description: c.description, category: c.category, thumbnail: c.thumbnail || '' });
          if (c.lessons && c.lessons.length > 0) {
            setLessons(c.lessons.map(l => ({ id: l.id, title: l.title, content: l.content || '' })));
          }
        })
        .catch(() => setError('Course not found'))
        .finally(() => setFetching(false));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title.trim() || !form.description.trim()) {
      setError('Title and description are required'); return;
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        thumbnail: form.thumbnail || null,
        lessons: lessons.filter(l => l.title.trim())
      };
      if (isEdit) {
        await api.put(`/courses/${id}`, payload);
      } else {
        await api.post('/courses', payload);
      }
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save course');
    } finally {
      setLoading(false);
    }
  };

  const addLesson = () => setLessons(prev => [...prev, { title: '', content: '' }]);
  const removeLesson = (idx) => setLessons(prev => prev.filter((_, i) => i !== idx));
  const updateLesson = (idx, field, value) => {
    setLessons(prev => prev.map((l, i) => i === idx ? { ...l, [field]: value } : l));
  };

  if (fetching) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div className="course-form-page">
      <div className="container" style={{maxWidth: '720px'}}>
        <div className="page-header">
          <h1>{isEdit ? 'Edit Course' : 'Create New Course'}</h1>
          <p>{isEdit ? 'Update the course details' : 'Fill in the details to create a new course'}</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="course-form">
          <div className="form-section">
            <h2>Course Info</h2>
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input
                type="text" className="form-input"
                value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                placeholder="e.g. Introduction to Web Development"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea
                className="form-textarea" rows="4"
                value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                placeholder="Describe what students will learn…"
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select className="form-select" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Thumbnail URL</label>
                <input
                  type="url" className="form-input"
                  value={form.thumbnail} onChange={e => setForm({...form, thumbnail: e.target.value})}
                  placeholder="https://…"
                />
              </div>
            </div>
            {form.thumbnail && (
              <div className="thumbnail-preview">
                <img src={form.thumbnail} alt="thumbnail preview" onError={e => e.target.style.display='none'} />
              </div>
            )}
          </div>

          <div className="form-section">
            <div className="section-header">
              <h2>Lessons</h2>
              <button type="button" className="btn btn-secondary btn-sm" onClick={addLesson}>+ Add Lesson</button>
            </div>
            {lessons.map((lesson, idx) => (
              <div key={idx} className="lesson-form-item">
                <div className="lesson-form-header">
                  <span className="lesson-num">Lesson {idx + 1}</span>
                  {lessons.length > 1 && (
                    <button type="button" className="btn-remove" onClick={() => removeLesson(idx)}>✕</button>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input
                    type="text" className="form-input"
                    value={lesson.title} onChange={e => updateLesson(idx, 'title', e.target.value)}
                    placeholder="e.g. Introduction to HTML"
                  />
                </div>
                <div className="form-group" style={{marginBottom:0}}>
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-textarea" rows="2"
                    value={lesson.content} onChange={e => updateLesson(idx, 'content', e.target.value)}
                    placeholder="What will be covered in this lesson…"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin')}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving…' : isEdit ? 'Update Course' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { query, run, get } = require('../db');
const { authMiddleware, adminOnly } = require('../middleware');

// Get all courses (with optional search & filter)
router.get('/', (req, res) => {
  try {
    const { search, category } = req.query;
    let sql = `
      SELECT c.*, u.name as instructor_name,
        (SELECT COUNT(*) FROM enrollments WHERE course_id = c.id) as enrollment_count,
        (SELECT COUNT(*) FROM lessons WHERE course_id = c.id) as lesson_count
      FROM courses c
      LEFT JOIN users u ON c.instructor_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      sql += ` AND (LOWER(c.title) LIKE LOWER(?) OR LOWER(c.description) LIKE LOWER(?))`;
      params.push(`%${search}%`, `%${search}%`);
    }
    if (category && category !== 'all') {
      sql += ` AND c.category = ?`;
      params.push(category);
    }
    sql += ` ORDER BY c.created_at DESC`;

    const courses = query(sql, params);
    res.json({ courses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single course
router.get('/:id', (req, res) => {
  try {
    const course = get(`
      SELECT c.*, u.name as instructor_name,
        (SELECT COUNT(*) FROM enrollments WHERE course_id = c.id) as enrollment_count
      FROM courses c
      LEFT JOIN users u ON c.instructor_id = u.id
      WHERE c.id = ?
    `, [req.params.id]);

    if (!course) return res.status(404).json({ error: 'Course not found' });

    const lessons = query(
      'SELECT * FROM lessons WHERE course_id = ? ORDER BY order_idx ASC',
      [req.params.id]
    );

    res.json({ course: { ...course, lessons } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create course (admin only)
router.post('/', authMiddleware, adminOnly, (req, res) => {
  try {
    const { title, description, category, thumbnail, lessons } = req.body;
    if (!title || !description || !category) {
      return res.status(400).json({ error: 'Title, description, and category required' });
    }

    const id = uuidv4();
    run(
      'INSERT INTO courses (id, title, description, category, thumbnail, instructor_id) VALUES (?, ?, ?, ?, ?, ?)',
      [id, title, description, category, thumbnail || null, req.user.id]
    );

    // Add lessons if provided
    if (lessons && Array.isArray(lessons)) {
      lessons.forEach((lesson, idx) => {
        const lid = uuidv4();
        run(
          'INSERT INTO lessons (id, course_id, title, content, order_idx) VALUES (?, ?, ?, ?, ?)',
          [lid, id, lesson.title, lesson.content || '', idx]
        );
      });
    }

    const course = get('SELECT * FROM courses WHERE id = ?', [id]);
    res.status(201).json({ course });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update course (admin only)
router.put('/:id', authMiddleware, adminOnly, (req, res) => {
  try {
    const { title, description, category, thumbnail } = req.body;
    const course = get('SELECT * FROM courses WHERE id = ?', [req.params.id]);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    run(
      `UPDATE courses SET title = ?, description = ?, category = ?, thumbnail = ?, updated_at = datetime('now') WHERE id = ?`,
      [
        title || course.title,
        description || course.description,
        category || course.category,
        thumbnail !== undefined ? thumbnail : course.thumbnail,
        req.params.id
      ]
    );

    const updated = get('SELECT * FROM courses WHERE id = ?', [req.params.id]);
    res.json({ course: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete course (admin only)
router.delete('/:id', authMiddleware, adminOnly, (req, res) => {
  try {
    const course = get('SELECT * FROM courses WHERE id = ?', [req.params.id]);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    run('DELETE FROM courses WHERE id = ?', [req.params.id]);
    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get categories
router.get('/meta/categories', (req, res) => {
  try {
    const rows = query('SELECT DISTINCT category FROM courses ORDER BY category');
    res.json({ categories: rows.map(r => r.category) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

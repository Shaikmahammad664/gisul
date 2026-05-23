const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { query, run, get } = require('../db');
const { authMiddleware } = require('../middleware');

// Get student's enrolled courses
router.get('/my', authMiddleware, (req, res) => {
  try {
    const courses = query(`
      SELECT c.*, e.enrolled_at,
        (SELECT COUNT(*) FROM lessons WHERE course_id = c.id) as lesson_count,
        (SELECT COUNT(*) FROM lesson_completions lc
          JOIN lessons l ON lc.lesson_id = l.id
          WHERE l.course_id = c.id AND lc.student_id = ?) as completed_count
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      WHERE e.student_id = ?
      ORDER BY e.enrolled_at DESC
    `, [req.user.id, req.user.id]);

    res.json({ courses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Enroll in a course
router.post('/:courseId', authMiddleware, (req, res) => {
  try {
    const course = get('SELECT * FROM courses WHERE id = ?', [req.params.courseId]);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const existing = get(
      'SELECT * FROM enrollments WHERE student_id = ? AND course_id = ?',
      [req.user.id, req.params.courseId]
    );
    if (existing) return res.status(409).json({ error: 'Already enrolled' });

    const id = uuidv4();
    run(
      'INSERT INTO enrollments (id, student_id, course_id) VALUES (?, ?, ?)',
      [id, req.user.id, req.params.courseId]
    );

    res.status(201).json({ message: 'Enrolled successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Check enrollment status
router.get('/:courseId/status', authMiddleware, (req, res) => {
  try {
    const enrollment = get(
      'SELECT * FROM enrollments WHERE student_id = ? AND course_id = ?',
      [req.user.id, req.params.courseId]
    );
    res.json({ enrolled: !!enrollment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark lesson complete
router.post('/lessons/:lessonId/complete', authMiddleware, (req, res) => {
  try {
    const lesson = get('SELECT * FROM lessons WHERE id = ?', [req.params.lessonId]);
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });

    // Check student is enrolled
    const enrollment = get(
      'SELECT * FROM enrollments WHERE student_id = ? AND course_id = ?',
      [req.user.id, lesson.course_id]
    );
    if (!enrollment) return res.status(403).json({ error: 'Not enrolled in this course' });

    const existing = get(
      'SELECT * FROM lesson_completions WHERE student_id = ? AND lesson_id = ?',
      [req.user.id, req.params.lessonId]
    );
    if (!existing) {
      const id = uuidv4();
      run(
        'INSERT INTO lesson_completions (id, student_id, lesson_id) VALUES (?, ?, ?)',
        [id, req.user.id, req.params.lessonId]
      );
    }

    res.json({ message: 'Lesson marked complete' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Unmark lesson complete
router.delete('/lessons/:lessonId/complete', authMiddleware, (req, res) => {
  try {
    run(
      'DELETE FROM lesson_completions WHERE student_id = ? AND lesson_id = ?',
      [req.user.id, req.params.lessonId]
    );
    res.json({ message: 'Lesson unmarked' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get completions for a course
router.get('/:courseId/progress', authMiddleware, (req, res) => {
  try {
    const completions = query(`
      SELECT lc.lesson_id FROM lesson_completions lc
      JOIN lessons l ON lc.lesson_id = l.id
      WHERE lc.student_id = ? AND l.course_id = ?
    `, [req.user.id, req.params.courseId]);

    res.json({ completedLessons: completions.map(c => c.lesson_id) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

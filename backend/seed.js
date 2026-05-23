const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

async function seed(db, query, run, get) {
  // Check if already seeded
  const existing = get('SELECT id FROM users WHERE email = ?', ['admin@gisul.com']);
  if (existing) {
    console.log('Database already seeded');
    return;
  }

  console.log('Seeding database...');

  // Create admin user
  const adminId = uuidv4();
  const adminPass = await bcrypt.hash('admin123', 10);
  run(
    'INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
    [adminId, 'Admin User', 'admin@gisul.com', adminPass, 'admin']
  );

  // Create student user
  const studentId = uuidv4();
  const studentPass = await bcrypt.hash('student123', 10);
  run(
    'INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
    [studentId, 'Jane Student', 'student@gisul.com', studentPass, 'student']
  );

  // Create courses with lessons
  const courses = [
    {
      title: 'Introduction to Web Development',
      description: 'Learn the fundamentals of HTML, CSS, and JavaScript. Build your first website from scratch with hands-on projects and real-world examples. This comprehensive course covers everything from setting up your development environment to deploying your first website.',
      category: 'Technology',
      thumbnail: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=600',
      lessons: [
        { title: 'Setting Up Your Environment', content: 'Install VS Code, Node.js, and essential browser dev tools.' },
        { title: 'HTML Basics', content: 'Learn the structure of web pages with HTML tags, attributes, and semantic markup.' },
        { title: 'CSS Fundamentals', content: 'Style your pages with CSS — selectors, properties, the box model.' },
        { title: 'JavaScript Introduction', content: 'Learn variables, functions, DOM manipulation, and event handling.' },
        { title: 'Your First Project', content: 'Build and deploy a complete personal portfolio website.' },
      ]
    },
    {
      title: 'Data Science with Python',
      description: 'Master data analysis, visualization, and machine learning with Python. From pandas to scikit-learn, this course takes you from raw data to actionable insights. Perfect for analysts and engineers looking to add data science to their toolkit.',
      category: 'Data Science',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600',
      lessons: [
        { title: 'Python for Data Analysis', content: 'NumPy arrays, pandas DataFrames — the backbone of data science.' },
        { title: 'Data Visualization', content: 'Create compelling charts with Matplotlib and Seaborn.' },
        { title: 'Statistical Foundations', content: 'Probability distributions, hypothesis testing, and statistical inference.' },
        { title: 'Machine Learning Basics', content: 'Train and evaluate models with scikit-learn.' },
        { title: 'Capstone Project', content: 'Analyze a real dataset and present your findings.' },
      ]
    },
    {
      title: 'UX/UI Design Principles',
      description: 'Design beautiful and intuitive user interfaces. Learn Figma, design systems, user research, and prototyping. Understand the psychology behind great UX and create products users actually love to use.',
      category: 'Design',
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600',
      lessons: [
        { title: 'Design Thinking', content: 'Empathize, define, ideate, prototype, and test.' },
        { title: 'Figma Fundamentals', content: 'Frames, components, auto-layout, and prototyping in Figma.' },
        { title: 'Color Theory & Typography', content: 'Create visual hierarchy with color palettes and type systems.' },
        { title: 'User Research Methods', content: 'Interviews, usability testing, and synthesizing feedback.' },
        { title: 'Building a Design System', content: 'Create reusable components and documentation for a design system.' },
      ]
    },
    {
      title: 'Business Strategy & Leadership',
      description: 'Develop the strategic thinking and leadership skills needed to thrive in modern business. Covers competitive analysis, organizational behavior, decision-making frameworks, and building high-performing teams.',
      category: 'Business',
      thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600',
      lessons: [
        { title: 'Strategic Frameworks', content: 'Porter\'s Five Forces, SWOT, and the Business Model Canvas.' },
        { title: 'Leadership Styles', content: 'Transformational vs transactional leadership — when to use each.' },
        { title: 'Decision Making Under Uncertainty', content: 'Probabilistic thinking, scenario planning, and reducing cognitive bias.' },
        { title: 'Team Dynamics', content: 'Building trust, managing conflict, and creating psychological safety.' },
      ]
    },
    {
      title: 'Digital Marketing Masterclass',
      description: 'Learn modern digital marketing from SEO and content strategy to paid advertising and analytics. Understand how to grow an audience, generate leads, and measure ROI across every major digital channel.',
      category: 'Marketing',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600',
      lessons: [
        { title: 'SEO Fundamentals', content: 'Keyword research, on-page optimization, and building backlinks.' },
        { title: 'Content Marketing', content: 'Create content that ranks, engages, and converts.' },
        { title: 'Paid Advertising', content: 'Google Ads and Meta Ads — structure, targeting, and optimization.' },
        { title: 'Analytics & Attribution', content: 'GA4, UTM parameters, and measuring marketing ROI.' },
      ]
    },
  ];

  for (const course of courses) {
    const courseId = uuidv4();
    run(
      'INSERT INTO courses (id, title, description, category, thumbnail, instructor_id) VALUES (?, ?, ?, ?, ?, ?)',
      [courseId, course.title, course.description, course.category, course.thumbnail, adminId]
    );

    course.lessons.forEach((lesson, idx) => {
      const lessonId = uuidv4();
      run(
        'INSERT INTO lessons (id, course_id, title, content, order_idx) VALUES (?, ?, ?, ?, ?)',
        [lessonId, courseId, lesson.title, lesson.content, idx]
      );
    });
  }

  // Enroll student in first two courses
  const firstTwo = query('SELECT id FROM courses LIMIT 2', []);
  for (const course of firstTwo) {
    run(
      'INSERT INTO enrollments (id, student_id, course_id) VALUES (?, ?, ?)',
      [uuidv4(), studentId, course.id]
    );
  }

  console.log('✅ Seed complete:');
  console.log('  admin@gisul.com / admin123');
  console.log('  student@gisul.com / student123');
}

module.exports = { seed };

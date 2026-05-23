require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { getDb, query, run, get } = require('./db');
const { seed } = require('./seed');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/enrollments', require('./routes/enrollments'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Start server
async function start() {
  await getDb(); // init db
  await seed(null, query, run, get); // seed demo data

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

start().catch(console.error);

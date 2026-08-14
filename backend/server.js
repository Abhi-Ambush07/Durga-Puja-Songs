const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());

// Configure PostgreSQL connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'songs',
  password: 'postgres',
  port: 5432,
});

// Endpoint to fetch the playlist
app.get('/api/songs', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM songsyt ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => console.log('Backend server running on port 3001'));
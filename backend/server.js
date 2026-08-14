const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());

// Configure PostgreSQL connection for Render
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Render's external database connections
  }
});

// Endpoint to fetch the playlist
app.get('/api/songs', async (req, res) => {
  try {
    // Note: You are querying 'songsyt' here. Ensure your table in Render is named exactly 'songsyt'.
    const result = await pool.query('SELECT * FROM songsyt ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Use Render's dynamic port, or fallback to 3001 locally
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));
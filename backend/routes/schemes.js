const express = require('express');
const router = express.Router();
const pool = require('../database');

// Temporary test route to check DB connection
router.get('/test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ success: true, time: result.rows[0] });
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;

const express = require('express');
const pool = require('../database/index');
const router = express.Router();

// Temporary test route to check DB connection

router.get('/test', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ success : true, time: result.rows[0] });
    }
    catch (error) {
        console.error('DB Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
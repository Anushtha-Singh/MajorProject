const express = require('express');
const router = express.Router();
const { fetchLiveSchemes } = require('../controllers/liveschemesController');

router.get('/', fetchLiveSchemes);

module.exports = router;
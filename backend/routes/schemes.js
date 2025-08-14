const express = require('express');
const router = express.Router();
const schemeController = require('../controllers/schemesController');

router.get('/', schemeController.getAllSchemes);
router.get('/search', schemeController.searchSchemes);
router.get('/summary', schemeController.getSummary);
router.get('/:id', schemeController.getSchemeById);

module.exports = router;

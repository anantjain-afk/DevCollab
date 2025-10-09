const express = require('express');
const { register } = require('../Controllers/authcontroller');

const router = express.Router();

// Register Route
router.post('/register', register);

module.exports = router;
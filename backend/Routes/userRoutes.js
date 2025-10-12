const express = require('express');
const {getMe} = require("../Controllers/userController");
const protectRoutes = require('../middleware/protectRoutes');

const router = express.Router();

// Protect all routes after this middleware
router.use('/me', protectRoutes,getMe);

module.exports = router;

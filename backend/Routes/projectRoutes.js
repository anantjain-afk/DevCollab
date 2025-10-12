const express = require('express');
const protectRoutes = require("../middleware/protectRoutes");
const {createProject, getProjectsForUser} = require("../Controllers/projectController");
const router = express.Router();

// All routes after this middleware in this file are protected
router.use(protectRoutes);
router.post('/',createProject);
router.get('/',getProjectsForUser);


module.exports = router;
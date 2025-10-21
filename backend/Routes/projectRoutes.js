const express = require('express');
const protectRoutes = require("../middleware/protectRoutes");
const {createProject, getProjectsForUser, addMemberToProject, getProjectById} = require("../Controllers/projectController");
const router = express.Router();

// All routes after this middleware in this file are protected
router.use(protectRoutes);
router.post('/',createProject);
router.get('/',getProjectsForUser);
router.post('/:projectId/members',addMemberToProject)
router.get('/:projectId',getProjectById)

module.exports = router;
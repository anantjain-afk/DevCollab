const express = require("express");
const protectRoutes = require("../middleware/protectRoutes");
const {
  createProject,
  getProjectsForUser,
  addMemberToProject,
  getProjectById,
  getProjectMessages,
  deleteProject,
} = require("../Controllers/projectController");
const router = express.Router();

// All routes after this middleware in this file are protected
router.use(protectRoutes);
router.post("/", createProject);
router.get("/", getProjectsForUser);
router.post("/:projectId/members", addMemberToProject);
router.get("/:projectId", getProjectById);
router.get("/:projectId/messages", getProjectMessages);
router.delete("/:projectId", deleteProject);
module.exports = router;

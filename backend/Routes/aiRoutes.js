const express = require('express');
const { explainCode, generateSubtasks } = require('../Controllers/aiController');
const Router = express.Router();
const protectRoutes = require('../middleware/protectRoutes');

Router.use(protectRoutes);

Router.post('/explain', explainCode);
Router.post('/generate-tasks', generateSubtasks);

module.exports = Router;
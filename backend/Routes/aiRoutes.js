const express = require('express');
const { explainCode } = require('../Controllers/aiController');
const Router = express.Router();
const protectRoutes = require('../middleware/protectRoutes');

Router.use(protectRoutes);

Router.post('/explain', explainCode);

module.exports = Router;
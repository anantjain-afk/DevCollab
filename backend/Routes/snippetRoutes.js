const express = require('express');
const { createSnippet, getProjectSnippets } = require('../Controllers/snippetController');
const Router = express.Router() ;
const protectRoutes = require("../middleware/protectRoutes");

Router.use(protectRoutes)

Router.post('/' , createSnippet)
Router.get('/' , getProjectSnippets)

module.exports =Router
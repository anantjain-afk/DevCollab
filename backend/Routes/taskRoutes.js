const { createTask } = require('../Controllers/taskController');
const protectRoute  = require('../middleware/protectRoutes.js');
const express = require('express'); 
const router = express.Router(); 



router.use(protectRoute); // protect all routes below this middleware

// Route to create a new task
router.post('/', createTask);


module.exports = router;



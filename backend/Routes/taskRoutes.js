const { createTask,getTasksForProject,updateTask, deleteTask} = require('../Controllers/taskController');
const protectRoute  = require('../middleware/protectRoutes.js');
const express = require('express'); 
const router = express.Router(); 
const {checkMember} = require('../middleware/checkMember.js')


router.use(protectRoute); // protect all routes below this middleware

// Route to create a new task
router.post('/', createTask);
router.get('/project/:projectId', getTasksForProject);
router.patch('/:taskId',checkMember,updateTask)
router.delete('/:taskId',checkMember,deleteTask)

module.exports = router;



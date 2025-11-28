const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create a new task
const createTask = async (req, res) => {
  try {
    const { title, description, projectId, assigneeId } = req.body;
    const userId = req.user.id; //id of the logged in user from the protectRoute middleware
    if (!title || !projectId) {
      return res
        .status(400)
        .json({ message: "Title and Project ID are required" });
    }
    
    // Validate assignee is a project member if assigneeId is provided
    if (assigneeId) {
      const isMember = await prisma.projectUser.findUnique({
        where: {
          userId_projectId: {
            userId: assigneeId,
            projectId: projectId
          }
        }
      });
      
      if (!isMember) {
        return res.status(400).json({ 
          error: 'Assignee must be a member of the project' 
        });
      }
    }
    
    // creating the task
    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        projectId,
        assigneeId,
      },
      include: {
        assignee: {
          select: { id: true, username: true }
        }
      }
    });
    
    // Emit socket event to notify all users in the project room
    const io = req.app.get('io');
    if (io) {
      io.to(projectId).emit('taskCreated', { 
        task: newTask, 
        userId: req.user.id // Include the user who created it
      });
    }
    
    return res.status(201).json(newTask);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// getting all tasks for a project
const getTasksForProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id; //id of the logged in user from the protectRoute middleware
    // Authorization: Check if the user is a member of the project
    const projectMember = await prisma.projectUser.findUnique({
      where: {
        userId_projectId: {
          userId: userId,
          projectId: projectId,
        },
      },
    });
    if (!projectMember) {
      return res
        .status(403)
        .json({ error: "Forbidden. You are not a member of this project." });
    }
    // Fetch all tasks for the project
    const tasks = await prisma.task.findMany({
      where: { projectId },
      include: {
        assignee: { // Also include info about the user assigned to the task
          select: { id: true, username: true }
        }
      }
    });

    res.status(200).json(tasks);

  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};


const updateTask = async(req,res)=>{
  try {
    // updating . 
    const {title, description,status,assigneeId }= req.body
    const {taskId}  = req.params 
    
    // Get the task to find its projectId
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      select: { projectId: true }
    });
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    // Validate assignee is a project member if assigneeId is provided
    if (assigneeId) {
      const isMember = await prisma.projectUser.findUnique({
        where: {
          userId_projectId: {
            userId: assigneeId,
            projectId: task.projectId
          }
        }
      });
      
      if (!isMember) {
        return res.status(400).json({ 
          error: 'Assignee must be a member of the project' 
        });
      }
    }
    
    const updatedTask = await prisma.task.update({
      where : {id : taskId},
      data : {title, description,status,assigneeId},
      include: {
        assignee: {
          select: { id: true, username: true }
        }
      }
    })
    
    // Emit socket event to notify all users in the project room
    const io = req.app.get('io');
    if (io) {
      io.to(task.projectId).emit('taskUpdated', { 
        task: updatedTask, 
        userId: req.user.id 
      });
    }
    
    res.status(200).json(updatedTask);

  } catch (error) {
    console.log('Error updating the task',error)
    res.status(500).json({error: 'Internal server error.'})
  }
}


// delete a task :
const deleteTask = async(req ,res )=>{
  try {
    // deleting 
    const {taskId} = req.params
    
    // Get the task's projectId before deleting it
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      select: { projectId: true }
    });
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    const deletedTask = await prisma.task.delete({
      where : {
        id : taskId
      }
    })
    
    // Emit socket event to notify all users in the project room
    const io = req.app.get('io');
    if (io) {
      io.to(task.projectId).emit('taskDeleted', { 
        taskId, 
        userId: req.user.id 
      });
    }
    
    res.status(204).json()

  } catch (error) {
    console.log("error while deleting a task , error :",error)
    return res.status(500).json({error : 'Internal server error'})
  }
}
module.exports = {
  createTask,
  getTasksForProject,
  updateTask,
  deleteTask
};

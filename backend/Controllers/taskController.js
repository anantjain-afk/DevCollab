const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create a new task
const createTask = async (req, res) => {
  try {
    const { title, description, projectId, assigneeId } = req.body;
    const userId = req.user.id //id of the logged in user from the protectRoute middleware
    if (!title || !projectId) {
      return res
        .status(400)
        .json({ message: "Title and Project ID are required" });
    }
    // important : checking if the user is the member of the project .
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
    // creating the task
    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        projectId,
        assigneeId,
      },
    });
    return res.status(201).json(newTask);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = {
  createTask,
};
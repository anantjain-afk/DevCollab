const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    // we get the user id from req.user which was set by the protectRoutes middleware
    const userId = req.user.id;
    if (!name) {
      return res.status(400).json({ error: "Project name is required" });
    }
    const newProject = await prisma.project.create({
      data: {
        name,
        description,
        // this is the powerful part , here we have created the project and
        // at the same time we created a related record in the ProjectUser join table in a single operation.
        members: {
          create: {
            userId: userId,
            role: "ADMIN", // the user who creates the project is an admin by default
          },
        },
      },
      // include the members in the response
      include: { members: true },
    });
    res.status(201).json(newProject);
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// get projects for user :
const getProjectsForUser = async (req, res) => {
  try {
    // userId of the logged in user. 
    const userId = req.user.id;
    
    // so , what is happening here that we will retrieve all those project which have at least one member with the given userId.
    // means // finding all the projects where the users is a member .
    const projects = await prisma.project.findMany({
      where: {
        // we are looking inside the members relation for the userId
        members: {
          // al least one member with the given userId . 
          some: {
            userId: userId,
          },
        },
        // optionally , we can include the members in the response
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
          },
        },
      },
    });
    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = { createProject , getProjectsForUser };

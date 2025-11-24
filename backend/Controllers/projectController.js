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

// add member to project
const addMemberToProject = async (req, res) => {
  try {
    const { email } = req.body;
    const { projectId } = req.params; //we will add the user by its email .
    const requesterId = req.user.id; // the person making the request (logged in user. )
    if (!email) {
      return res.status(400).json({ error: "User email is required." });
    }
    // authorization : verify if the requester is an admin or not .
    const requesterMembership = await prisma.projectUser.findUnique({
      where: {
        userId_projectId: {
          userId: requesterId,
          projectId: projectId,
        },
      },
    });
    if (!requesterMembership || requesterMembership.role != "ADMIN") {
      return res
        .status(403)
        .json({ error: "Forbidden. Only project admins can add members." });
    }
    // find the user to add .
    const userToAdd = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!userToAdd) {
      return res.status(400).json({
        error: "user does not exists with this email .",
      });
    }
    // Check if the user is already a member
    const existingMembership = await prisma.projectUser.findUnique({
      where: {
        userId_projectId: {
          userId: userToAdd.id,
          projectId: projectId,
        },
      },
    });
    if (existingMembership) {
      return res
        .status(409)
        .json({ error: "User is already a member of this project." });
    }
    // add the user to the project .
    const newMember = await prisma.projectUser.create({
      data: {
        projectId: projectId,
        userId: userToAdd.id,
        role: "MEMBER", // New users are added as 'MEMBER' by default
      },
    });
    res
      .status(201)
      .json({
        message: "User added to project successfully.",
        membership: newMember,
      });
  } catch (error) {
    console.error("Error adding member to project:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

const getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;
    // check if the logged in user is a member of the project or not
    const userId = req.user.id;
    const membership = await prisma.projectUser.findUnique({
      where: {
        userId_projectId: {
          userId: userId,
          projectId: projectId,
        },
      },
    });
    if (!membership) {
      return res
        .status(403)
        .json({ error: "Forbidden. you are not a member of this project. " });
    }
    // fetch the project details .
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      include: {
        // include the list of members of this project . 
        members : {
          include : {
            user :{
              select : {
                id : true , 
                username : true ,
                email : true 
              }
            }
          }
        },
        // include the list of tasks for this project . 
        tasks: {
          include: {
            assignee: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
      },
     
      
    });
    if(!project){
      return res.status(404).json({error : "Project not found. "})
    }
    return res.json(project)
  } catch (error) {
    console.error("Error fetching project by ID:", error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

const getProjectMessages = async (req, res) => {
  try {
    const { projectId } = req.params;
    const messages = await prisma.message.findMany({
      where: { projectId },
      orderBy: { createdAt: 'asc' }, // Oldest first
      include: {
        user: { select: { id: true, username: true } }
      }
    });

    // Format for frontend
    const formattedMessages = messages.map(msg => ({
      id: msg.id,
      text: msg.content,
      user: msg.user.username,
      userId: msg.user.id,
      time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));

    res.status(200).json(formattedMessages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

module.exports = { createProject, getProjectsForUser, addMemberToProject , getProjectById  , getProjectMessages };

const {prisma} = require('../db/config')
const checkMember = async (req , res ,next) => {
    try {
        
        const {taskId} = req.params 
        const userId = req.user.id 
        const task = await prisma.task.findUnique({
          where : {
            id : taskId
          }
        })

        if (!task){
          return res.status(404).json({error : 'Task not found.'})
        }
        // checking if the logged in user is a member of the project or not . 
        const user = await prisma.ProjectUser.findUnique({
          where : {
            userId_projectId : {userId : userId , projectId : task.projectId}
          }
        })
        if(!user){
          return res.status(403).json({error : 'Forbidden. You are not a member of this project. '})
        }
        next()
    } catch (error) {
        console.log('Error while checking if the logged in user is a member.',Error)
        res.status(500).json({error : 'Internal Server Error .'})
    }

}

module.exports = {checkMember}
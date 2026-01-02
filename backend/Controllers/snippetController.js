const {PrismaClient} = require("@prisma/client");
const prisma= new PrismaClient() ;


const createSnippet = async(req,res) => {
    try {
        const {title , code , language , projectId} = req.body;
        const userId = req.user.id ; 
        const snippet = await prisma.snippet.create({
            data : {
                title, code , language , projectId , userId 
            }
        })
        res.status(201).json(snippet);

    } catch (error) {
        console.log("error creating snippets", error)
        res.status(500).json({
            error : "Failed to create snippet"
        })
    }
}

const getProjectSnippets = async(req,res)=>{
    try {
        const {projectId} = req.params ;
        const snippets = await prisma.snippet.findMany({
            where : {
                projectId 
            },
            orderBy : {
                createdAt : "desc"
            }
        })
        res.json(snippets)
    } catch (error) {
        console.log("error fetching snippets", error)
        res.status(500).json({
            error : "Failed to fetch snippets."
        })
        
    }
}

module.exports = {
    createSnippet , 
    getProjectSnippets
}
const getMe = async(req, res) => {
    try{
        const {password , ...userWithoutPassword} = req.user;
    // here userWithoutPassword is a new object that is created on the fly. It's an exact copy of the req.user object, but with the password property completely removed.
    res.status(200).json({user : userWithoutPassword});

    }catch(error){
        console.log("Error in getMe controller", error);
        res.status(500).json({error : "Internal Server Error"});
    }
    

 
}
module.exports = {getMe};
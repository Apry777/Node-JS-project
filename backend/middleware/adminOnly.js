
const adminOnly = async (req, res, next) => {
    console.log(req.user);
    try{
        if(req.user?.role !== 'admin'){
            return res.status(403).json({ message : 'Access Denied. Admins Only.'})
        }
    }catch(err){
        return res.status(501).json({ error : err.message});
    }
    next();
}

 export default adminOnly;
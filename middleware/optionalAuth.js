import jwt from 'jsonwebtoken';

const optionalAuth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if(token){
        try{
            req.user = jwt.verify(token, process.env.JWT_SECRET);
        }catch(err){
            req.user = null;
        }
    }
    next();
}

export default optionalAuth;
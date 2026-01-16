import jwt from 'jsonwebtoken';

const optionalAuth = (req, res, next) => {
    //const token = req.headers.authorization?.split(' ')[1];
    
    const token = req.cookies.accessToken;
    if(token){
        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            //req.user = jwt.verify(token, process.env.ACCESS_SECRET);
            console.log('DECODED TOKEN:', decoded);
            req.user = decoded;
        }catch(err){
            req.user = null;
        }
    }
    next();
}

export default optionalAuth;
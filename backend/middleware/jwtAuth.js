import jwt from 'jsonwebtoken';


const authMiddleware = (req, res, next) => {

    // console.log('AUTH HEADER:', req.headers.authorization);

    // const token = req.headers.authorization?.split(' ')[1];
    const token = req.cookies.accessToken;

    if(!token){
        return res.status(401).json({ message : 'No token provided'});
    }

    try{

        

       // const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
        console.log('DECODED TOKEN:', decoded);
        req.user = decoded;
        // res.cookie("token",token,{
        //     httpOnly : true,
        //     secure : true,
        //     sameSite : "strict",
        //     maxAge : 86400000
        // });
        next();
    }catch(err){
        return res.status(403).json({ message : 'Invalid token'});
    }
};
 
export default authMiddleware;
 
import jwt from 'jsonwebtoken';


const authMiddleware = (req, res, next) => {

    //console.log('AUTH HEADER:', req.headers.authorization);

    //const token = req.headers.authorization?.split(' ')[1];
    const token = req.cookies.accessToken;

    if(!token){
        return res.status(401).json({ message : 'No token provided'});
    }

    try{

        // res.cookie("token",token,{
        //     httpOnly : true,
        //     secure : true,
        //     sameState : "strict",
        //     maxAge : 86400000
        // });

       // const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
        console.log('DECODED TOKEN:', decoded);
        req.user = decoded;
        next();
    }catch(err){
        res.status(403).json({ message : 'Invalid token'});
    }
};
 
export default authMiddleware;
 
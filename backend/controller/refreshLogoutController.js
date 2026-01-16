import express from 'express';
import jwt from 'jsonwebtoken';


const router = express.Router();

export const refreshPage = async(req, res) => {
    try{
        const token = req.cookies.refreshToken;

        if(!token){
            return res.status(404).json({ message : 'Refresh Token not found'});
        }
        const decoded = jwt.verify(token, process.env.REFRESH_SECRET);
        const newAccessToken = jwt.sign(
            {userId : decoded.userId},
            process.env.ACCESS_SECRET,
            {expiresIn : '10m'}
        );

        res.cookie('accessToken', newAccessToken,{
            httpOnly : true,
            sameSite : 'lax',
            secure : false,
            maxAge : 10 * 60 * 1000
        });

        return res.status(200).json({ message : 'Token Refreshed'});

    }catch(err){
        return res.status(403).json({ message : 'Invalid Token'});
    }
}

export const logout = (req, res) => {
    res
    .clearCookie('accessToken')
    .clearCookie('refreshToken')
    .json({ message : 'Logged Out successfully'});

}



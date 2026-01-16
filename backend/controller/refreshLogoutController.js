import express from 'express';


const router = express.Router();

export const refreshPage = async(req, res) => {
    try{
        const token = req.cookies.refreshToken;

        if(!token){
            return res.status(404).json({ message : 'Token not found'});
        }
        const user = jwt.verify(token, process.env.REFRESH_SECRET);
        const newAccessToken = jwt.sign(
            {userId : user.userId},
            process.env.ACCESS_SECRET,
            {expiresIn : '15m'}
        );

        res.cookie('accessToken', newAccessToken,{
            httpOnly : true,
            sameSite : 'lax',
            secure : false,
            maxAge : 15 * 60 * 1000
        });

        res.status(200).json({ message : 'Token Refreshed'});

    }catch(err){
        res.status(403).json({ message : 'Invalid Token'});
    }
}

export const logout = (req, res) => {
    res
    .clearCookie('accessToken')
    .clearCookie('refreshToken')
    .json({ message : 'Logged Out successfully'});

}



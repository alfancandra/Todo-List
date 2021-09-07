const jwt = require('jsonwebtoken');
require('dotenv').config({path:__dirname+'/./../config/.env'});

module.exports = function(req,res,next){
    const token = req.header('auth-token');
    if(!token) return res.status(401).send('Access Denied');

    try{
        const verified = jwt.verify(token,process.env.USER_KEY);
        req.user = verified;
        next();
    }catch(e){
        res.status(400).send('Invalid Token');
    }
}

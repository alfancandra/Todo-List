const jwt = require('jsonwebtoken');
require('dotenv').config({path:__dirname+'/./../config/.env'});

module.exports = function(req,res,next){
    const token = req.header('auth-token');
    if(!token) return res.status(401).send('Access Denied');

    try{
        jwt.verify(token, process.env.USER_KEY, function(err, decoded) {
            if (err)
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
            
            // if everything good, save to request for use in other routes
            req.userId = decoded.id;
            console.log(decoded.id);
            next();
        });
        // const verified = jwt.verify(token,process.env.USER_KEY);
        // req.user = verified;
        // next();
    }catch(e){
        res.status(400).send('Invalid Token');
    }
}

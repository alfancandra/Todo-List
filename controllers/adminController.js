const config = require('../config/database');
const mysql = require('mysql');
const pool = mysql.createPool(config);
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config({path:__dirname+'/./../config/.env'});

pool.on('error',(err)=> {
    console.error(err);
});

module.exports ={
    // Login Admin
    loginAdmin(req,res){
        try{
            let email = req.body.email;
            let password = req.body.password;
            
            pool.getConnection(function(err, connection) {
                if (err) throw err;
                connection.query(
                    `
                    SELECT * FROM users WHERE email = ?
                    `
                , [
                    email
                ],
                function (error, results) {
                    if(error) throw error;
                    bcrypt.compare(password,results[0].password,(err,result)=>{
                        if(err){
                            return res.status(401).json({
                                message: 'Auth Failed'
                            });
                        }
                        let role_id = results[0].role_id;
                        if(result && role_id==1){
                            const token = jwt.sign({id:results[0].id},process.env.ADMIN_KEY);
                            res.header('auth-token',token);
                            res.send(token);
                            // return res.status(200).json({
                            //     message: 'Auth Success',
                            //     data: results
                            // })
                        }else{
                            res.status(401).json({
                                message: 'Auth Failed'
                            });
                        }
                        
                    });
                });
                connection.release();
            });
        }catch(e){
            res.status(401).json({
                message: 'Auth Failed'
            });
        }
    },
}
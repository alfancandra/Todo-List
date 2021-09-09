const config = require('../config/database');
const mysql = require('mysql');
const { password, user } = require('../config/database');
const pool = mysql.createPool(config);
const bcrypt = require('bcrypt');
const crypto = require("crypto");
const sendEmail = require("../routes/sendEmail");
const assert = require('assert');
const jwt = require('jsonwebtoken');
require('dotenv').config({path:__dirname+'/./../config/.env'});


pool.on('error',(err)=> {
    console.error(err);
});

module.exports ={
    // Ambil data semua Users
    getData(req,res){
        try{
            pool.getConnection(function(err, connection) {
                if (err) throw err;
                connection.query(
                    `
                    SELECT email,fullname,created_at FROM users WHERE role_id=0;
                    `
                , function (error, results) {
                    if(error) throw error;  
                    res.send({ 
                        success: true, 
                        message: 'Berhasil ambil data!',
                        data: results 
                    });
                });
                connection.release();
            });
        }catch(e){
            res.status(404).json({
                success: false, 
                message: 'Gagal!',
            });
        }
    },
    // Ambil data users berdasarkan ID
    getDataByID(req,res){
        try{
            let id = req.params.id;
            pool.getConnection(function(err, connection) {
                if (err) throw err;
                connection.query(
                    `
                    SELECT * FROM users WHERE id = ?;
                    `
                , [id],
                function (error, results) {
                    if(error) throw error;  
                    res.send({ 
                        success: true, 
                        message: 'Berhasil ambil data!',
                        data: results
                    });
                });
                connection.release();
            });
        }catch(e){
            res.status(404).json({
                success: false, 
                message: 'Gagal!',
            });
        }
    },
    // Simpan data users
    addData(req,res){
        try{
            bcrypt.hash(req.body.password,10,(err,hash)=>{
                if(err){
                    return res.status(500).json({
                        error: err
                    });
                }else{
                    
                    let data = {
                        email : req.body.email,
                        password : hash,
                        fullname : req.body.fullname,
                        created_at : new Date(),
                        updated_at : new Date()
                    }
                    pool.getConnection(function(err, connection) {
                        if (err) throw err;
                        connection.query(
                            `
                            INSERT INTO users SET ?
                            `
                        , [
                            data
                        ],
                        function (error, results) {
                            if(error) throw error;  
                            res.send({ 
                                success: true, 
                                message: 'Berhasil tambah data!',
                            });
                        });
                        connection.release();
                    })
                }
            });
        }catch(e){
            res.status(404).json({
                success: false, 
                message: 'Gagal!',
            });
        }
        
    },
    // Login Users
    loginUser(req,res){
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
                try{
                    if(error) throw error;
                    bcrypt.compare(password,results[0].password,(err,result)=>{
                        if(err){
                            return res.status(401).json({
                                message: 'Auth Failed'
                            });
                        }
                        let role_id = results[0].role_id;
                        if(result && role_id==0){
                            const token = jwt.sign({id:results[0].id},process.env.USER_KEY);
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
                }catch(e){
                    res.status(401).json({
                        message: 'Auth Failed'
                    }); 
                }
            });
            connection.release();
        })
    },
    // Find email pada Forgot password
    findEmail(req,res){
        let email = req.body.email;
        
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
                try{
                    var date = new Date();
                    let day = ("0" + date.getDate()).slice(-2);
                    let email = results[0].email;
                    let fullname = results[0].fullname;
                    let id = results[0].id;

                    var algorithm = 'aes256';
                    var key = 'password';
                    const text = fullname+ '' +email+''+day;

                    var cipher = crypto.createCipher(algorithm, key);  
                    var encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
                    var decipher = crypto.createDecipher(algorithm, key);
                    var decrypted = decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
                    let token = encrypted;
                    
                    const link = `https://zbcbcf27c-z9447f5cf-gtw.qovery.io/api/user/reset-password/${id}/${token}`;
                    sendEmail(email, "Password reset", link);
                    res.send({ 
                        success: true, 
                        message: 'email sent sucessfully'
                    });
                }catch(e){
                    res.status(404).json({
                        success: false, 
                        message: 'Gagal!',
                    });
                }
            });
            connection.release();
        })
    },
    // Verifikasi Token pada link
    verifToken(req,res){
        try{
            let id = req.params.id;
            let encrypted = req.params.token;
            let algorithm = 'aes256';
            let key = 'password';
            let decipher = crypto.createDecipher(algorithm, key);
            let decrypted = decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
        
            pool.getConnection(function(err, connection) {
                if (err) throw err;
                connection.query(
                    `
                    SELECT * FROM users WHERE id = ?
                    `
                , [
                    id
                ],
                function (error, results) {
                    if(error){
                        res.status(404).json({
                            success: false, 
                            message: 'Gagal ambil data!',
                        });
                    }
                    
                    let email = results[0].email;
                    let fullname = results[0].fullname;
                    var date = new Date();
                    let day = ("0" + date.getDate()).slice(-2);
                    let emailfullnameday = fullname+''+email+''+day;
                    if(emailfullnameday==decrypted){
                        res.send({ 
                            success: true, 
                            message: 'Lanjut Reset Password!',
                            token: encrypted
                        });
                    }else{
                        res.status(404).json({
                            success: false, 
                            message: 'Gagal!',
                            decrypt: decrypted,
                            dll : emailfullnameday
                        });
                    }
                });
                connection.release();
            })

        }catch(e){
            res.status(404).json({
                success: false, 
                message: 'Gagal!',
            });
        }
        
    },
    resetPassword(req,res){
        try{
            let id = req.params.id;
            let token = req.params.token;

            let new_password = req.body.new_password;

            let algorithm = 'aes256';
            let key = 'password';
            let decipher = crypto.createDecipher(algorithm, key);
            let decrypted = decipher.update(token, 'hex', 'utf8') + decipher.final('utf8');
            
            pool.getConnection(function(err, connection) {
                if (err) throw err;
                connection.query(
                    `
                    SELECT * FROM users WHERE id = ?
                    `
                , [
                    id
                ],
                function (error, results) {
                    if(error){
                        res.status(404).json({
                            success: false, 
                            message: 'Gagal ambil data!',
                        });
                    }
                    
                    let email = results[0].email;
                    let fullname = results[0].fullname;
                    var date = new Date();
                    let day = ("0" + date.getDate()).slice(-2);
                    let emailfullnameday = fullname+''+email+''+day;
                    if(emailfullnameday==decrypted){
                        bcrypt.hash(new_password,10,(err,hash)=>{
                            if(err){
                                return res.status(500).json({
                                    error: err
                                });
                            }else{
                                pool.getConnection(function(err, connection) {
                                    if (err) throw err;
                                    connection.query(
                                        `
                                        UPDATE users SET password=? WHERE id = ?
                                        `
                                    , [
                                        hash,id
                                    ],
                                    function (error, results) {
                                        if(error) throw error;  
                                        res.send({ 
                                            success: true, 
                                            message: 'Berhasil Reset password!',
                                        });
                                    });
                                    connection.release();
                                })
                            }
                        });
                    }else{
                        res.status(404).json({
                            success: false, 
                            message: 'Gagal!',
                        });
                    }
                });
                connection.release();
            })
        }catch(e){
            res.status(404).json({
                success: false, 
                message: 'Gagal!',
            });
        }
    }
}
const config = require('../config/database');
const mysql = require('mysql');
const { password, user } = require('../config/database');
const pool = mysql.createPool(config);
const bcrypt = require('bcrypt');
const crypto = require("crypto");
const sendEmail = require("../routes/sendEmail");
const assert = require('assert');
const jwt = require('jsonwebtoken');

pool.on('error',(err)=> {
    console.error(err);
});

module.exports ={
    // GET ALL TODO
    getTodoAll(req,res){
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query(
                `
                SELECT * FROM todos;
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
        })
    },
    // Add TODO
    addTodo(req,res){
        let data = {
            user_id : req.body.user_id,
            todo : req.body.todo,
            time : req.body.time,
            date : req.body.date
        }
        pool.getConnection(function(err,connection){
            if(err) throw err;
            connection.query(
                `
                INSERT INTO todos SET ?
                `
            , [
                data
            ],
            function (error, results) {
                if(error){
                    res.status(404).json({
                        success: false, 
                        message: 'Gagal!',
                    });
                } 
                res.send({ 
                    success: true, 
                    message: 'Berhasil tambah data!',
                    result:data
                });
            });
            connection.release();
        });
    },
    // Delete Todo
    deleteTodo(req,res){
        let id = req.body.id;
        try{
            pool.getConnection(function(err,connection){
                if(err) throw err;
                connection.query(
                    `
                    DELETE FROM todos WHERE id = ?
                    `
                , [
                    id
                ],
                function (error, results) {
                    if(error){
                        res.status(404).json({
                            success: false, 
                            message: 'Gagal!',
                        });
                    } 
                    res.send({ 
                        success: true, 
                        message: 'Berhasil Hapus Todo!'
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
    }
}
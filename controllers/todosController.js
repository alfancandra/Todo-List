const config = require('../config/database');
const mysql = require('mysql');
const { password, user } = require('../config/database');
const pool = mysql.createPool(config);
const bcrypt = require('bcrypt');
const crypto = require("crypto");
const sendEmail = require("../routes/sendEmail");
const assert = require('assert');
const jwt = require('jsonwebtoken');



pool.on('error', (err) => {
    console.error(err);
});

module.exports = {
    // GET ALL TODO
    getTodoAll(req, res) {
        try {
            pool.getConnection(function(err, connection) {
                if (err) throw err;
                connection.query(
                    `
                    SELECT * FROM todos;
                    `,
                    function(error, results) {
                        if (error) throw error;
                        res.send({
                            success: true,
                            message: 'Berhasil ambil data!',
                            data: results
                        });
                    });
                connection.release();
            });
        } catch (e) {
            res.status(404).json({
                success: false,
                message: 'Gagal!',
            });
        }
    },
    // Add TODO
    addTodo(req, res) {
        try {
            let image = req.file == undefined ? null : req.file.filename;
            let data = {
                user_id: req.body.user_id,
                todo: req.body.todo,
                time: req.body.time,
                date: req.body.date,
                image: image
            }
            pool.getConnection(function(err, connection) {
                if (err) throw err;
                connection.query(
                    `
                    INSERT INTO todos SET ?
                    `, [
                        data
                    ],
                    function(error, results) {
                        if (error) {
                            res.status(404).json({
                                success: false,
                                message: 'Gagal!',
                            });
                        }
                        res.send({
                            success: true,
                            message: 'Berhasil tambah data!',
                            result: data
                        });
                    });
                connection.release();
            });
        } catch (e) {
            res.status(404).json({
                success: false,
                message: 'Gagal!',
            });
        }
    },
    // Delete Todo
    deleteTodo(req, res) {
        let id = req.body.id;
        try {
            pool.getConnection(function(err, connection) {
                if (err) throw err;
                connection.query(
                    `
                    DELETE FROM todos WHERE id = ?
                    `, [
                        id
                    ],
                    function(error, results) {
                        if (error) {
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
        } catch (e) {
            res.status(404).json({
                success: false,
                message: 'Gagal!',
            });
        }
    },
    getTodoActivebyUserID(req, res) {
        try {
            let id = req.body.user_id;
            var date = new Date();
            // YYMMDD
            let yymmdd = (new Date()).toISOString().split('T')[0];
            // Time
            var time = date.getHours() + ":" + date.getMinutes()

            pool.getConnection(function(err, connection) {
                if (err) throw err;
                connection.query(
                    `
                    SELECT * FROM todos WHERE user_id = ? AND date >= ? AND time >= ? ORDER BY date ASC;
                    `, [
                        id, yymmdd, time
                    ],
                    function(error, results) {
                        if (error) throw error;

                        res.send({
                            success: true,
                            message: 'Berhasil ambil data!',
                            data: results
                        });
                    });
                connection.release();
            });
        } catch (e) {
            res.status(404).json({
                success: false,
                message: 'Gagal!',
            });
        }
    },
    getTodobyID(req, res) {
        try {
            let id = req.body.id;
            pool.getConnection(function(err, connection) {
                if (err) throw err;
                connection.query(
                    `
                    SELECT * FROM todos WHERE id = ?;
                    `, [
                        id
                    ],
                    function(error, results) {
                        if (error) throw error;
                        res.send({
                            success: true,
                            message: 'Berhasil ambil data!',
                            data: results
                        });
                    });
                connection.release();
            });
        } catch (e) {
            res.status(404).json({
                success: false,
                message: 'Gagal!',
            });
        }
    },
    editTodo(req, res) {
        try {
            let image = req.file == undefined ? null : req.file.filename;
            let data = {
                todo: req.body.todo,
                time: req.body.time,
                date: req.body.date,
                image: image
            }
            pool.getConnection(function(err, connection) {
                if (err) throw err;
                connection.query(
                    `
                    UPDATE todos SET ? WHERE id = ?
                    `, [
                        data, req.body.id
                    ],
                    function(error, results) {
                        if (error) {
                            res.status(404).json({
                                success: false,
                                message: 'Gagal!',
                            });
                        }
                        res.send({
                            success: true,
                            message: 'Berhasil edit data!',
                            result: data
                        });
                    });
                connection.release();
            });
        } catch (e) {
            res.status(404).json({
                success: false,
                message: 'Gagal!',
            });
        }
    }
}
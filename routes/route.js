const router = require('express').Router();
const { users,todos,admin } = require('../controllers');
const verifyUser = require('./verifyTokenUser');
const verifyAdmin = require('./verifyTokenAdmin');

// GET localhost:3000/api/users/2 => Ambil data semua berdasarkan id = 2
router.get('/api/user/:id', users.getDataByID);

// POST localhost:3000/api/user/add => Tambah data ke database
router.post('/api/user/add', users.addData);

// Forgot password
router.post('/api/user/forgot-password',users.findEmail);

// Verif Forgot password
router.get('/api/user/password-reset/:id/:token',users.verifToken);

// Reset Password
router.post('/api/user/reset/:id/:token',users.resetPassword);

// POST localhost:3000/api/users/login => Login users
router.post('/api/user/login', users.loginUser);



// ====================TODOS====================
// GET localhost:3000/api/todos => GET ALL TODOS
router.get('/api/todos',verifyUser,todos.getTodoAll);

// POST localhost:3000/api/todo/add => Add New Todo
router.post('/api/todo/add',verifyUser,todos.addTodo);

// Delete one Todolist 
router.post('/api/todo/delete',verifyUser,todos.deleteTodo);



// ====================ADMIN====================
// LOGIN Admin
router.post('/api/admin/login',admin.loginAdmin);
// GET All users
router.get('/api/admin/users', users.getData);

module.exports = router;
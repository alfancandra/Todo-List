const router = require('express').Router();
const { users, todos, admin } = require('../controllers');
const verifyUser = require('./verifyTokenUser');
const verifyAdmin = require('./verifyTokenAdmin');
const hash = require('random-hash'); // you have to install this package:

// UPLOAD IMAGE
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        let temp = file.originalname.split('.');
        const filename = temp[0] + '-' + hash.generateHash({ length: 5 }) + '.' + temp[1]
        cb(null, filename);
    }
});

// Filter File
const fileFilter = (req, file, cb) => {
    // Reject a File
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

// Swagger Documentation

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            tittle: 'Todo List API',
            description: 'Todo List API Information',
            servers: ["http://localhost:3000"]
        }
    },

    apis: ["./routes/route.js"]
};

const swaggerDocs = require('./swagger.json');
router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));


// POST localhost:3000/api/user/add => Tambah data ke database
router.post('/api/user/register', users.addData);

// Forgot password
router.post('/api/user/forgot-password', users.findEmail);

// Verif Forgot password
router.get('/api/user/reset-password/:id/:token', users.verifToken);

// Reset Password
router.post('/api/user/reset-password/:id/:token', users.resetPassword);

// POST localhost:3000/api/users/login => Login users
router.post('/api/user/login', users.loginUser);

// GET localhost:3000/api/users/2 => Ambil data semua berdasarkan id = 2
router.get('/api/user/:id', users.getDataByID);



// ====================TODOS====================
// GET localhost:3000/api/todos => GET ALL TODOS
router.get('/api/todos', verifyUser, todos.getTodoAll);

// POST localhost:3000/api/todo/add => Add New Todo
router.post('/api/todo/add', verifyUser, upload.single('todoImage'), todos.addTodo);

// Delete one Todolist 
router.delete('/api/todo/delete/:id', verifyUser, todos.deleteTodo);

// GET Todo Active by UserID
router.get('/api/todo/user', verifyUser, todos.getTodoActivebyUserID);

// GET Todo by ID
router.post('/api/todo/find', todos.getTodobyID);

// POST edit todo
router.put('/api/todo/edit/:id', verifyUser, upload.single('todoImage'), todos.editTodo);



// ====================ADMIN====================
// LOGIN Admin
router.post('/api/admin/login', admin.loginAdmin);
// GET All users
router.get('/api/admin/users', verifyAdmin, users.getData);

module.exports = router;
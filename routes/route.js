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

const swaggerDocs = swaggerJsDoc(swaggerOptions);
router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));


// GET localhost:3000/api/users/2 => Ambil data semua berdasarkan id = 2
// router.get('/api/user/:id', users.getDataByID);

// Routes
/**
 * @swagger
 * /api/user/add:
 *  post:
 *      description: Use to Register a User
 *      responses:
 *          '200':
 *              description: Success Response
 */

/**
 * @swagger
 * /api/user/forgot-password:
 *  post:
 *      description: Use to Register a User
 *      responses:
 *          '200':
 *              description: Success Response
 */

/**
 * @swagger
 * /api/user/password-reset/:id/:token:
 *  get:
 *      description: Use to Register a User
 *      responses:
 *          '200':
 *              description: Success Response
 */

/**
 * @swagger
 * /api/user/reset/:id/:token:
 *  post:
 *      description: Use to Register a User
 *      responses:
 *          '200':
 *              description: Success Response
 */

/**
 * @swagger
 * /api/user/login:
 *  post:
 *      description: Use to Register a User
 *      responses:
 *          '200':
 *              description: Success Response
 */

/**
 * @swagger
 * /api/todos:
 *  get:
 *      description: Use to Register a User
 *      responses:
 *          '200':
 *              description: Success Response
 */

/**
 * @swagger
 * /api/todos/add:
 *  post:
 *      description: Use to Register a User
 *      responses:
 *          '200':
 *              description: Success Response
 */

/**
 * @swagger
 * /api/todos/delete:
 *  post:
 *      description: Use to Register a User
 *      responses:
 *          '200':
 *              description: Success Response
 */

/**
 * @swagger
 * /api/todos/:user_id:
 *  get:
 *      description: Use to Register a User
 *      responses:
 *          '200':
 *              description: Success Response
 */

/**
 * @swagger
 * /api/todos/find:
 *  post:
 *      description: Use to Register a User
 *      responses:
 *          '200':
 *              description: Success Response
 */

/**
 * @swagger
 * /api/todos/edit:
 *  post:
 *      description: Use to Register a User
 *      responses:
 *          '200':
 *              description: Success Response
 */

/**
 * @swagger
 * /api/admin/login:
 *  post:
 *      description: Use to Register a User
 *      responses:
 *          '200':
 *              description: Success Response
 */

/**
 * @swagger
 * /api/admin/login:
 *  post:
 *      description: Use to Register a User
 *      responses:
 *          '200':
 *              description: Success Response
 */

/**
 * @swagger
 * /api/admin/users:
 *  get:
 *      description: Use to Register a User
 *      responses:
 *          '200':
 *              description: Success Response
 */

// POST localhost:3000/api/user/add => Tambah data ke database
router.post('/api/user/add', users.addData);

// Forgot password
router.post('/api/user/forgot-password', users.findEmail);

// Verif Forgot password
router.get('/api/user/password-reset/:id/:token', users.verifToken);

// Reset Password
router.post('/api/user/reset/:id/:token', users.resetPassword);

// POST localhost:3000/api/users/login => Login users
router.post('/api/user/login', users.loginUser);



// ====================TODOS====================
// GET localhost:3000/api/todos => GET ALL TODOS
router.get('/api/todos', verifyUser, todos.getTodoAll);

// POST localhost:3000/api/todo/add => Add New Todo
router.post('/api/todo/add', verifyUser, upload.single('todoImage'), todos.addTodo);

// Delete one Todolist 
router.post('/api/todo/delete', verifyUser, todos.deleteTodo);

// GET Todo Active by UserID
router.get('/api/todo/:user_id', verifyUser, todos.getTodoActivebyUserID);

// GET Todo by ID
router.post('/api/todo/find', todos.getTodobyID);

// POST edit todo
router.post('/api/todo/edit', verifyUser, upload.single('todoImage'), todos.editTodo);



// ====================ADMIN====================
// LOGIN Admin
router.post('/api/admin/login', admin.loginAdmin);
// GET All users
router.get('/api/admin/users', verifyAdmin, users.getData);

module.exports = router;
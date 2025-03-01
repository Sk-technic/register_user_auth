const express = require('express');
const router = express.Router();
const User = require('../models/user');
const multer = require('multer');

// Image upload configuration
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});

// Creating middleware
let upload = multer({
    storage: storage,
}).single("image");

// Insert a user into the database route
router.post('/add', upload, async (req, res) => {
    try {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: req.file.filename,
        });

        await user.save(); // Using async/await instead of callback

        req.session.message = {
            type: 'success',
            message: 'User added successfully...'
        };

        res.redirect('/');
    } catch (err) {
        res.json({ message: err.message, type: 'danger' });
    }
});

//get all user from datbase

router.get('/', async (req, res) => {
    try {
        // Using await to get the users
        const users = await User.find(); // No need for .exec() here, just await User.find()
        
        console.log(users);  // Optional, for logging the result

        // Render the page with the users data
        if (users && users.length > 0) {
            res.render('index', {
                title: "Home Page",
                users: users,
                message: { type: "Success", content: "Data loaded successfully!" }
            });
        } else {
            res.render('index', {
                title: "Home Page",
                users: [],
                message: { type: "Error", content: "No users found." }
            });
        }
        
    } catch (err) {
        // If an error occurs, send a JSON response with the error message
        res.json({ message: err.message });
    }
});

    


// Homepage route
router.get("/", (req, res) => {
    res.render('index', { title: 'Homepage' });
});

// Get all users route
router.get("/user", (req, res) => {
    res.send('All users');
});

// Add user page route
router.get('/add', (req, res) => {
    res.render("add_users", { title: "Add User" });
});

// Edit user page route
router.get('/edit', (req, res) => {
    res.render("edit_user", { title: "Edit User" });
});

module.exports = router;

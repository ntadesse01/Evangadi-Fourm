const express = require('express');
const router = express.Router();
const { register, login, checkUser } = require('../controllers/userController');

//authonthication middleware
const authMiddleware = require (`../middleware/authMiddlware`)
//user controllers
const { register, login, checkUser}= require (`../controller/userController`)
// Register user route
router.post("/register", register);

// Login user route
router.post("/login", login);

// Check user route
router.get("/check",authMiddleware, checkUser);

module.exports = router;

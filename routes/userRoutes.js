const express = require('express');
const router = express.Router();
const userauth = require('../middleware/userauth');
const {registerUser, signInUser, userDashboard, getEditUserForm, postEditUser, logoutUser} = require('../controllers/userController');

// User Registration
router.get('/signup',userauth.isUserLoggedOut, (req, res) => res.render('user/signup'));
router.post('/signup', registerUser);

// User Sign-In
router.get('/signin',userauth.isUserLoggedOut, (req, res) => res.render('user/signin'));
router.post('/signin', signInUser);

// User Dashboard (protected by userauth)
router.get('/dashboard', userauth.isUserLoggedIn, userDashboard);

// Edit User (protected by userauth)
router.get('/edit', userauth.isUserLoggedIn, getEditUserForm);
router.post('/edit', userauth.isUserLoggedIn, postEditUser);

// Logout User (protected by userauth)
router.get('/logout', userauth.isUserLoggedIn, logoutUser);

module.exports = router;

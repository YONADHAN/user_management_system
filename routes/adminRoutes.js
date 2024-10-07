const express = require('express');
const router = express.Router();
// const adminauth = require('../middleware/adminauth');
const adminauth = require('../middleware/adminauth')
const {registerAdmin, signInAdmin, adminDashboard, getEditUserForm, postEditUser, deleteUser, logoutAdmin, searchUsers} = require('../controllers/adminController');

// Admin Registration
router.get('/signup',adminauth.isAdminLoggedOut, (req, res) => res.render('admin/signup'));
router.post('/signup', registerAdmin);

// Admin Sign-In
router.get('/signin', adminauth.isAdminLoggedOut,(req, res) => res.render('admin/signin'));
router.post('/signin', signInAdmin);

// Admin Dashboard (protected by adminauth)
router.get('/dashboard', adminauth.isAdminLoggedIn, adminDashboard);

// Edit User (protected by adminauth)
router.get('/edit-user/:id', adminauth.isAdminLoggedIn, getEditUserForm);
router.post('/edit-user/:id', adminauth.isAdminLoggedIn, postEditUser);

// Delete User (protected by adminauth)
router.get('/delete-user/:id', adminauth.isAdminLoggedIn, deleteUser);

// Logout Admin (protected by adminauth)
router.get('/logout', adminauth.isAdminLoggedIn, logoutAdmin);

// Search Users (protected by adminauth)
router.get('/search', adminauth.isAdminLoggedIn, searchUsers);

module.exports = router;

// middleware/adminauth.js

// Middleware to check if admin is logged in
function isAdminLoggedIn(req, res, next) {
    if (req.session.adminId) {
        return next(); // Admin is logged in, proceed to the next function
    }
    res.redirect('/admin/signin'); // If not logged in, redirect to signin page
}

// Middleware to prevent access to signin/signup if already logged in
function isAdminLoggedOut(req, res, next) {
    if (req.session.adminId) {
        return res.redirect('/admin/dashboard'); // If logged in, redirect to dashboard
    }
    next(); // If not logged in, proceed to the next function
}

module.exports = { isAdminLoggedIn, isAdminLoggedOut };

// middleware/userauth.js

// Middleware to check if user is logged in
function isUserLoggedIn(req, res, next) {
    if (req.session.userId) {
        return next(); // User is logged in, proceed to the next function
    }
    res.redirect('/user/signin'); // If not logged in, redirect to signin page
}

// Middleware to prevent access to signin/signup if already logged in
function isUserLoggedOut(req, res, next) {
    if (req.session.userId) {
        return res.redirect('/user/dashboard'); // If logged in, redirect to dashboard
    }
    next(); // If not logged in, proceed to the next function
}

module.exports = { isUserLoggedIn, isUserLoggedOut };

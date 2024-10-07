const Admin = require('../models/adminModel');
const User = require('../models/userModel'); 

// Register Admin
exports.registerAdmin = async (req, res) => {
    const { adminName, email, password, confirmPassword } = req.body;

    try {
        if(password!==confirmPassword){
            res.render('admin/signup', {error: 'Confirm Password Not Match'})
        }
        const admin = new Admin({ adminName, email, password });
        await admin.save();
        res.render('admin/signin');
    } catch (error) {
        console.log(error);
        res.render('admin/signup', { error: 'Admin registration failed' });
    }
};


// Sign-In Admin
exports.signInAdmin = async (req, res) => {
    
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });

        if (!admin || !(await admin.matchPassword(password))) {
            
            return res.render('admin/signin', { error: 'Invalid credentials' });
        }

        // Store the admin's ID and name in the session
        req.session.adminId = admin._id;
        req.session.role = 'admin';
        req.session.adminName = admin.adminName; 

        res.redirect('/admin/dashboard');
    } catch (error) {
        console.log(error);
        res.render('admin/signin', { error: 'Sign-In failed' });
    }
};


// Admin Dashboard
exports.adminDashboard = async (req, res) => {
    const searchQuery = req.query.search || ''; // Get the search term from the query string or set an empty string
    try {
        let users;
        if (searchQuery) {
            // If a search query is provided, search by username or email
            users = await User.find({
                $or: [
                    { username: new RegExp(searchQuery, 'i') }, // 'i' makes it case-insensitive
                    { email: new RegExp(searchQuery, 'i') }
                ]
            });
        } else {
            // If no search query, return all users
            users = await User.find({});
        }
        res.render('admin/dashboard', { users, admin: req.session, searchQuery }); // Pass searchQuery to the view
    } catch (error) {
        console.log(error);
        res.render('admin/dashboard', { users: [], admin: req.session, searchQuery, error: 'Failed to load users' });
    }
};




exports.searchUsers = async (req, res) => {
    try {
        const searchTerm = req.query.q; // Get the search term from the query string
        let users;
        if (searchTerm) {
            // Search for users with matching username or email
            users = await User.find({
                $or: [
                    { username: new RegExp(searchTerm, 'i') },
                    { email: new RegExp(searchTerm, 'i') }
                ]
            });
        } else {
            // If no search term, return all users
            users = await User.find({});
        }
        res.render('admin/dashboard', { users, admin: req.session });
    } catch (error) {
        console.log(error);
        res.render('admin/dashboard', { users: [], error: 'Failed to load users' });
    }
};


// Get Edit User Form
exports.getEditUserForm = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.render('admin/dashboard', { error: 'User not found' });
        }
        res.render('admin/editUser', { user, error: null }); // Ensure error is defined
    } catch (error) {
        console.log(error);
        res.render('admin/dashboard', { error: 'Error loading edit form' });
    }
};

// Handle Edit User
exports.postEditUser = async (req, res) => {
    const userId = req.params.id;
    const { username, email } = req.body;

    try {
        await User.findByIdAndUpdate(userId, { username, email });
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.log(error);
        res.render('admin/editUser', { error: 'Error updating user', user: { _id: userId, username, email } });
    }
};

// Handle Delete User
exports.deleteUser = async (req, res) => {
    const userId = req.params.id;

    try {
        await User.findByIdAndDelete(userId);
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.log(error);
        res.render('admin/dashboard', { error: 'Error deleting user' });
    }
};


exports.logoutAdmin = async (req,res) => {
     req.session.destroy((error)=>{
        if(error){
            console.log(error);
            res.redirect('/admin/dashboard')
        }
        res.redirect('/admin/signin')
     })
}

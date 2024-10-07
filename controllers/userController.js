const User = require('../models/userModel');

//Register User
exports.registerUser = async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    try {
        if(confirmPassword!==password)res.render('user/signup',{ error:'Registration failed (confirm password not match)'})
        const user = new User({ username, email, password });
        await user.save();
        
        res.redirect('/user/signin');
    } catch (err) {
        console.log(err);
        res.render('user/signup', { error: 'Registration failed' });
    }
};

//Sign-In User
exports.signInUser = async (req, res) => {
   
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }); // Change to findOne
        if (!user || !(await user.matchPassword(password))) {          
            return res.render('user/signin', { error: 'Invalid credentials' });
        }
        req.session.userId = user._id;
        req.session.username = user.username;
        req.session.role = 'user';
        res.redirect('/user/dashboard');
    } catch (error) {
        
        console.log(error.message);
        res.render('user/signin', { error: 'Sign-In failed' });
    }
};


// User Dashboard
exports.userDashboard = async (req, res) => {
    // Ensure the user is logged in
    if (!req.session.userId) {
        return res.redirect('/user/signin'); // Redirect to login if not authenticated
    }

    try {
        const userId = req.session.userId; 
        const userdata = await User.findById(userId); 

        // Check if user data was found
        if (userdata) {
            res.render('user/dashboard', { user: req.session, userdata, error: null }); // Pass error as null
        } else {
            // Handle case where user is not found
            res.render('user/dashboard', { user: req.session, error: 'User not found' });
        }
    } catch (error) {
        console.log(error);
        res.render('user/dashboard', { user: req.session, error: 'Error loading user data' });
    }
};


// Get Edit User Form
exports.getEditUserForm = async (req, res) => {
    try {
        const userId = req.session.userId;
        const userdata = await User.findById(userId);

        if (!userdata) {
            return res.render('user/dashboard', { user: req.session, error: 'User not found' });
        }

        res.render('user/editUser', { user: req.session, userdata, error: null });
    } catch (error) {
        console.log(error);
        res.render('user/dashboard', { user: req.session, error: 'Error loading edit form' });
    }
};

// Handle Edit User Submission
exports.postEditUser = async (req, res) => {
    const userId = req.session.userId; // Get the user ID from the session
    const { username, email } = req.body; // Get updated data from the form

    try {
        await User.findByIdAndUpdate(userId, { username, email }); // Update the user details
        res.redirect('/user/dashboard'); // Redirect to the dashboard after updating
    } catch (error) {
        console.log(error);
        res.render('user/editUser', { user: req.session, error: 'Error updating user', userdata: { username, email } });
    }
};



// Logout User
exports.logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
            return res.redirect('/user/dashboard'); // Redirect to dashboard if there's an error
        }
        res.redirect('/user/signin'); // Redirect to the signin page after logout
    });
};






// const admin = await Admin.findOne({ email });
// exports.adminDashboard = async (req, res) => {
//     // if (req.session.role !== 'admin') {
//     //     return res.redirect('/user/dashboard');
//     // }

//     try {
//         const users = await User.find({}, 'username email'); // Get only username and email fields
//         // Pass the admin session data to the view
        
//         res.render('admin/dashboard', { admin: req.session, users });
//     } catch (error) {
//         console.log(error);
//         res.render('admin/dashboard', { admin: req.session, users: [], error: 'Failed to load users' });
//     }
// };

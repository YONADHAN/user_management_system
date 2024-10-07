const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

//MongoDB connection
mongoose.connect(process.env.MONGO_URI,{useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>console.log("MongoDB connected"))
    .catch(err=>console.log(err));


// Middleware to disable caching
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
});


//Middleware
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static('public'));

//Sessions
app.use(session({
    secret:"yourSecretKey",
    resave: false,
    saveUninitialized:false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    })
}))

//Setting up EJS
app.set('view engine','ejs');

//Routes
// app.use('/',(req,res)=>{
//     res.redirect('/user/signin');
// });
app.use('/user',require('./routes/userRoutes'));
app.use('/admin',require('./routes/adminRoutes'));


app.use('/',async (req,res)=>{
    res.redirect('/user/signin')
})

//Server start
app.listen(PORT,()=>{
    console.log(`server is running on http://localhost:${PORT}`);
})
const expressMongoSanitize = require('express-mongo-sanitize');//sanitize our data in Mongo.

const express = require('express'),
    app = express(),
    mongoose = require("mongoose"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    User = require("./models/user"),
    rateLimit  = require('express-rate-limit') // prevent brute force and DOS attacks
    xss = require('xss-clean'),
    helmet = require('helmet')


//Connecting database
mongoose.connect("mongodb://localhost/auth_demo");

const expSession = require("express-session")({
    secret: "mysecret", //decode or encode session
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: true,
        maxAge: 1 * 60 * 1000 //10 minutes
    }
});

passport.serializeUser(User.serializeUser()); //session encoding
passport.deserializeUser(User.deserializeUser()); //session decoding
passport.use(new LocalStrategy(User.authenticate()));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(expSession);


//get placed in a public folder of static files, app.use(express.static("public"));
app.use (express.static (__dirname + '/public'));


//=======================
//      O W A S P
//=======================
app.use(expressMongoSanitize());

//Preventing Brute Force & DOS Attacks - Rate Limiting
const limit = rateLimit({
    max:100, //max requests
    windowMs: 60 * 60 * 1000, //1 Hour of 'ban' /lockout
    message: 'Too many requests' //message to send 

});

app.use('/routeName', limit); //setting limiter on specific route

//Preventing DOS Attacks - Body Parser
app.use(express.json({limit: '10kb'})); //Body limit is 10

//Data Sanitization against XSS attacks
app.use(xss());

//Helmet to secure connection and data
app.use(helmet());



//=======================
//      R O U T E S
//=======================
app.get("/index", (req, res) => {
    res.render("index");
})
app.get("/dashboard", (req, res) => {
    res.render("dashboard");
})
app.get("/models", (req, res) => {
    res.render("models");
})
app.get("/product", (req, res) => {
    res.render("product");
})

//Auth Routes
app.get("/login", (req, res) => {
    res.render("login");
});
app.get("/forgot", (req, res) => {
    res.render("forgot");
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/product",
    failureRedirect: "/forgot"
}), function (req, res) {});
app.get("/register", (req, res) => {
    res.render("register");
});



app.post("/register", (req, res) => {

    User.register(new User({
        username: req.body.username,
        email: req.body.email,
        phone: req.body.phone
    }), req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            res.render("register");
        }
        passport.authenticate("local")(req, res, function () {
            res.redirect("/login");
        })
    })
})
app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/logout");
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

//Listen On Server
app.listen(process.env.PORT || 3000, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Server Started At Port 3000");
    }
});
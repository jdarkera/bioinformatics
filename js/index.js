
/* EXPRESS SETUP */
const express = require('express');
const app  = express();

app.use(express.static(__dirname));

const bodyParser = require ('body-parser'); //used to parse the request body that
                                            //Passport uses to authenticate the user
const expressSession = require('express-session')({ //save the session cookie.
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 60000
    }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSession);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App listening on port ${port}`));


/*PASSPORT SETUP*/
const passport = require('passport');

app.use(passport.initialize());
app.use(passport.session()); 


/*MONGOOSE SETUP*/
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

//connect to database
mongoose.connect('mongodb://localhost/SmartHealthDatabase',
    {useNewUrlParser: true, useUnifiedTopology: true}
);

const Schema = mongoose.Schema;
//define data structure
const UserDetail = new Schema({
    username: String,
    password: String
});

UserDetail.plugin(passportLocalMongoose); //add plugin to UserDetail schema

const UserDetails = mongoose.model('userInfo', UserDetail, 'userInfo'); //Create model for UserDetail Schema


/*PASSPORT LOCAL AUTHENTICATION*/
passport.use(UserDetails.createStrategy());

passport.serializeUser(UserDetails.serializeUser());
passport.deserializeUser(UserDetails.deserializeUser());



/*ROUTES*/

const connectEnsureLogin = require('connect-ensure-login'); //to ensure a user is logged in.  If a request is
                                                            //received that is unauthenticated, the request will be 
                                                            //redirected to a login page. We’ll use this to guard our routes.
app.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err){
            return next(err);
        }
        if (!user){
            return res.redirect('/login?info=' + info);
        }
        req.logIn(user, function(err){
            if(err){
                return next(err);
            }
            return res.redirect('/');
        });
    })(req, res, next);
});

app.get('/login', (req,res) => {
    res.sendFile('login.html', {root: __dirname})
});

app.get('/register', (req,res) => {
    res.sendFile('register.html', {root: __dirname})
});

app.get('/product', connectEnsureLogin.ensureLoggedIn(), (req, res) => { //validating the session to make sure you’re allowed to look at that route.
    res.sendFile('product.html', {root: __dirname});
})

app.get('/user', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
    res.send({user: req.user});
})

app.get('/logout', (req,res) => {
    req.logout(),
    res.sendFile('logout.html', {root: __dirname})
});
// REGISTRANTS 
router.get('/registrants', basic.check((req,res) => {
    Registration.find()
        .then((registrations) => {
            res.render('registrants', {title: 'Listing registrations', registrations});       
        })
        .catch(() => {res.send('Sorry! Something went wrong.');});
}));

router.post('/', 
    [
        check('name')
            .isLength({min:1})
            .withMessage('Please enter a name'),
        check('email')
            .isEmail()
            .exists()
            .isLength({min:1})
            .withMessage('Please enter an email'),
        check('password')
            .isLength({min:8})
            .withMessage('Please enter password'),
    ],  
    async (req,res) => {
        const errors = validationResult(req); 
        if (errors.isEmpty()){ 
            const registration = new Registration(req.body);
            //generate salt to hash password
            const salt = await bcrypt.genSalt(10);
            //set user password to hashed password
            registration.password = await bcrypt.hash(registration.password, salt);

            // Registration.findOne({registration.email == email} )
            registration.save()   
                // .then(() => {res.send('Thank you for your registration');})
                .then(() => {
                    res.render('thankyou', {title: "Thank you"});
                })

                .catch((err) => {
                    console.log(err);
                    res.send('Sorry! Something went wrong')
                });
        }else{
            res.render('register', {
                title: 'Registration form',
                errors: errors.array(),
                data:req.body
            });
        }
    });

module.exports = router;


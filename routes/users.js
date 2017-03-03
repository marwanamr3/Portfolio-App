var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var cookieParser = require('cookie-parser');
var config = require('../config/database');
var User = require('../models/user');
var Work = require('../models/work');
var workController = require('../controllers/workController');
var userController = require('../controllers/userController');
var multer = require('multer');
var upload = multer({dest: 'public/uploads/'});


// Register route //

//view
router.get('/register', function(req,res){
  res.render('register');
});

//Back-End
router.post('/register', function(req, res){
  var name = req.body.name;
  var description = req.body.description;
  var username = req.body.username;
  var password = req.body.password;
  

  // Validation
  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('description', 'Description is required').notEmpty();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  

  var errors = req.validationErrors();

  if(errors){
    res.render('register',{
      errors:errors
    });
  } else {
    var newUser = new User({
      name: name,
      description:description,
      username: username,
      password: password
    });

    userController.addUser(newUser, function(err, user){
      if(err) throw err;
      console.log(user);
    });

    req.flash('success_msg', 'You Registered Successfully');

    res.redirect('/users/login');
  }
});




router.get('/portfolios',function(req,res){

    
    console.log(req.session.loggedin);
    res.render('portfolios',{session:req.session});
});


//My Portfolio Route
router.get('/myPortfolio',function(req,res){
    res.render('profile');
});



router.post('/myPortfolio',workController.getUserWorks);





// Create Portfolio Route

router.get('/createPortfolio',function(req,res){
    res.render('createPortfolio',{session:req.session});
});



router.post('/createPortfolio',workController.addWork);


router.get('/created',workController.getUserWorks);


// Login route //

//View
router.get('/login', function(req, res){
  res.render('login');
});

//check username - password
passport.use(new LocalStrategy(
  function(username, password, done) {
   userController.getUserByUsername(username, function(err, user){
    if(err) throw err;
    if(!user){
      return done(null, false, {message: 'Unknown User'});
    }

    userController.comparePassword(password, user.password, function(err, isMatch){
      if(err) throw err;
      if(isMatch){
        return done(null, user);
      } else {
        return done(null, false, {message: 'Invalid password'});
      }
    });
   });
  }));

//
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

//
passport.deserializeUser(function(id, done) {
  userController.getUserById(id, function(err, user) {
    done(err, user);
  });
});


//Back-End
router.post('/login'
  ,passport.authenticate('local', {failureRedirect:'/users/login',failureFlash: true}),
  function(req, res) {
      
    req.session.loggedin = req.body.username;
    console.log(req.session.loggedin);

    res.redirect('/users/portfolios');
  });



// Logout Route //

router.get('/logout', function(req, res){
  req.logout();

  req.flash('success_msg', 'You are logged out');

  res.redirect('/users/login');
});




// Profile route
router.get('/profile', workController.getUserWorks);


router.post('/profile', upload.any(), workController.addWork);



router.get('/summary', workController.getAllWorkVisitor);
 



module.exports = router;
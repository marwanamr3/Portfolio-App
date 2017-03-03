//Dependencies
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cors = require('cors');
var passport = require('passport');
var mongoose = require('mongoose');
var config = require('./config/database');
var flash = require('connect-flash');
var session = require('express-session');
var expressValidator = require('express-validator');
var LocalStrategy = require('passport-local').Strategy;


// Connect To Database
mongoose.connect(config.database);

// On Connection
mongoose.connection.on('connected', () => {
  console.log('Connected to database '+config.database);
});

// On Error
mongoose.connection.on('error', (err) => {
  console.log('Database error: '+err);
});

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// CORS Middleware (for using other domains)
app.use(cors());


// Set Static Folder (view folder)
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static('public'));


// Body Parser Middleware (to grab data from requests)
app.use(bodyParser.json());


// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));


// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);


// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));


// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});


app.use('/', routes);
app.use('/users', users);


// Port Number
const port = 8080;


// Start Server
app.listen(port, function(){
  console.log('Server is listening on port '+ port);
});
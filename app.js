//jshint esversion:6

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const bodyParser = require("body-parser");

const app = express();


// Passport Config
require('./config/passport')(passport);

// DataBase 
const db = 'mongodb://localhost:27017/shopDB';
// const db = require('./config/key').MongoURI;

// connect DB
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(console.log('MongoDB connected....'))
  .catch(err => console.log(err));

// EJS
app.set('view engine', 'ejs');
app.use(expressLayouts);

// body-parser
app.use(bodyParser.urlencoded({ extended: true }));


// Express Session
app.use(session({
  secret: 'my secret',
  resave: true,
  saveUninitialized: true,
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// static folder 
app.use(express.static("public"));

// Connect flash
app.use(flash());

// Global Vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes middleware
app.use('/', require('./routes/index'));
app.use('/shopOwner', require('./routes/shopOwners'));
app.use('/customer', require('./routes/customers'));


//requests started coming

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
  console.log(`app started successfully on port: ${port}`);
});

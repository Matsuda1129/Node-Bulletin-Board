'use strict';

const express = require('express'),
  layouts = require('express-ejs-layouts'),
  app = express(),
  router = require('./routes/index'),
  methodOverride = require('method-override'),
  passport = require('passport'),
  cookieParser = require('cookie-parser'),
  expressSession = require('express-session'),
  expressValidator = require('express-validator'),
  bcrypt = require('bcrypt'),
  LocalStrategy = require('passport-local').Strategy,
  mysql = require('mysql2'),
  connectFlash = require('connect-flash');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'bulletin',
  port: 3306,
});

connection.connect((err) => {
  if (err) {
    console.log('error connecting: ' + err.stack);
    return;
  }
  console.log('success');
});

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');

app.use(
  methodOverride('_method', {
    methods: ['POST', 'GET'],
  })
);

app.use(layouts);
app.use(express.static('public'));
// app.use(expressValidator())
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(express.json());

app.use(cookieParser('secretCuisine123'));
app.use(
  expressSession({
    secret: 'secretCuisine123',
    cookie: {
      maxAge: 4000000,
    },
    resave: false,
    saveUninitialized: false,
  })
);
app.use(connectFlash());

passport.use(
  new LocalStrategy((username, password, done) => {
    const sql = 'select * from users where name = ?';
    const params = [username];
    connection.query(sql, params, (err, users) => {
      console.log(users);
      console.log(users[0].name);
      console.log(username);
      if (username !== users[0].name) {
        return done(null, false);
      } else if (password !== users[0].password) {
        return done(null, false);
      } else {
        return done(null, { username: username, password: password });
      }
    });
  })
);

passport.serializeUser((user, done) => {
  console.log('Serialize ...');
  done(null, user);
});

passport.deserializeUser((user, done) => {
  console.log('Deserialize ...');
  done(null, user);
});

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.send({ user: req.user });
});

app.get('/failure', (req, res) => {
  req.flash('failure');
  res.redirect('/users/login');
});

app.get('/success', (req, res) => {
  console.log('succsess login');
  res.redirect('/users');
});

app.use((req, res, next) => {
  res.locals.loggedIn = req.isAuthenticated();
  res.locals.currentUser = req.user;
  res.locals.flashMessages = req.flash();
  next();
});

app.use('/', router);

app.listen(app.get('port'), () => {
  console.log(`Server running at http://localhost:${app.get('port')}`);
});

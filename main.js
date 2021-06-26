'use strict';

require('dotenv').config({path: '../.env'});
const express = require('express');
const layouts = require('express-ejs-layouts');
const app = express();
const methodOverride = require('method-override');
const passport = require('passport');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const expressValidator = require('express-validator');
const LocalStrategy = require('passport-local').Strategy;
const connectFlash = require('connect-flash');
const router = require('./routes/index');
const bcrypt = require('bcryptjs');
const User = require('./models').User;

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');

app.use(
  methodOverride('_method', {
    methods: ['POST', 'GET'],
  })
);

app.use(layouts);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
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
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    (username, password, done) => {
      User.findOne({
        where: {
          email: username,
        },
      }).then(async(results) => {
        const comparedPassword = await bcrypt.compare(
          password,
          results.dataValues.password
        );
        if (username !== results.dataValues.email) {
          return done(null, false);
        } else if (comparedPassword === false) {
          return done(null, false);
        } else {
          done(null, {
            id: results.dataValues.id,
            username: results.dataValues.name,
            email: username,
            password: password,
          });
        }
      });
    }
  )
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

app.use((req, res, next) => {
  res.locals.loggedIn = req.isAuthenticated();
  res.locals.currentUser = req.user;
  res.locals.flashMessages = req.flash();
  next();
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

const http = require('http').Server(app);
const io = require('socket.io')(http);
app.use('/', router);
http.listen(app.get('port'), () => {
    console.log(`Server running at http://localhost: ${app.get('port')}`);
  })

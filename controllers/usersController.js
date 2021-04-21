'use strict';

const passport = require('passport'),
  express = require('express'),
  app = express(),
  cookieParser = require('cookie-parser'),
  bcrypt = require('bcrypt'),
  jwt = require('jsonwebtoken'),
  mysql = require('mysql2');

app.use(cookieParser('secretCuisine123'));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'bulletin',
  port: 3306,
});

module.exports = {
  show: (req, res) => {
    const sql = 'select * from users';
    connection.query(sql, (err, result, fields) => {
      if (err) throw err;
      res.render('show', { user: result });
    });
  },
  userView: (req, res) => {
    const sql = 'SELECT * FROM users WHERE id = ?';
    connection.query(sql, [req.params.id], (err, result, fields) => {
      if (err) throw err;
      res.render('users/show', { user: result });
    });
  },
  registerView: (req, res) => {
    res.render('users/register');
  },
  register: (req, res) => {
    bcrypt.hash(req.body.password, 10).then((hash) => {
      const sql = 'insert into users set ?';
      const user = {
        name: req.body.name,
        email: req.body.email,
        password: hash,
      };
      connection.query(sql, user, (error, results, fields) => {
        if (error) {
          req.flash(
            'error',
            `Failed to create user account because: ${error.message}.`
          );
          res.redirect('/users/register');
        }
        req.flash('success', `${user.name}'s account created successfully!`);
        res.redirect(`/users/${user.name}`);
      });
    });
  },
  edit: (req, res) => {
    const sql = 'SELECT * FROM users WHERE id = ?';
    connection.query(sql, [req.params.id], (err, result, fields) => {
      if (err) throw err;
      res.render('users/edit', { user: result });
    });
  },
  update: (req, res) => {
    const sql = 'UPDATE users SET ? WHERE id = ' + req.params.id;
    connection.query(sql, req.body, (err, result, fields) => {
      if (err) throw err;
      req.flash(
        'success',
        `${req.session.passport.user.username}'s account updated successfully!`
      );
      res.redirect('/users');
    });
  },
  delete: (req, res) => {
    const sql = 'DELETE FROM users WHERE id = ?';
    connection.query(sql, [req.params.id], function (err, result, fields) {
      if (err) throw err;
      req.flash(
        'success',
        `${req.session.passport.user.username}'s account deleted successfully!`
      );
      res.redirect('/users');
    });
  },
  loginView: (req, res) => {
    res.render('users/login');
  },
  cookieAuth: (req, res, next) => {
    const sql = 'select * from users where name = ?';
    let username = req.body.username;
    let password = req.body.password;
    connection.query(sql, username, (err, users) => {
      if (!users) {
        return res.status(404).json({
          error: {
            message: 'Not the book found.',
          },
        });
      } else if (username !== users[0].name) {
        res.redirect('/users/login');
      } else if (password !== users[0].password) {
        res.redirect('/users/login');
      } else {
        const token = jwt.sign({ user: username }, 'secret_key');

        res.cookie('authcookie', token, { maxAge: 900000, httpOnly: true });
        next();
      }
    });
  },
  passportAuth: passport.authenticate('local', {
    failureRedirect: '/users/login',
    failureFlash: 'Failed to login.',
    successRedirect: '/users',
    successFlash: 'Logged in!',
  }),
  isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect('/users/login');
    }
  },
  jwtVerify: (req, res, next) => {
    const authcookie = req.cookies.authcookie;
    jwt.verify(authcookie, 'secret_key', (err, data) => {
      if (err) {
        res.redirect('/users/login');
      } else if (data.user) {
        req.user = data.user;
        next();
      }
    });
  },
  logout: (req, res) => {
    req.flash(
      'success',
      `${req.session.passport.user.username}'s account logouted successfully!`
    );
    req.session.passport.user = undefined;
    res.clearCookie('authcookie');
    res.redirect('/users');
  },
};

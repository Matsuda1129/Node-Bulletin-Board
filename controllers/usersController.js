'use strict';

const passport = require('passport'),
  bcrypt = require('bcrypt'),
  LocalStrategy = require('passport-local').Strategy,
  mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'bulletin',
  port: 3306,
});

module.exports = {
  show: (req, res) => {
    // const sql = 'select * from users';
    // connection.query(sql, (err, result, fields) => {
    //   if (err) throw err;
    res.render('show');
    // });
  },
  showView: (req, res) => {
    const sql = 'SELECT * FROM users WHERE id = ?';
    connection.query(sql, [req.params.id], (err, result, fields) => {
      console.log(result);
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
  jwt: (req, res) => {
    // const payload = {
    //   id: results[0].id,
    //   name: results[0].name,
    //   email: results[0].email,
    // };
    // const token = jwt.sign(payload, 'secret');
    // // return res.json({ token });
    // jwt.verify(token, 'secret', (err, user) => {
    //   if (err) {
    //     return res.sendStatus(403);
    //   } else {
    //     console.log('okdaze');
    //     return res.json({
    //       user,
    //     });
    //   }
    // });
  },
  authenticate: passport.authenticate('local', {
    failureRedirect: '/failure',
    successRedirect: '/success',
  }),
  isAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect('/users/login');
    }
  },
  logout: (req, res) => {
    req.flash(
      'success',
      `${req.session.passport.user.username}'s account logouted successfully!`
    );
    console.log(req.session.passport.user);
    req.session.passport.user = undefined;
    res.redirect('/users');
  },
};

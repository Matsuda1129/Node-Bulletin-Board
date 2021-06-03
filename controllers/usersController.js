'use strict';

const passport = require('passport');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models').User;

app.use(cookieParser('secretCuisine123'));

module.exports = {
  show: (req, res) => {
    User.findAll().then((results) => {
      res.render('show', { user: results });
    });
  },
  userView: (req, res) => {
    User.findOne({
      where: { id: req.params.id },
    }).then((result) => {
      res.render('users/show', { user: result.dataValues });
    });
  },
  registerView: (req, res) => {
    res.render('users/register');
  },
  register: async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      User.create({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      req.flash('success', `${req.body.name}'s account created successfully!`);
      res.redirect(`/users`);
    } catch (err) {
      req.flash(
        'error',
        `Failed to create user account because: ${err.message}.`
      );
      res.redirect('/users/register');
    }
  },
  edit: (req, res) => {
    User.findOne({
      where: { id: req.params.id },
    }).then((result) => {
      res.render('users/edit', { user: result });
    });
  },
  update: async(req, res, next) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    User.update(
      {
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      },
      { where: { id: req.params.id } }
    )
      .then(() => {
        req.flash(
          'success',
          `${req.body.name}'s account updated successfully!`
        );
        res.redirect('/users');
      })
      .catch((error) => {
        console.log(`Error: ${error.message}`);
        next(error);
      });
  },
  delete: (req, res, next) => {
    User.destroy({
      where: {
        id: req.params.id,
      },
    })
      .then(() => {
        req.flash('success', `Account deleted successfully!`);
        res.redirect('/users');
      })
      .catch((error) => {
        console.log(`Error: ${error.message}`);
        next(error);
      });
  },
  loginView: (req, res) => {
    res.render('users/login');
  },
  cookieAuth: (req, res, next) => {
    User.findOne({
      where: {
        email: req.body.email,
      },
    }).then(async (result, err) => {
      if (!result) {
        return res.status(404).json({
          error: {
            message: 'Not the User found.',
          },
        });
      }
      const comparedPassword = await bcrypt.compare(
        req.body.password,
        result.dataValues.password
      );

      if (req.body.email !== result.dataValues.email) {
        res.redirect('/users/login');
      } else if (comparedPassword === false) {
        res.redirect('/users/login');
      } else {
        const token = jwt.sign({ user: req.body.email }, 'secret_key');
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
    req.flash('success', `${req.body.name}'s account logouted successfully!`);
    req.session.passport.user = undefined;
    res.clearCookie('authcookie');
    res.redirect('/users');
  },
};

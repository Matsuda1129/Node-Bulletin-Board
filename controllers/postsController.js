'use strict';

const Post = require('../models').Post;
const User = require('../models').User;
const { validationResult } = require('express-validator');

module.exports = {
  postNewView: (req, res) => {
    res.render('posts/new');
  },
  New: (req, res) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      let messages = err.array().map((e) => e.msg);
      req.skip = true;
      req.flash('error', messages.join(' and '));
      return res.redirect('/posts/new');
    }
    Post.create({
      created_id: res.locals.currentUser.id,
      title: req.body.title,
      content: req.body.content,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
      .then(() => {
        req.flash('success', `${req.body.title} posted successfully!`);
        res.redirect(`/posts/new`);
      })
      .catch((err) => {
        req.flash(
          'error',
          `Failed to post your content because: ${err.message}.`
        );
        res.redirect('/posts/new');
      });
  },
  everyPostsView: (req, res) => {
    Post.findAll({
      include: 'User',
    }).then((results) => {
      res.render('posts/everyPost', { post: results });
    });
  },
  edit: (req, res) => {
    Post.findOne({
      where: { id: req.params.id },
    }).then((results) => {
      if (res.locals.currentUser.id === results.created_id) {
        res.render('posts/edit', { post: results });
      } else {
        req.flash('error', `It is not your post`);
        res.redirect('/posts/everyPosts');
      }
    });
  },
  update: (req, res, next) => {
    Post.update(
      {
        title: req.body.title,
        content: req.body.content,
      },
      { where: { id: req.params.id } }
    )
      .then(() => {
        req.flash('success', `${req.body.title} updated successfully!`);
        res.redirect('/posts/everyPosts');
      })
      .catch((error) => {
        console.log(`Error: ${error.message}`);
        next(error);
      });
  },
  delete: (req, res, next) => {
    Post.findOne({
      where: { id: req.params.id },
    })
      .then((results) => {
        if (res.locals.currentUser.id !== results.created_id) {
          req.flash('error', `It is not your post`);
          return res.redirect('/posts/everyPosts');
        }
        Post.destroy({
          where: {
            id: req.params.id,
          },
        });
        req.flash('success', `${results.title} deleted successfully!`);
        res.redirect('/posts/everyPosts');
      })
      .catch((error) => {
        console.log(`Error: ${error.message}`);
        next(error);
      });
  },
};

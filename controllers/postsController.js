'use strict';

const Post = require('../models').Post;
const Like = require('../models').Like;
const User = require('../models').User;

const Sequelize = require('sequelize');
const sequelize = new Sequelize({ dialect: 'mysql' });
const { validationResult } = require('express-validator');

module.exports = {
  getUser: async (req, res) => {
  },
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
      name: res.locals.currentUser.username,
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
        req.flash('error', `Because: ${err.message}.`);
        res.redirect('/posts/new');
      });
  },
  everyPostsView: async (req, res) => {
    try {
      const post = await Post.findAll({
        include: 'User',
        raw: true,
      });
      const likeAll = await Like.findAll({
        raw: true,
      });
      const likeUserCount = await Like.findAll({
        attributes: [
          'post_id',
          [sequelize.fn('COUNT', sequelize.col('post_id')), 'post_id_count'],
        ],
        group: 'post_id',
        raw: true,
      });
      res.render('posts/everyPost', {
        post: post,
        likeUserCount: likeUserCount,
        likeAll: likeAll,
      });
    } catch (err) {
      req.flash(
        'error',
        `Failed to post your content because: ${err.message}.`
      );
      res.redirect('/posts/everyPost');
    }
  },
  likeplus: async (req, res, next) => {
    try {
      await Like.findOne({
        where: { post_id: req.params.id, user_id: res.locals.currentUser.id },
      }).then((results) => {
        if (results == null) {
          Like.create({
            post_id: req.params.id,
            user_id: res.locals.currentUser.id,
          });
        } else if (
          res.locals.currentUser.id == results.dataValues.user_id &&
          req.params.id == results.dataValues.post_id
        ) {
          results.destroy();
        } else {
          Like.create({
            post_id: req.params.id,
            user_id: res.locals.currentUser.id,
          });
        }
      });
      next();
    } catch (err) {
      req.flash('error', `Because: ${err.message}.`);
      res.redirect('/posts/everyPosts');
    }
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
        Like.destroy({
          where: {
            post_id: req.params.id,
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

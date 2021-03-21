'use strict';
module.exports = {
  postPageView: (req, res) => {
    res.render('postPage');
  },
  everyonePostsView: (req, res) => {
    res.render('everyonePosts');
  },
};

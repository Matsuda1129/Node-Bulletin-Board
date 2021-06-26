const { check } = require('express-validator');
const User = require('./models').User;

exports.loginValidator = [
  check('password')
    .isLength({ min: 7, max: 10 })
    .withMessage('Please enter at least 7 characters for the password')
    .custom((value, { req }) => {
      if (req.body.password !== req.body.confirmPassword) {
        throw new Error("Password dosen't match with conformPassword");
      }
      return true;
    }),
  check('email').custom((value, { req }) => {
    console.log(req.body.email);
    return User.count({
      where: {
        email: req.body.email,
      },
    }).then((userCount) => {
      if (userCount > 0) {
        throw new Error('This email is already registed');
      }
    });
  }),
];

exports.postValidator = [
  check('title')
    .not()
    .isEmpty()
    .withMessage('Title is empty')
    .isLength({ max: 30 })
    .withMessage('Please enter within 30 characters'),
  check('content')
    .not()
    .isEmpty()
    .withMessage('Content is empty')
    .isLength({ max: 140 })
    .withMessage('Please enter within 140 characters'),
];

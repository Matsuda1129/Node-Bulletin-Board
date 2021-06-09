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

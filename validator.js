const { check } = require("express-validator");

exports.loginValidator = [
    check('password')
    .isLength({ min: 7, max: 10, })
    .withMessage("Please enter at least 7 characters for the password")
    .custom((value, { req }) => {
        if (req.body.password !== req.body.confirmPassword) {
        throw new Error("Password dosen't match with conformPassword");
        }
        return true;
    }),
    // check('email')
    // .custom((value, { req }) => {
    // User.findOne({
    //     where: { email: req.body.email },
    // }).then((result) => {
    //     if (req.body.email === result.dataValues.email) {
    //       // console.log(result.dataValues.email);
    //     throw new Error("Your email address is alredy registed");
    //     }
    //     return true;
    //     }
    //     )
    // })
];
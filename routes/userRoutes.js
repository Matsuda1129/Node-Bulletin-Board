const router = require('express').Router();
const usersController = require('../controllers/usersController');
const { loginValidator } = require('../validator');

router.get('/', usersController.show);
router.get('/register', usersController.registerView);
router.post('/register', loginValidator, usersController.register);
router.post('/login', usersController.cookieAuth, usersController.passportAuth);
router.get('/login', usersController.loginView);
router.use(usersController.isAuthenticated);
router.use(usersController.jwtVerify);
router.get('/logout', usersController.logout);
router.get('/edit/:id', usersController.edit);
router.post('/update/:id', usersController.update);
router.get('/:id', usersController.userView);
router.get('/delete/:id', usersController.delete);

module.exports = router;

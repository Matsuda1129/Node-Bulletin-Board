const router = require('express').Router(),
  usersController = require('../controllers/usersController');

router.get('/', usersController.show);
router.get('/register', usersController.registerView);
router.post('/register', usersController.register);
router.get('/login', usersController.loginView);
router.post('/login', usersController.authenticate);
router.get('/logout', usersController.logout);
router.get('/edit/:id', usersController.edit);
router.post(
  '/update/:id',

  usersController.update
);
router.get(
  '/:id',

  usersController.showView
);
router.get(
  '/delete/:id',

  usersController.delete
);

module.exports = router;
const router = require('express').Router();
const postsController = require('../controllers/postsController');
const usersController = require('../controllers/usersController');
const { postValidator } = require('../validator');

router.use(usersController.isAuthenticated);
router.use(usersController.jwtVerify);
router.get('/new', postsController.postNewView);
router.get('/everyPosts', postsController.everyPostsView);
router.get('/edit/:id', postsController.edit);
router.post('/update/:id', postValidator, postsController.update);
router.post('/new', postValidator, postsController.New);
router.get('/delete/:id', postsController.delete);
module.exports = router;


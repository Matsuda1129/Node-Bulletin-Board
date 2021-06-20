const router = require('express').Router();
const postsController = require('../controllers/postsController');
const usersController = require('../controllers/usersController');
const { postValidator } = require('../validator');

router.get('/getUser', postsController.getUser);
router.use(usersController.isAuthenticated);
router.use(usersController.jwtVerify);
router.get('/everyPosts', postsController.everyPostsView);
router.post('/everyPosts/:id',postsController.likeplus, postsController.everyPostsView);
router.get('/new', postsController.postNewView);
router.get('/edit/:id', postsController.edit);
router.post('/update/:id', postValidator, postsController.update);
router.post('/new', postValidator, postsController.New);
router.get('/delete/:id', postsController.delete);
module.exports = router;


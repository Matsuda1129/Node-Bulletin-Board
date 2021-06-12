const router = require('express').Router();
const postsController = require('../controllers/postsController');
const usersController = require('../controllers/usersController');
const { loginValidator } = require('../validator');

router.use(usersController.jwtVerify);
router.use(usersController.isAuthenticated);
router.get('/new', postsController.postNewView);
router.get('/everyPosts', postsController.everyPostsView);
router.get('/edit/:id', postsController.edit);
router.post('/update/:id', postsController.update);
router.post('/new', postsController.New);
router.get('/delete/:id', postsController.delete);
module.exports = router;


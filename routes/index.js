const router = require('express').Router();
const userRoutes = require('./userRoutes');
const homeRoutes = require('./homeRoutes');
const errorRoutes = require('./errorRoutes');
const postRoutes = require('./postRoutes');

router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/', homeRoutes);
router.use('/', errorRoutes);

module.exports = router;

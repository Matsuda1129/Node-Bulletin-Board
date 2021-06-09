const router = require('express').Router();
const userRoutes = require('./userRoutes');
const homeRoutes = require('./homeRoutes');
const errorRoutes = require('./errorRoutes');

router.use('/users', userRoutes);
router.use('/', homeRoutes);
router.use('/', errorRoutes);

module.exports = router;

const router = require('express').Router(),
  userRoutes = require('./userRoutes'),
  errorRoutes = require('./errorRoutes');

router.use('/users', userRoutes);
router.use('/', errorRoutes);

module.exports = router;

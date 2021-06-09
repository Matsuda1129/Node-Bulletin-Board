'use strict'

const router = require('express').Router(),
  homeController = require('../controllers/homeController');

router.get("/chat", homeController.chat);

module.exports = router;

'use strict';

const express     = require('express');
const auth        = require('../middlewares/auth');
const controller  = require('../controllers/user');

const router      = express.Router();

router.post('/signup', controller.signUp);
router.post('/login', controller.signIn);
router.post('/forgot-password', controller.forgotPassword);
router.post('/reset-password', controller.resetPassword);

module.exports = router;
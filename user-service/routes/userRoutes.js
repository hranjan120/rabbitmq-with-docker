const express = require('express');

const router = express.Router();

const userController = require('../controller/userController');
/*
*-----------------------------Routes Section------------------------
*/
router.post('/v1/user-signup', userController.userSignup);

/*
*-----------------------------
*/
module.exports = router;

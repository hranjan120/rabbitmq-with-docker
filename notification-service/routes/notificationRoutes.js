const express = require('express');

const router = express.Router();

const notificationController = require('../controller/notificationController');
/*
*-----------------------------Routes Section------------------------
*/
router.post('/v1/send-notification', notificationController.sendNotification);

/*
*-----------------------------
*/
module.exports = router;

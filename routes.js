const express = require('express');
const router = express.Router();
const slackHandlers = require('./slack');

router.post('/postTqr', slackHandlers.postTqr);


module.exports = router;

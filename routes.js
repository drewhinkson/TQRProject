const express = require('express');
const router = express.Router();
const slackHandlers = require('./slack');

router.post('/postTqr', slackHandlers.postTqr);
router.post('/interactive', slackHandlers.postInteractive);

module.exports = router;

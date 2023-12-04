const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const app = express();
const slackRoutes = require('./routes');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 

app.use('/slack', slackRoutes);

app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running');
});

const express = require('express');
const bodyParser = require('body-parser');
const { user, admin } = require('./routes');
const config = require('../config/settings');

var app = express();
const multer = require('multer');
app.use(multer({
    dest: './uploads/'
}).any());

// List of routers
app.use('/', user);
app.use('/admin', admin);

port = config.port || 3000;

app.listen(port, () => {
    console.log('Listening on port ', port);
});
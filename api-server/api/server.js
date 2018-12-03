const express = require('express');
const bodyParser = require('body-parser');
const { user, admin } = require('./routes');
const config = require('../config/settings');
const cors = require('cors');

var app = express();
const multer = require('multer');
app.use(multer({
    dest: '/tmp/uploads/'
}).any());

// List of routers
app.use(cors())
app.use('/', user);
app.use('/admin', admin);

port = config.port || 3000;

app.listen(port, () => {
    console.log('Listening on port ', port);
});
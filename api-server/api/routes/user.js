const express = require('express');
const Compute = require('../../compute');
const validateRequest = require('../auth');
const fs = require('fs');
var computeResource = new Compute();

// This router exposes any end points that are to be useable for customers
var router = express.Router();
router.use(validateRequest);

router.get('/', function (req, res) {
    let computeValue = computeResource.getSampleMessage();
    res.end('User router reached. ' + computeValue);
});

router.post('/upload', function (req, res) {
    console.log('Request received at /upload');
    // console.log('Request: ', req.headers);
    console.log('req.files = ', req.files);
    var fName = undefined;
    if (req.files) {
        req.files.forEach(element => {
            fs.renameSync('./uploads/' + element.filename, './uploads/' + element.originalname, err => {
                console.log(err);
            });
        });
        res.end('File(s) uploaded');
    }
});

module.exports = router;
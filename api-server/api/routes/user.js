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
    if (req.files && req.files.length === 1) {
        req.files.forEach(element => {
            fs.renameSync('./uploads/' + element.filename, './uploads/' + element.originalname, err => {
                console.log(err);
            });
        });
        res.end('File(s) uploaded');
    } else if (!req.files || req.files.length === 0) {
        res.statusCode = 404;
        res.end('File not received');
    } else if (req.files.length > 1) {
        req.files.forEach(element => {
            fs.unlinkSync(element.path, err => {
                console.log(err);
            });
        });
        res.statusCode = 400;
        res.end('Only one file per request');
    }
});

module.exports = router;
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
    var fName = undefined;
    if (req.files) {
        fs.exists(req.files[0].path, function (exists) {
            fName = req.files[0].filename;
            fs.renameSync('./uploads/' + fName, './uploads/input.mp4', err => {
                throw err;
            });

            if (!exists) {
                res.statusCode = 404;
                res.end('File not received');
            } else {
                fs.readdir('./uploads', function (err, items) {
                    if (err) {
                        console.log('Error: ', err);
                    }
        
                    items.forEach(function (item) {
                        if (item !== 'input.mp4') {
                            fs.unlink('./uploads/' + item, (err) => {
                                if (err) throw err;
                            });
                        } else {
                            fs.rename('./uploads/' + item, './uploads/' + 'input.mp4', err => {
                                if (err) throw err;
                            })
                        }
                    });
        
                });
                res.end('File uploaded');
            }
        });
    }
});

module.exports = router;
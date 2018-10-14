const express = require('express');
const { VideoComputeResource, AudioComputeResource, CollatedComputeResource} = require('../../compute');
const validateRequest = require('../auth');
const fs = require('fs');
const config = require('../config.json')

var vidProcess = new VideoComputeResource(config);
var audProcess = new AudioComputeResource(config);
var combinedResource = new CollatedComputeResource(config);

// This router exposes any end points that are to be useable for customers
var router = express.Router();
// router.use(validateRequest);

// var fileMap = {};
// var fileCounter = 1;

router.get('/', function (req, res) {
    res.end('User router reached. ' + computeValue);
});

router.post('/upload', function (req, res) {
    console.log('Request received at /upload');
    if (req.files && req.files.length === 1) {
        req.files.forEach(element => {
            fs.renameSync(element.path, element.destination + 'input.mp4', err => {
                console.log(err);
            });
        });
        // fileMap[fileCounter] = req.files[0].originalname;
        let audResult = audProcess.process('input.mp4');
        let vidResult = vidProcess.process('input.mp4');
	    console.log('BEFOER PROMISE.ALL: audio:', audResult);
	    console.log('BEFORE PROMISE.ALL: video:', vidProcess);

        //res.end('File uploaded');
        return Promise.all([audResult, vidResult]).then(() => {
            // res.setHeader('Access-Control-Allow-Origin', 'localhost:3000');
            // res.setHeader('Access-Control-Allow-Methods', 'POST');
            console.log('Video and audio done');
		console.log('Audio results ', audResult);
	    console.log('Video results ', vidResult);
	    res.end('File uploaded');
        });
        // fileCounter++;
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

/*
router.get('/name', function(req, res) {
    console.log('Request received at /name');
    let id = req.get('fileId');
    if (fileMap[id]) {
        res.end(JSON.stringify({ fileName: fileMap[id]}));
    } else {
        res.statusCode = 404;
        res.end('File name not found');
    }
});
*/

router.post('/videoProcess', async function(req, res) { 
    console.log('Request received at /videoProcess');
    // let id = req.get('fileId');
    // if (fileMap[id]) {
        // let result = await vidProcess.process(fileMap[id]);
        let result = await vidProcess.process('input.mp4');
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ status: result }));
    // } else {
    //     res.statusCode = 404;
    //     res.end('File not found');
    // }
});

router.post('/audioProcess', async function(req, res) { 
    console.log('Request received at /audioProcess');
    // let id = req.get('fileId');
    // if (fileMap[id]) {
        // let result = await audProcess.process(fileMap[id]);
        let result = await audProcess.process('input.mp4');
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ status: result }));
    // } else {
    //     res.statusCode = 404;
    //     res.end('File not found');
    // }
});

router.post('/process', async function(req, res) { 
    console.log('Request received at /process');
    // let id = req.get('fileId');
    // if (fileMap[id]) {
        // let audResult = await audProcess.process(fileMap[id]);
        // let vidResult = await vidProcess.process(fileMap[id]);
        let audResult = await audProcess.process('input.mp4');
        let vidResult = await vidProcess.process('input.mp4');
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ videoStatus: vidResult, audioStatus: audResult }));
    // } else {
    //     res.statusCode = 404;
    //     res.end('File not found');
    // }
});

router.get('/query', async function(req, res) {
    console.log('Request received at /query');
    // let id = req.get('fileId');
    let queryString = req.get('queryString');
    // if (fileMap[id]) {
        // let audResults = await audProcess.query(fileMap[id], queryString);
        // let vidResults = await vidProcess.query(fileMap[id], queryString);
        let audResults = await audProcess.query('input.mp4', queryString);
        let vidResults = await vidProcess.query('input.mp4', queryString);
        let finalResults = await combinedResource.collateResults(audResults, vidResults);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(finalResults));
    // } else {
    //     res.statusCode = 404;
    //     res.end('File not found');
    // }
});

module.exports = router;

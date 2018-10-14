const express = require('express');
const { VideoComputeResource, AudioComputeResource, CollatedComputeResource } = require('../../compute');
const validateRequest = require('../auth');
const fs = require('fs');
const config = require('../config.json')

var vidProcess = new VideoComputeResource(config);
var audProcess = new AudioComputeResource(config);
var combinedResource = new CollatedComputeResource(config);

// This router exposes any end points that are to be useable for customers
var router = express.Router();

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
        let audResult = audProcess.process('input.mp4');
        let vidResult = vidProcess.process('input.mp4');
        console.log('BEFOER PROMISE.ALL: audio:', audResult);
        console.log('BEFORE PROMISE.ALL: video:', vidProcess);

        return Promise.all([audResult, vidResult]).then(() => {
            res.end('File uploaded');
            return;
        });
    } else if (!req.files || req.files.length === 0) {
        res.statusCode = 404;
        res.end('File not received');
        return;
    } else if (req.files.length > 1) {
        req.files.forEach(element => {
            fs.unlinkSync(element.path, err => {
                console.log(err);
            });
        });
        res.statusCode = 400;
        res.end('Only one file per request');
        return;
    }
});

router.post('/videoProcess', async function (req, res) {
    console.log('Request received at /videoProcess');
    let result = await vidProcess.process('input.mp4');
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ status: result }));
});

router.post('/audioProcess', async function (req, res) {
    console.log('Request received at /audioProcess');
    let result = await audProcess.process('input.mp4');
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ status: result }));
});

router.post('/process', async function (req, res) {
    console.log('Request received at /process');
    let audResult = await audProcess.process('input.mp4');
    let vidResult = await vidProcess.process('input.mp4');
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ videoStatus: vidResult, audioStatus: audResult }));
});

router.get('/query', async function (req, res) {
    console.log('Request received at /query');
    let queryString = req.get('queryString');
    let audResults = await audProcess.query('input.mp4', queryString);
    let vidResults = await vidProcess.query('input.mp4', queryString);
    let finalResults = await combinedResource.collateResults(audResults, vidResults);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(finalResults));
});

module.exports = router;

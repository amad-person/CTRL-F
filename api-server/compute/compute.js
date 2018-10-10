const config = require('../config/settings');
const { execSync } = require('child_process');

/**
 * Defines structure for a compute resource. Any backend processing required to happen to be included in this directory.
 */
class AbstractComputeResource {

    constructor(settings) {
        this._settings = settings || config;
    }

    async process() {
        throw new Error('Not implemented');
    }
}   


/** 
 * Video compute resource.
 */
class VideoComputeResource extends AbstractComputeResource {

    constructor(settings) {
        super();
        this._settings = settings || config;
    }

    async process(fileName) {
        var ret = execSync('python compute/test.py');
        return ret.toString('utf8');
    }

    async query(fileName, queryString) {
        return 'Video query results';
    }
}


/** 
 * Audio compute resource.
 */
class AudioComputeResource extends AbstractComputeResource {

    constructor(settings) {
        super();
        this._settings = settings || config;
    }

    async process(fileName) {
        return 'Processing file audio ' + fileName;
    }

    getAudioFromFile(fileName) {

    }

    getAudioForInterval(fileName, start, end) {

    }

    queryAudioFile(fileName) {

    }

    async query(fileName, queryString) {
        return 'audio query results';
    }
}

class CollatedComputeResource extends AbstractComputeResource {

    constructor(settings) {
        super();
        this._settings = settings;
    }

    async collateResults(audResults, vidResults) {
        return audResults + ' ' + vidResults;
    }

}

module.exports = {
    VideoComputeResource,
    AudioComputeResource,
    CollatedComputeResource
};
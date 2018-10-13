const config = require('../config/settings');
const { execSync } = require('child_process');
const _ = require('underscore');

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

    

    /**
     * Finds the array containing time stamps where relevant words occur
     * @param {*} data 
     * @param {*} queryString 
     */
    findMatchingTimeStamps(data, queryString) {
        let wordTimeMappings = data.wordTimeMappings;
        let words = _.keys(wordTimeMappings);
        let timeList = [];

        _.filter(words, word => {
            return (word.includes(queryString));
        }).forEach(matchingKey => {
            timeList = timeList.concat(wordTimeMappings[matchingKey]);
        });

        timeList = _.uniq(timeList).sort((a, b) => (a-b));

        return timeList;
    }

    async process(fileName) {
        var ret = execSync('python ' + __dirname + '/process_upload.py /tmp/uploads/' + fileName);
        let data = require('./data.json');
        // let mapping = ret.toString('utf8');
        // mapping = JSON.parse(mapping);
        return 'Done';
    }

    async query(fileName, queryString) {
        let data = require('./data.json');
        let timeStamps = this.findMatchingTimeStamps(data, queryString)
        return timeStamps;
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
        return {
            "audioResponse": audResults, 
            "videoResponse": vidResults
        };
    }

}

module.exports = {
    VideoComputeResource,
    AudioComputeResource,
    CollatedComputeResource
};
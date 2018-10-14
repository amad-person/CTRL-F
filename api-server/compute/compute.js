const config = require('../config/settings');
const { execSync } = require('child_process');
const _ = require('underscore');
var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
var fs = require('fs');
var ffmpeg = require('ffmpeg');

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
        
        timeList = _.uniq(timeList).sort((a, b) => (a - b));
        
        return timeList;
    }
    
    async process(fileName) {
        let text = 'python ' + __dirname + '/process_upload.py /tmp/uploads/' + fileName
        var ret = execSync('python ' + __dirname + '/process_upload.py /tmp/uploads/' + fileName);
        let data = require(__dirname + '/data.json');
        // let mapping = ret.toString('utf8');
        // mapping = JSON.parse(mapping);
        return 'Done';
    }
    
    async query(fileName, queryString) {
        queryString = queryString.toLowerCase();
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
        this.speechToText = new SpeechToTextV1({
            username: 'f4266932-5fa5-4bfb-91e6-1c36e6a9476d',
            password: 'ZDJwVRqeLAsd',
            url: 'https://stream.watsonplatform.net/speech-to-text/api'
        });
        this.params = {
            // From file
            // audio: fs.createReadStream('/Users/yash/Downloads/output_audio-trimmed.wav'),
            audio: undefined,
            content_type: 'audio/mp3',
            timestamps: true
        };
        this.response_array = [
            new Promise(function (resolve, reject) {
                resolve({
                    seqNum: 0,
                    res: require('../../output-lecture-1.json')
                })
            }),
            new Promise(function (resolve, reject) {
                resolve({
                    seqNum: 1,
                    res: require('../../output.json')
                })
            })
        ];
        this.json_response = null;
        this.word_map = new Map();
        this.block_map = new Map();
        
        this.timestamp_of_last_word_in_clip = new Map();
        this.block_count = 0;
        this.transcript = "";
    }
    
    generateWordMap(response_object) {
        
        var json_object = response_object.res;
        // console.log(json_object.results[0].alternatives[0].timestamps[0]);
        
        var results_length = json_object.results.length;
        var timestamps_array_length = json_object.results[results_length - 1].alternatives[0].timestamps.length;
        var timestamp_of_last_word_current_clip = json_object.results[results_length - 1].alternatives[0].timestamps[timestamps_array_length - 1][2];
        this.timestamp_of_last_word_in_clip.set(response_object.seqNum, timestamp_of_last_word_current_clip);
        console.log(timestamp_of_last_word_current_clip);
        
        for (let i = 0; i < json_object.results.length; i++) {
            var alternatives_object = json_object.results[i].alternatives;
            // console.log(alternatives_object);
            
            for (let j = 0; j < alternatives_object.length; j++) {
                // transcript = alternatives_object[j].transcript;
                // stream.write(transcript);
                var block = alternatives_object[j].timestamps;
                this.block_map.set(this.block_count, block[0][1]);
                this.block_count++;
                
                for (let k = 0; k < block.length; k++) {
                    var word = block[k][0].toLowerCase();
                    var start_timestamp_relative = block[k][1];
                    var start_timestamp_absolute = null;
                    if (response_object.seqNum > 0) {
                        start_timestamp_absolute = start_timestamp_relative + this.timestamp_of_last_word_in_clip.get(response_object.seqNum - 1);
                    } else {
                        start_timestamp_absolute = start_timestamp_relative;
                    }
                    if (this.word_map.get(word)) {
                        var word_timestamps_array = this.word_map.get(word);
                        word_timestamps_array.push(start_timestamp_absolute);
                        this.word_map.set(word, word_timestamps_array);
                    } else {
                        this.word_map.set(word, [start_timestamp_relative]);
                    }
                }
            }
        }
        // this.block_map.forEach(logMapElements);
        // console.log('done processing the file!!!');
    }
    
    convertVideoToAudio(videoFile) {
        // convert
        var dir = '/tmp/audio';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        var pathToVideoFile = '/tmp/uploads/' + videoFile;
        var videoFileName = videoFile.substring(0, videoFile.indexOf("."));
        var pathToAudioFile = dir + '/' + videoFileName + '.mp3';
        var audioFile = undefined;
        try {
            var process = new ffmpeg(pathToVideoFile);
            return new Promise(function (resolve, reject) {
                process.then(function (video) {
                    video.fnExtractSoundToMP3(pathToAudioFile, function (err, file) {
                        if (err) {
                            console.log(err);
                        } else {
                            audioFile = file;
                            console.log('audio file ' + audioFile + ' saved');
                            resolve(audioFile);
                        }
                    });
                });
            });
            
        } catch (e) {
            console.log(e.code);
            console.log(e.msg);
        }
    }
    
    splitAudio(longAudio) {
        // Split into files
        execSync('cd /tmp/audio/ && ffmpeg -i ' + longAudio + ' -f segment -segment_time 1200 -c copy out%03d.mp3');
        var arr = execSync('cd /tmp/audio/ && ls out*.mp3').toString('utf8').split('\n');
        arr = _.filter(arr, e => { return e.includes('.mp3'); });
        
        var returnArray = [];
        arr = arr.sort((a, b) => {
            let keyA = a.split('.')[0].replace('out', '');
            let keyB = b.split('.')[0].replace('out', '');
            keyA = parseInt(keyA);
            keyB = parseInt(keyB);
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
        });

        for (let i = 0; i < arr.length; i++) {
            var obj = {
                seqNum: i,
                fileName: arr[i]
            };
            returnArray.push(obj);
        }
        return returnArray;
        // console.log(returnArray);
        
        // return [{
        // 	seqNum: 1,
        // 	fileName: './uploads/originalfile_seqNum.wav'
        // }];
    }
    
    async sendHTTPRequest(fileObject) {
        console.log('Before resFromWatson');
        let resFromWatson = await this.getResponseFromWatson(fileObject.fileName);
        console.log('After resFromWatson');
        return {
            seqNum: fileObject.seqNum,
            res: resFromWatson
        }; 
        // this.getResponseFromWatson(fileObject.fileName).then(function (resolve, reject) {
        //     (result) => {
        //         console.log('Received response for seq: ', fileObject.seqNum);
        //         console.log('Response: ', result);
        //         resolve({
        //             seqNum: fileObject.seqNum,
        //             resObj: result
        //         });
        //     }
        // });
        // return new Promise(function (resolve, reject) {
        //     resolve({
        //         seqNum: fileObject.seqNum,
        //         resObj: resFromWatson
        //     });
        // });
        // resFromWatson.then(() => {
        //     return {
        //         seqNum: fileObject.seqNum,
        //         resObj: resFromWatson
        //     };
        // });
    }
    
    getResponseFromWatson(fileName) {
        var pathToFile = '/tmp/audio/' + fileName;
        this.params.audio = fs.createReadStream(pathToFile);
        var that = this;
        return new Promise(function (resolve, reject) {
            that.speechToText.recognize(that.params, function (err, res) {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                else {
                    resolve(res);
                }
            });
        });
    }
    
    async process(fileName) {
        console.log('Processing file: ', fileName);
        let audioFile = await this.convertVideoToAudio(fileName);
        let audioArray = this.splitAudio(audioFile);
        console.log(audioArray);
        
        let promiseArr = [];
        // let promiseArr = this.response_array;
        for (let i = 0; i < audioArray.length; i++) {
            console.log('Sending request: ', audioArray[i]);
        	promiseArr.push(this.sendHTTPRequest(audioArray[i]));
        }
        var that = this;
        Promise.all(promiseArr).then(() => {
            console.log('All promises resolved');
            promiseArr.sort(function (a, b) {
                var keyA = a.seqNum, keyB = b.seqNum;
                if (keyA < keyB) return -1;
                if (keyA > keyB) return 1;
                return 0;
            });
            
            console.log('Removing files');
            execSync('cd /tmp/audio/ && rm *.mp3');

            for (let i = 0; i < promiseArr.length; i++) {
                promiseArr[i].then(result => {
                    that.generateWordMap(result);
                });
            }

            return 'Done processing ' + fileName;
        })
        .catch(err => {
            return 'Error prcessing file: ' + err;
        });
    }
    
    async query(fileName, queryString) {
        queryString = queryString.toLowerCase();
        // await this.process(fileName);
        console.log('Called query with: ', fileName, queryString);
        console.log(this.word_map.get(queryString));
        return this.word_map.get(queryString);
        
    }
    
    logMapElements(value, key, map) {
        console.log(`m[${key}] = ${value}`);
    }
}

class CollatedComputeResource extends AbstractComputeResource {
    
    constructor(settings) {
        super();
        this._settings = settings;
    }
    
    async collateResults(audResults, vidResults) {
        audResults = audResults || [];
        vidResults = vidResults || [];

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
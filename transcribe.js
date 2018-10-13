var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
var fs = require('fs');

var speechToText = new SpeechToTextV1({
    username: 'c8bb058c-fea8-4665-b0ca-254985e79cbd',
    password: 'Mo3DAlb2Fnk7',
    url: 'https://stream.watsonplatform.net/speech-to-text/api'
  });


var params = {
  // From file
  audio: fs.createReadStream('/Users/yash/Downloads/output_audio-trimmed.wav'),
  content_type: 'audio/wav',
  timestamps:true
};

var json_response = null;

var json_object = null;
var transcript = "";


var word_map = new Map();
var block_map = new Map();

var timestamp_of_last_word_in_clip = new Map();

var block_count=0;

var stream = fs.createWriteStream('transcript.txt', {'flags': 'a'});
// generateWordMap('output-lecture-1.txt');
// generateWordMap('output.txt');
var response_array = [
	{
	  'seqNum' : 0,
	  'res' : 'output-lecture-1.txt'
	},
	{
	  'seqNum' : 1,
	  'res' : 'output.txt'
	}
  ];
  for (let i=0; i<response_array.length; i++) {
	  generateWordMap(response_array[i]);
  }
stream.end();

word_map.forEach(logMapElements);
// console.log(block_map.size);
recalibrateBlockMap(block_map);


function recalibrateBlockMap(block_map) {

}

function generateWordMap(response_object) {

	json_object = readFile(response_object.res);
	// console.log(json_object.results[0].alternatives[0].timestamps[0]);
		
	results_length = json_object.results.length;
	timestamps_array_length = json_object.results[results_length-1].alternatives[0].timestamps.length;
	timestamp_of_last_word_current_clip = json_object.results[results_length-1].alternatives[0].timestamps[timestamps_array_length-1][2];
	timestamp_of_last_word_in_clip.set(response_object.seqNum, timestamp_of_last_word_current_clip);
	console.log(timestamp_of_last_word_current_clip);
	
	for ( let i = 0; i<json_object.results.length; i++) {
		var alternatives_object = json_object.results[i].alternatives;
		// console.log(alternatives_object);
		
		for (let j=0; j<alternatives_object.length; j++) {
		transcript = alternatives_object[j].transcript;
		stream.write(transcript);
		var block = alternatives_object[j].timestamps;
		block_map.set(block_count, block[0][1]);
		block_count++;
		
		for (let k=0; k<block.length; k++) {
			var word = block[k][0].toLowerCase();
			var start_timestamp_relative = block[k][1];
			var start_timestamp_absolute = null;
			if (response_object.seqNum>0) {
				start_timestamp_absolute = start_timestamp_relative + timestamp_of_last_word_in_clip.get(response_object.seqNum-1);
				// console.log(start_timestamp_absolute);
				
			} else {
				start_timestamp_absolute = start_timestamp_relative;
			}
			if (word_map.get(word)) {
			var word_timestamps_array = word_map.get(word);
			word_timestamps_array.push(start_timestamp_absolute);
			word_map.set(word, word_timestamps_array);
			} else {
			word_map.set(word, [start_timestamp_relative]);
			}
		}
		}
	}
  // block_map.forEach(logMapElements);
  // console.log('done processing the file!!!');
}


function logMapElements(value, key, map) {
  console.log(`m[${key}] = ${value}`);
}

// console.log(JSON.parse('{"results":[{"alternatives":[{"timestamps":[["yes",0.03,0.2],["I",0.2,0.3],["like",0.3,0.48],["to",0.48,0.6],["take",0.6,0.84],["a",0.84,1.1],["brief",1.57,1.84],["moment",1.84,2.16],["to",2.16,2.28],["tell",2.28,2.44],["you",2.44,2.5],["about",2.5,2.72],["gyroscopes",2.72,3.37],["now",3.37,3.48],["many",3.48,3.71],["of",3.71,3.77],["you",3.77,3.89],["have",3.89,4.08],["friends",4.08,4.42],["in",4.42,4.52],["the",4.52,4.62]],"confidence":0.906,"transcript":"yes I like to take a brief moment to tell you about gyroscopes now many of you have friends in the "}],"final":true}],"result_index":0}'));
function readFile(file_name) {
  var data = fs.readFileSync(file_name);
  return JSON.parse(data);
}



// recognizeAudio(params)
// .then(function (response) {
//   json_response = response;
//   console.log(response);
//   console.log(response.results[0]);
// })
// .catch(function(err) {
//   console.log(err);
// });


function recognizeAudio(params) {
  return new Promise(function(resolve, reject) {
    speechToText.recognize(params, function(err, res) {
      if (err) {
        console.log(err);
        reject(err);
      }
      else {
        resolve(res);
      }
    });
  })
}

  
  
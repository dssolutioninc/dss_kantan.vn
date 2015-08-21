var fs = require('fs');
var request = require('request');
var parse = require('csv-parse');
var async = require('async');

var parser = parse({delimiter : ','});
var speechUri = '';

var getSpeechUri = function (text, voiceType, callback) {
	var params = {
		speaker_id	: voiceType,
		text		: text,
		ext			: 'mp3',
		volume		: 1,
		speed		: 1,
		pitch		: 1,
		range		: 1
	};

	request.post({url:'http://cloud.ai-j.jp/demo/aitalk2webapi_nop.php', form: params}, callback);
};

var textToSpeech = function (text, filename, callback){
	
	// var voicetype = 1;	// woman's voice
	var voicetype = 22;		// cute children girl's voice 
	// var voicetype = 11;	// man's voice

	getSpeechUri(text, voicetype, function(err,httpResponse,body){
		if (err) {
		    return console.error('get speech uri failed:', err);
		}

		// console.log('body: ', body);
		var str = JSON.parse(body.substring(9, body.length - 1))
		speechUri = str.url;
		console.log('speechUri:', speechUri);

		request.head(speechUri, function(err, res, body){
		    //console.log('content-type:', res.headers['content-type']);
		    //console.log('content-length:', res.headers['content-length']);

		    request(speechUri).pipe(fs.createWriteStream(filename)).on('close', callback);
		});
	});
};

// textToSpeech('今日はいい天気ですね。', 'work/speech/' + 'sample.mp3', function(){
//     console.log('work/speech/' + 'sample.mp3 : done');
// });

// console.log(Date.now().toString());
// console.log(Date.now().toString());

data = fs.readFileSync('work/vocabulary4speech.csv',{"encoding":"utf8"});
//console.log(data);

parse(data, {delimiter : ',', comment: '#'}, function(err, rows){

	if (err) {
		console.log('data import error! Data has wrong');
		return;
	}
	
	//check header
	if (rows.length == 0){
		console.log('Error! csv file has not any data');
		return;
	}

	//var resultArr = [];

	var startIdx = 4171;
	var runCount = 1200;


	async.timesSeries(runCount, 
		function(idx, next){
			var row = rows[startIdx + idx];
			var text = row[0];
			var filename = 'work/speech/child/' + Date.now().toString() + '.mp3';
			// console.log(Date.now().toString());
			// console.log(row[0]);

			//resultArr.push(text + ',' + filename);

			textToSpeech(text, filename, function(err){
			    console.log(filename + ': done');

			    fs.writeFileSync(
				    'work/speech/index_child.csv',
				    text + ',' + filename + ',' + speechUri + "\n",
				    {encoding: 'utf8', flag: 'a'}
				);

				next(err);
			});
		}, 
		function(err, resultArr){
		    // if any of the file processing produced an error, err would equal that error
		    if( err ) {
			    // One of the iterations produced an error.
			    // All processing will now stop.
			    console.log('processed error');
		    } else {

		  		//     	fs.writeFile(
				//     'work/speech/index_man.csv',
				//     resultArr.join("\n") + "\n",
				//     {encoding: 'utf8', flag: 'a'}
				// );
		      	
		      	console.log('processed successfully');
		    }
		}
	);
});
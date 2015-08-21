var fs = require('fs');
var async = require('async');
var parse = require('csv-parse');
var parser = parse({delimiter : ','});

var mongoose = require('mongoose');
var config = require('./config.json');

var survey_array = [];
var surveyInsertCount = 0;

data = fs.readFileSync(config.survey_csv_file,{"encoding":"utf8"});
//console.log(data);

var surveySchema = new mongoose.Schema({
	sort:  				Number,
	type:   			{type: String, enum: ['1', '2']},
	oneTime:   			Boolean,
	tag:				String,	
	question:   		String,
	option1:   			String,
	option2:   			String,
	option3:   			String,
	option4:   			String,
	},{ collection: 'survey', versionKey: false });

var surveyColl = mongoose.model('survey', surveySchema);

var insertToSurvey = function(survey,callback){
	var oneTime = "TRUE";
    var insertedSurvey = new surveyColl({
		sort:  		survey[0],
		type: 				survey[1],
		oneTime: 			(oneTime === survey[2]),
		tag:				survey[3],
		question:   		survey[4],
		option1:   			survey[5],
		option2:   			survey[6],
		option3:   			survey[7],
		option4:   			survey[8]
	});

	insertedSurvey.save(function (err,data) {
		if(err) {
			callback(err);
		}else {
			surveyInsertCount ++;
			callback(null, surveyInsertCount);

		}
	});
};

parse(data, {delimiter : ',', comment: '#'}, function(err, surveys){

	if (err) {
		console.log('data import error! Data has wrong');
		return;
	}
	
	if (surveys.length == 0){
		console.log('Error! csv file has not any data');
		return;
	}

	// check header
	var header = surveys[0];
	if (header.length < 9 ||
		header[0] != 'sort' ||
		header[1] != 'type' ||
		header[2] != 'oneTime' ||
		header[3] != 'tag' ||
		header[4] != 'question' ||
		header[5] != 'option1' ||
		header[6] != 'option2' ||
		header[7] != 'option3' ||
		header[8] != 'option4'
	){
		console.log('Error! Format of csv file is not correct.');
		return;
	}

	for (var i = 1; i < surveys.length; i++ ){
		survey_array.push(surveys[i]);
	}

	console.log('START: IMPORTING DATA...');
	console.log('========================');
	// connect to mongodb
	mongoose.connect('mongodb://' + config.dbhost + '/' + config.database);
	async.map(survey_array, insertToSurvey, function(err, results){
	    if (err) {
	       console.log(err);
	    }else {
	    	console.log('survey collection: ' + results.length + ' records was inserted.');
			console.log('========================');
			console.log('END: IMPORTED DATA');	
	    }
	    // disconect mongodb
	    mongoose.disconnect();
	});
});


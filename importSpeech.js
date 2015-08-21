var fs = require('fs');
var parse = require('csv-parse');
var async = require('async');
var parser = parse({delimiter : ','});
var config = require('./config.json');
var mongoose = require('mongoose');

mongoose.connect('mongodb://' + config.dbhost + '/' + config.database);
data = fs.readFileSync(config.speed_csv_file,{"encoding":"utf8"});

var speedSchema = mongoose.Schema({
	sentence : String,
	description	: String,
	readingTime : Number,
	level : String,
	sort : Number,
	tag	: String
},{ collection: 'sentence', versionKey: false });

var speedColl = mongoose.model('sentence', speedSchema);

parse(data, {delimiter : ',', comment: '#'}, function(err, speeds){
	if (err) {
		console.log('Data import error! Data has wrong');
		return;
	}
	
    var intCount = 0;
	
	console.log('START: IMPORTING DATA...');
	console.log('========================');
	async.series([
		function(callback){
			speeds.forEach(function(item) {
				var speedlst = new speedColl({
					sentence	: item[0],
					description	: item[1],
					readingTime	: item[2],
					level		: item[3],
					sort		: item[4],
					tag			: item[5]
				});

				speedlst.save(function (err,data) {
			        if(err) {
			            callback(err);
			        }else {
			        	intCount ++;
			        	if(intCount == speeds.length){
			        		callback(null, intCount);
			        	}
			        }
		    	});
			});
	    }
	],
	function(err, results){
		if(err) {
 			console.log(err);
		} else {
	    	console.log('sentence collection: ' + results[0].toString() + ' records was inserted.');
			console.log('========================');
			console.log('END: IMPORTED DATA');		
		}
		// disconect mongodb
	    mongoose.disconnect();
	});
});

var stringify = require('csv-stringify');
var fs = require('fs');

var mongoose = require('mongoose');
var config = require('./../config.json');

var collection = 'example';
var fromColl = 'example';
var toColl = 'reading';
var array = [];

var columns = {
 ObjectID: 	'ID',
 kanji: 	'KANJI'
};

var schema = new mongoose.Schema({
  vocabulary:  	mongoose.Schema.Types.ObjectId,
  kanji:  		mongoose.Schema.Types.ObjectId,
  grammar:  	mongoose.Schema.Types.ObjectId,
  example: 			String,
  reading: 			String,
  meaning:   		String
},{ collection: collection});

var model = mongoose.model(collection, schema);
// connect to mongodb
mongoose.connect('mongodb://' + config.dbhost + '/' + config.database, function (err){
	if (err) {
	    return console.log(err);
	}
});
console.log('START: EXPORTING DATA...');
console.log('========================');
//count documents of collection
model.count({}, function( err, count){
	if (err) {
		return console.log(err);
	}else {
		console.log( "Number of document:", count );
	}
})
model.find({}, function (err, docs) {
	docs.forEach(function(doc) {
		if (typeof doc.example !== 'undefined' && doc.example !== null){
			array.push([
				doc.id,
				doc.example.trim()
			]);
		}
	});
	stringify(array,{header:false, columns: columns}, function(err, output){
  		//console.log(output.length);
  		fs.writeFile('./data.csv', output, function (err) {
		  	if (err) throw err;
		  	console.log("Exported documents to file data.csv");
		  	//disconect mongodb
			mongoose.disconnect();
			console.log('========================');
			console.log('END: EXPORTED DATA');	

		});
	});
});


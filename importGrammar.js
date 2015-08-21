var fs = require('fs');
var parse = require('csv-parse');
var async = require('async');
var parser = parse({delimiter : ','});

var mongoose = require('mongoose');
var config = require('./config.json');

data = fs.readFileSync(config.grammar_csv_file,{"encoding":"utf8"});
//console.log(data);

var grammarSchema = mongoose.Schema({
  item:  			String,
  description: 		String,
  useGuide:   		String,
  level:   			String,
  sort:   			Number,
  tag:   			String,
  category:   		String
},{ collection: 'grammar', versionKey: false });

var grammarColl = mongoose.model('grammar', grammarSchema);

var exampleSchema = mongoose.Schema({
  grammar:  	mongoose.Schema.Types.ObjectId,
  example: 			String,
  meaning:   		String
},{ collection: 'example', versionKey: false  });

var exampleColl = mongoose.model('example', exampleSchema);

parse(data, {delimiter : ',', comment: '#'}, function(err, grammars){

	if (err) {
		console.log('data import error! Data has wrong');
		return;
	}
	
	//check header
	if (grammars.length == 0){
		console.log('Error! csv file has not any data');
		return;
	}

	var header = grammars[0];
	if (header.length < 8){
		console.log('Error! Format of csv file is not correct.');
		return;
	}

	var example_array = [];
    var grammarInsertCount = 0;
	var exampleInsertCount = 0;
	// connect to mongodb
	mongoose.connect('mongodb://' + config.dbhost + '/' + config.database);
	console.log('START: IMPORTING DATA...');
	console.log('========================');
	async.series([
		function(callback){
			grammars.forEach(function(item) {
				var insertedGrammar = new grammarColl({
					item:  			item[0],
					description: 	item[1],
					useGuide:    	item[2],
					level:   		item[4],
					sort:   		item[5],
					tag:   			item[6],
					category:   	item[7]
				});

				insertedGrammar.save(function (err,data) {
			        if(err) {
			            callback(err);
			        }else {
			        	example_array.push({id: data._id, exampleStr: item[3]});
			        	grammarInsertCount ++;
			        	if(grammarInsertCount == grammars.length){
			        		callback(null, grammarInsertCount);
			        	}
			        }
		    	});
			});
	    },
	    function(callback){
	    	var insertedCount = 0;
			example_array.forEach(function(item) {
				var examples = [];
				examples = item.exampleStr.toString().split(config.chars_split_between_examples);
				var count = 0;
				examples.forEach(function(example) {
					if (example.trim() == ""){
						insertedCount++;
						if (insertedCount == example_array.length){
						    callback(null, exampleInsertCount);
						}
					}else {
						var items = [];
						items = example.split(config.chars_split_insite_examples);
						var insertedExample = new exampleColl({ grammar: item.id,
													example: items[0],
													meaning: items[1] 
													});
						insertedExample.save(function (err,data) {
						    if(err) {
						        callback(err);
						    }else {
						    	exampleInsertCount++;
						    	count ++;
						    	if (count == examples.length){
						    		insertedCount++;
						    	}
						    	if (insertedCount == example_array.length){
						    		callback(null, exampleInsertCount);
						    	}
						    }
						});
					}
				});
			});
	    }
	],
	// optional callback
	function(err, results){
		if(err) {
 			console.log(err);
		}else {
	    	console.log('grammar collection: ' + results[0].toString() + ' records was inserted.');
			console.log('example collection: ' + results[1].toString() + ' records was inserted.');
			console.log('========================');
			console.log('END: IMPORTED DATA');		
		}
		// disconect mongodb
	    mongoose.disconnect();
	});
});

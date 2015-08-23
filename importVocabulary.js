var fs = require('graceful-fs');
var parse = require('csv-parse');
var Grid = require('gridfs-stream');
var async = require('async');
var parser = parse({delimiter : ','});

var mongoose = require('mongoose');
var config = require('./config.json');

data = fs.readFileSync(config.vocabulary_csv_file,{"encoding":"utf8"});
//console.log(data);

var vocabularySchema = mongoose.Schema({
  item:  			String,
  reading: 			String,
  description:   	String,
  audio: 			String,
  level:   			String,
  sort:   			Number,
  tag:   			String,
  category:   		String
},{ collection: 'vocabulary', versionKey: false });

var vocabularyColl = mongoose.model('vocabulary', vocabularySchema);

var exampleSchema = mongoose.Schema({
  vocabulary:  	mongoose.Schema.Types.ObjectId,
  example: 			String,
  meaning:   		String
},{ collection: 'example', versionKey: false  });

var exampleColl = mongoose.model('example', exampleSchema);

parse(data, {delimiter : ',', comment: '#'}, function(err, vocabularies){

	if (err) {
		console.log('data import error! Data has wrong');
		return;
	}
	
	//check header
	if (vocabularies.length == 0){
		console.log('Error! csv file has not any data');
		return;
	}

	var header = vocabularies[0];
	if (header.length < 9){
		// header[0] != 'item' ||
		// header[1] != 'reading' ||
		// header[2] != 'description' ||
		// header[3] != 'example' ||
		// header[4] != 'level' ||
		// header[5] != 'sort' ||
		// header[6] != 'tag' ||
		// header[7] != 'category' 
	
		console.log('Error! Format of csv file is not correct.');
		return;
	}

	var example_array = [];
	var vocabularies_array = [];
    var vocabularyInsertCount = 0;
    var audioInsertCount = 0;
	var exampleInsertCount = 0;
	// connect to mongodb
	mongoose.connect('mongodb://' + config.dbhost + '/' + config.database);
	var conn = mongoose.connection;
	console.log('START: IMPORTING DATA...');
	console.log('========================');
	async.series([
		function(callback){
			//console.log(kanji_array[0]);
			var insertCount = 0;
			vocabularies.forEach(function(item) {
				var fileId = new mongoose.Types.ObjectId();
				var filename = item[3];
				//var imgPath = config.kanji_image_folder + filename;
				//console.log(filename);
				if(fs.existsSync(filename)){
					conn.setMaxListeners(0);
					conn.once('open', function () {
					    var gfs = Grid(conn.db, mongoose.mongo);
					    // streaming to gridfs
					    //filename to store in mongodb
					    var writestream = gfs.createWriteStream({
					    	_id: fileId,
					        filename: fileId.toString(),
					        mode: 'w',
					        content_type: 'audio/mpeg',
					        root: 'media',
					        metadata:{
					        	fd: fileId.toString(),
					        	"dirname" : "."
					        }
					    });
					    fs.createReadStream(filename).pipe(writestream);
					 
					    writestream.on('close', function (file) {
					        // do something with `file`
					        vocabularies_array.push({
				        		item:  			item[0],
								reading: 		item[1],
								description: 	item[2],
								audio:   		file._id,
								examples:       item[4],
								level:   		item[5],
								sort:   		item[6],
								tag:   			item[7],
								category:   	item[8]
				        	});
				        	audioInsertCount ++;
				        	insertCount++;
				        	if(insertCount == vocabularies.length){
				        		callback(null, audioInsertCount);
				        	}
					    });
					});
				}else{
					console.log('Not Found file');
					insertCount++;
					vocabularies_array.push({
				        item:  			item[0],
						reading: 		item[1],
						description: 	item[2],
						examples:       item[4],
						level:   		item[5],
						sort:   		item[6],
						tag:   			item[7],
						category:   	item[8]
				    });
				    if (insertCount == vocabularies.length){
						callback(null, audioInsertCount);
					}
				}
			});
	    },
	    function(callback){
			//console.log(kanji_array[0]);
			vocabularies_array.forEach(function(vocabulary) {
				//console.log(vocabulary.audio);
				var insertedVocab = new vocabularyColl({
					item:  			vocabulary.item,
					reading: 		vocabulary.reading,
					description:   	vocabulary.description,
					audio:   		vocabulary.audio,
					level:   		vocabulary.level,
					sort:   		vocabulary.sort,
					tag:   			vocabulary.tag,
					category:   	vocabulary.category
				});

				insertedVocab.save(function (err,data) {
			        if(err) {
			            callback(err);
			        }else {
			        	example_array.push({id: data._id, exampleStr: vocabulary.examples});
			        	vocabularyInsertCount ++;
			        	if(vocabularyInsertCount == vocabularies.length){
			        		callback(null, vocabularyInsertCount);
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
						var insertedExample = new exampleColl({ vocabulary: item.id,
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
	    	console.log('vocabulary collection: ' + results[1].toString() + ' records was inserted.');
			console.log('media collection: ' + results[0].toString() + ' records was inserted.');
			console.log('example collection: ' + results[2].toString() + ' records was inserted.');
			console.log('========================');
			console.log('END: IMPORTED DATA');		
		}
		// disconect mongodb
	    mongoose.disconnect();
	});
});

var fs = require('graceful-fs');
var async = require('async');
var Grid = require('gridfs-stream');
var parse = require('csv-parse');
var parser = parse({delimiter : ','});
var mongoose = require('mongoose');
var config = require('./config.json');

data = fs.readFileSync(config.kanji_csv_file,{"encoding":"utf8"});
//console.log(data);

var kanjiSchema = mongoose.Schema({
	item:  			String,
	hanviet: 		String,
	kunyomi:   		String,
	onyomi:   		String,
	description:   	String,
	image:   		String,
	level:   		String,
	sort:   		Number,
	tag:   			String,
	category:   	String
	},{ collection: 'kanji', versionKey: false });

var kanjiColl = mongoose.model('kanji', kanjiSchema);

var exampleSchema = mongoose.Schema({
	kanji:  	mongoose.Schema.Types.ObjectId,
	example: 		String,
	meaning:   		String
},{ collection: 'example', versionKey: false  });

var exampleColl = mongoose.model('example', exampleSchema);

var imageSchema = mongoose.Schema({
    img: { data: Buffer, contentType: String }
},{ collection: 'media', versionKey: false  });

var imageColl = mongoose.model('media', imageSchema);

parse(data, {delimiter : ',', comment: '#'}, function(err, kanjis){

	if (err) {
		console.log('data import error! Data has wrong');
		return;
	}
	
	// check header
	if (kanjis.length == 0){
		console.log('Error! csv file has not any data');
		return;
	}

	var header = kanjis[0];
	if (header.length < 11 ){
		// header[0] != 'item' ||
		// header[1] != 'hanviet' ||
		// header[2] != 'kunyomi' ||
		// header[3] != 'onyomi' ||
		// header[4] != 'description' ||
		// header[6] != 'level' ||
		// header[7] != 'sort' ||
		// header[8] != 'tag' ||
		// header[9] != 'category' 
	
		console.log('Error! Format of csv file is not correct.');
		return;
	}

    var example_array = [];
    var kanjis_array = [];
    var imageInsertCount = 0;
    var kanjiInsertCount = 0;
	var exampleInsertCount = 0;
	// connect to mongodb
	mongoose.connect('mongodb://' + config.dbhost + '/' + config.database);
	var conn = mongoose.connection;
	console.log('START: IMPORTING DATA...');
	console.log('========================');
	async.series([
		function(callback){
			var insertCount = 0;
			
			//console.log(kanjis[0]);
			kanjis.forEach(function(item) {
				var fileId = new mongoose.Types.ObjectId();
				var filename = item[5] + '.gif' ;
				var imgPath = config.kanji_image_folder + filename;
				if(fs.existsSync(imgPath)){
					conn.setMaxListeners(0);
					conn.once('open', function () {
					    var gfs = Grid(conn.db, mongoose.mongo);
					    // streaming to gridfs
					    //filename to store in mongodb
					    var writestream = gfs.createWriteStream({
					    	_id: fileId,
					        filename: fileId.toString(),
					        mode: 'w',
					        content_type: 'image/gif',
					        root: 'media',
					        metadata:{
					        	fd: fileId.toString(),
					        	"dirname" : "."
					        }
					    });
					    fs.createReadStream(imgPath).pipe(writestream);
					 
					    writestream.on('close', function (file) {
					        // do something with `file`
					        kanjis_array.push({
				        		item:  			item[0],
								hanviet: 		item[1],
								kunyomi: 		item[2],
								onyomi:   		item[3],
								description:   	item[4],
								image:   		file._id,
								examples:       item[6],
								level:   		item[7],
								sort:   		item[8],
								tag:   			item[9],
								category:   	item[10],
				        	});
				        	imageInsertCount ++;
				        	insertCount++;
				        	if(insertCount == kanjis.length){
				        		callback(null, imageInsertCount);
				        	}
					    });
					});
				}else {
					console.log('Not Found file');
					insertCount++;
					kanjis_array.push({
				        item:  			item[0],
						hanviet: 		item[1],
						kunyomi: 		item[2],
						onyomi:   		item[3],
						description:   	item[4],
						examples:       item[6],
						level:   		item[7],
						sort:   		item[8],
						tag:   			item[9],
						category:   	item[10],
				    });
				    if(insertCount == kanjis.length){
				        callback(null, imageInsertCount);
				    }
				}
			});
	    },
		function(callback){
			//console.log(kanji_array[0]);
			kanjis_array.forEach(function(kanji) {
				var insertedKanji = new kanjiColl({
					item:  			kanji.item,
					hanviet: 		kanji.hanviet,
					kunyomi: 		kanji.kunyomi,
					onyomi:   		kanji.onyomi,
					description:   	kanji.description,
					image:   		kanji.image,
					level:   		kanji.level,
					sort:   		kanji.sort,
					tag:   			kanji.tag,
					category:   	kanji.category
				});

				insertedKanji.save(function (err,data) {
			        if(err) {
			            callback(err);
			        }else {
			        	example_array.push({id: data._id, exampleStr: kanji.examples});
			        	kanjiInsertCount ++;
			        	if(kanjiInsertCount == kanjis.length){
			        		callback(null, kanjiInsertCount);
			        	}
			        }
		    	});
			});
	    },
	    function(callback){
	    	var insertedCount = 0;
			//console.log(example_array.length)
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
						var insertedExample = new exampleColl({ kanji: item.id,
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
	    	console.log('kanji collection: ' + results[1].toString() + ' records was inserted.');
	    	console.log('media collection: ' + results[0].toString() + ' records was inserted.');
			console.log('example collection: ' + results[2].toString() + ' records was inserted.');
			console.log('========================');
			console.log('END: IMPORTED DATA');		
		}
		// disconect mongodb
	    mongoose.disconnect();
	});
});
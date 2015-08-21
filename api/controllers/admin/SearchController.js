/**
 * Admin/SearchController
 *
 * @description :: Server-side logic for managing admin/search
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	_config: {
        locals: {
            layout: 'layout/layout-admin'
        }
    },

    /**
   	* `Admin/SearchController.index()`
   	*  Select all vocabulary book
   	*/
  	index: function (req, res) {

    	BookMaster.find({type : 'vocabulary'}).exec(function findCB(err,books){
 			if (err) {
                sails.log("Err when read data from server:");
                return res.serverError(err);
            }
            if (typeof books === 'undefined' || books.length == 0){
            	return res.json({err: "Data is empty"});
            }
            console.log('books data : ' + JSON.stringify(books));
        	res.view('admin/search/index',{'books':books});
      	});
  	},

  	/**
   	* `Admin/SearchController.lesson()`
   	*  Select all lesson of a book
   	*/
  	lesson: function (req, res) {
		var id=req.param("id",null);
		if(id!=null){
	      	BookMaster.findOne(id)
	        .populate('bookDetails', {sort: 'sort ASC'}).exec(function createCB(err, lessons) {
	        	if (err) {
                	sails.log("Err when read data from server:");
                	return res.serverError(err);
	            }
	            if (typeof lessons === 'undefined' || lessons.length == 0){
	            	return res.json({err: "Data is empty"});
	            }
	   			console.log('lessons data : ' + lessons);
	        	res.view('admin/search/lesson',{'bookdetails':lessons.bookDetails});
	      	});
	    }else {
	    	return res.json({err: "Need a ID to select lessons of a book "});
	    }
  	},

	/**
   	* `Admin/SearchController.vocabulary()`
   	*  Select all vocabulary of a lesson
   	*/
  	vocabulary: function (req, res) {
  		var id=req.param("id",null);

		if(id!=null){
			BookDetail.find({id:id}).exec(function findCB (err,book){
				if (err) {
                	sails.log("Err when read data from server:");
                	return res.serverError(err);
		        }

		        if (typeof book === 'undefined' || book.length == 0){
		            return res.json({err: "Data is empty"});
		        }

				var extractDataCondition = book[0].dataExtractCondition.replace(/'/g, '"');
				var extractDataCondition = JSON.parse(extractDataCondition);

				var myQuery = Vocabulary.find();
				myQuery.where(extractDataCondition);
				myQuery.exec(function callback(err,vocabularies){
					if (err) {
                		sails.log("Err when read data from server:");
                		return res.serverError(err);
		            }
		            if (typeof vocabularies === 'undefined' || vocabularies.length == 0){
		            	return res.json({err: "Data is empty"});
		            }
		        	res.view('admin/search/vocabulary',{'vocabulary': vocabularies});
				});
			});
			
	    }else{
	    	return res.json({err: "Need a ID to select vocabularies of a lesson "});
	    }
  	},

  	/**
	* `Admin/SearchController.update()`
	*  Download image and upload to MongoDB
	*/
	update: function (req, res) {
		var request = require('request'),
			mongo = require('sails-mongo/node_modules/mongodb'),
			Grid = require('skipper-gridfs/node_modules/gridfs-stream');

		var vocabularyID = req.param("vocabularyID",null);
		var imageSrc = req.param("imageSrc",null);
		var imageID;

		var db = new mongo.Db(Database.name, new mongo.Server(Database.host, Database.port));
        var ObjectID = mongo.ObjectID;
		
		var downloadToDB = function(uri, callback){
		  	request.head(uri, function(err, res, body){
			    // console.log('content-type:', res.headers['content-type']);
			    // console.log('content-length:', res.headers['content-length']);

				db.open(function (err) {
				  	if (err) return handleError(err);
				  	var id =  new  ObjectID();
				  	var gfs = Grid(db, mongo);
				  	var writestream = gfs.createWriteStream({
					  	_id : id,
					  	filename: id.toString(), // a filename 
					    mode: 'w', // default value: w 
					    //any other options from the GridStore may be passed too, e.g.: 
					    chunkSize: 1024,
					    content_type: 'binary/octet-stream', // For content_type to work properly, set "mode"-option to "w" too! 
					    root: Database.gridfsName,
					    metadata:{
							fd: id.toString(),
							"dirname" : "."
						}
				  	});
				   request(uri).pipe(writestream).on('close', callback);
				});
		  	});
		};

		downloadToDB(imageSrc, function (file){
			Vocabulary.find({id: vocabularyID}).exec(function findCB (err, vocabulary){
				if (err) {
					console.log (err);
					sails.log("Err when read data from server:");
                	return res.serverError(err);
				}else {
					//console.log(vocabulary[0].image);
					if (typeof vocabulary[0].image !== 'undefined' || vocabulary[0].image != null){
						var gfs = Grid(db, mongo);
						gfs.remove({ 
							_id : vocabulary[0].image,
							root: Database.gridfsName
							},
							function (err) {
								if (err){
									console.log(err);
									sails.log("Err when remove data from server:");
                					return res.serverError(err);
								}else {
									console.log('delete file : '+ vocabulary[0].image +' success');
									Vocabulary.update({id: vocabularyID},{image: file._id}).exec(function afterUpdate(err, updated){
										if (err) {
										    // handle error here- e.g. `res.serverError(err);`
											console.log(err);
											sails.log("Err when update data to server:");
                							return res.serverError(err);
										}
										console.log('Updated vocabulary to have name ' + updated[0].image);
										res.json({imageId : updated[0].image});
									});
								} 	
							}
						);
					}else {
						Vocabulary.update({id: vocabularyID},{image: file._id}).exec(function afterUpdate(err, updated){
							if (err) {
								// handle error here- e.g. `res.serverError(err);`
								console.log(err);
								sails.log("Err when update data to server:");
                				return res.serverError(err);
							}
							console.log('Updated vocabulary to have name ' + updated[0].image);
							res.json({imageId : updated[0].image});
						});
					}
				}
			});
		});
	}
};

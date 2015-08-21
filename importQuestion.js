var fs = require('fs');
var parse = require('csv-parse');
var parser = parse({delimiter : ','});

var mongoose = require('mongoose');
var config = require('./config.json');


var articleInsertCount = 0;
var questionInsertCount = 0;

var articleSchema = mongoose.Schema({
  subject:  String,
  content:  String,
  level:    String,
  sort:     Number,
  tag:      String,
  category: String
},{ collection: 'article', versionKey: false });

var articleColl = mongoose.model('article', articleSchema);

var questionSchema = mongoose.Schema({
  article:     mongoose.Schema.Types.ObjectId,
  sort:          Number,
  question:      String,
  option1:       String,
  option2:       String,
  option3:       String,
  option4:       String,
  key: 			 String 
},{ collection: 'question', versionKey: false  });

var questionColl = mongoose.model('question', questionSchema);


data = fs.readFileSync(config.article_csv_file,{"encoding":"utf8"});
//console.log(data);

parse(data, {delimiter : ',', comment: '#'}, function(err, articles){

	// check header
	if (articles.length == 0){
		console.log('Error! csv file has not any data.');
		return;
	}

	var header = articles[0];
	if (header.length < 13 || 
		header[0] != 'subject' ||
		header[1] != 'content' ||
		header[2] != 'level' ||
		header[3] != 'sort' ||
		header[4] != 'tag' ||
		header[5] != 'category' ||
		header[6] != 'sort' ||
		header[7] != 'question' ||
		header[8] != 'option1' ||
		header[9] != 'option2' ||
		header[10] != 'option3' ||
		header[11] != 'option4' ||
		header[12] != 'result' ){

		console.log('Error! Format of csv file is not correct.');
		return;
	}

	var article;
	var key;
	
	var errorCount = 0;
	var insertedArticle;
	var insertedQuestion;
	// connect to mongodb
	mongoose.connect('mongodb://' + config.dbhost + '/' + config.database);
	console.log('START: IMPORTING DATA...');
	console.log('========================');
	for ( var i = 1; i < articles.length; i++ ) {
		//console.log(lessions[i]);

		article = articles[i];

		if (article[0] == "") {
			if(article[1] == ""){
				if (insertedArticle == null){
				errorCount++;
				continue; 

				} else {
					// insert question record
				    switch(article[12].toUpperCase()) {
				    	case "A" :
				    		key = "1";
				    		break;
				    	case "B" :
				    		key = "2";
				    		break;
				    	case "C" :
				    		key = "3";
				    		break;
				    	case "D" :
				    		key = "4";
				    		break;
				    }
					insertedQuestion = new questionColl({
						article:  			insertedArticle._id,
					    sort: 				    article[6],
					    question: 			    article[7],
					    option1: 				article[8],
					    option2: 	            article[9],
					    option3: 	            article[10],
					    option4: 	            article[11],
					    key: 					key
					});

					insertedQuestion.save(function (err,data) {
					    if(err) {
					        console.log(err);
					        // disconect mongodb
							mongoose.disconnect();
					    }else {
					    	questionInsertCount++;
					    	if (questionInsertCount == articles.length -1) {
								console.log('article collection: ' + articleInsertCount.toString() + ' records was inserted.');
								console.log('question collection: ' + questionInsertCount.toString() + ' records was inserted.');
								console.log('Error records: ' + errorCount.toString() );

								// disconect mongodb
								mongoose.disconnect();
								console.log('========================');
								console.log('END: IMPORTED DATA');
							}
					    }
					});
				}
			}else {
				// insert article record
				insertedArticle = new articleColl({
					subject:  			article[0],
					content: 			article[1],
					level:   			article[2],
					sort:   			article[3],
					tag:   				article[4],
					category:  			article[5]
				});

				insertedArticle.save(function (err,data) {
					if(err) {
					    console.log(err);
					    // disconect mongodb
						mongoose.disconnect();
					}else {
					    articleInsertCount++;
					}
				});
				// insert question record
				switch(article[12].toUpperCase()) {
				    case "A" :
				    	key = "1";
				    	break;
				    case "B" :
				    	key = "2";
				    	break;
				    case "C" :
				    	key = "3";
				    	break;
				    case "D" :
				    	key = "4";
				    	break;
				}
				insertedQuestion = new questionColl({
					article:  			insertedArticle._id,
					sort: 				    article[6],
					question: 			    article[7],
					option1: 				article[8],
					option2: 	            article[9],
					option3: 	            article[10],
					option4: 	            article[11],
					key: 					key
				});

				insertedQuestion.save(function (err,data) {
					if(err) {
						console.log(err);
						// disconect mongodb
						mongoose.disconnect();
					}else {
						questionInsertCount++;
						if (questionInsertCount == articles.length -1) {
							console.log('article collection: ' + articleInsertCount.toString() + ' records was inserted.');
							console.log('question collection: ' + questionInsertCount.toString() + ' records was inserted.');
							console.log('Error records: ' + errorCount.toString() );

							// disconect mongodb
							mongoose.disconnect();
							console.log('========================');
							console.log('END: IMPORTED DATA');
						}
					}
				});
			}
		} else {
			// insert article record
			insertedArticle = new articleColl({
				subject:  			article[0],
				content: 			article[1],
				level:   			article[2],
				sort:   			article[3],
				tag:   				article[4],
				category:  			article[5]
			});

			insertedArticle.save(function (err,data) {
				if(err) {
				    console.log(err);
				    // disconect mongodb
					mongoose.disconnect();
				}else {
					articleInsertCount++;
				}
			});

    		switch(article[12].toUpperCase()) {
			    case "A" :
			    	key = "1";
			    	break;
			    case "B" :
			    	key = "2";
			    	break;
			    case "C" :
			    	key = "3";
			    	break;
			    case "D" :
			    	key = "4";
			    	break;
			}
			// insert question record
			insertedQuestion = new questionColl({
				article:  			insertedArticle._id,
				sort: 				    article[6],
				question: 			    article[7],
				option1: 				article[8],
				option2: 	            article[9],
				option3: 	            article[10],
				option4: 	            article[11],
				key: 					key
			});

			insertedQuestion.save(function (err,data) {
				if(err) {
				    console.log(err);
				    // disconect mongodb
					mongoose.disconnect();
				}else {
					questionInsertCount++;
					if (questionInsertCount == articles.length -1) {
						console.log('article collection: ' + articleInsertCount.toString() + ' records was inserted.');
						console.log('question collection: ' + questionInsertCount.toString() + ' records was inserted.');
						console.log('Error records: ' + errorCount.toString() );

						// disconect mongodb
						mongoose.disconnect();
						console.log('========================');
						console.log('END: IMPORTED DATA');
					}
				}
			});
		}
	};
});

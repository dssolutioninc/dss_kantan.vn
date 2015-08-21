var request = require('request'),
    cheerio = require('cheerio'),
    fs = require('fs'),
    path = require('path'),
    async = require('async'),
    parse = require('csv-parse'),
    stringify = require('csv-stringify');
var array = [];
var array_word = [];
var array_url = [];

var fetch = function(url,callback){
    request(url, function (error, response, body) {
    	if (!error) {
    		callback(null, body);
		}else {
			callback(error);
		}
	});
};

data = fs.readFileSync(path.resolve(__dirname, 'vocabularies.csv'),{"encoding":"utf8"});
parse(data, {delimiter : ',', comment: '#'}, function(err, vocabularies){
	if (err) {
		console.log('data import error! Data has wrong');
		return;
	}

	if (vocabularies.length == 0){
		console.log('Error! csv file has not any data');
		return;
	}

	var header = vocabularies[0];
	if (header.length != 2){
		console.log('Error! Format of csv file is not correct.');
		return;
	}
	//console.log(vocabularies);
	console.log("1. START : CREATE WORD ARRAY");
    console.log("   =========================");
    vocabularies.forEach(function(item) {
    	array_word.push(item[0]);
	});
	console.log("   Created array_word have " + array_word.length + " values");
	console.log("   =========================");
    console.log("   END : CREATE WORD ARRAY");

    console.log("2. START : CREATE URL ARRAY");
    console.log("   ========================");
    array_word.forEach(function(item) {
    	var word_enc = encodeURIComponent(item.trim());
		var url = 'http://tratu.soha.vn/dict/jp_vn/' + word_enc;

    	array_url.push(url);
	});
	console.log("   Created array_url have " + array_url.length + " values");
	console.log("   ========================");
	console.log("   END : CREATE URL ARRAY");

	console.log("3. START : GET EXAMPLE...");
	console.log("   =======================");
	async.timesSeries(array_url.length,
		function(i, next){
			console.log(array_url[i]);
	    	fetch(array_url[i], function(err, result) {
	    		if (err) {
			       console.log(err);
			       return;
			    }else {
			    	var array_examples = [];

			    	if(typeof result!== 'undefined' || result != null){
			 	    		$ = cheerio.load(result);

							var data = $('#bodyContent').children('#content-3');
							if(data.length == 0){
								if($('#bodyContent').children('#content-4').length == 0){
									
									if($('#bodyContent').children('#content-5').length == 0){
										var array_tmp = [];
										array_tmp.push(array_word[i]);
										array_examples.push(array_tmp);
									}else{
										var array_tmp = [];
										array_tmp.push(array_word[i]);
										var dataByMeaning = $('#bodyContent')
															.children('#content-5')
															.children('dl')
															.children('dd')
															.children('dl')
															.children('dd');
										
										for (var m = 0; m < dataByMeaning.length; m ++ ){
											array_tmp.push(dataByMeaning.eq(m).text().trim().replace(",","、"));
										}
										array_examples.push(array_tmp);
									}
								}else{
									var dataByType = $('#bodyContent').children('#content-4');
									var array_tmp = [];
									array_tmp.push(array_word[i]);
									for (var t = 0; t < dataByType.length; t ++){
										var dataByMeaning = dataByType
															.eq(t)
															.children('#content-5')
															.children('dl')
															.children('dd')
															.children('dl')
															.children('dd');
										
										for (var m = 0; m < dataByMeaning.length; m ++ ){
											array_tmp.push(dataByMeaning.eq(m).text().trim().replace(",","、"));
										}
									}
									array_examples.push(array_tmp);
								}
							}else{
								var j1=0;
								var j2=0;
								data.each(function(){
									var dataByReading = data.eq(j1);
									var reading1 = dataByReading
													.children('h3')
													.children('span')
													.children('b')
													.text()
													.trim();
									var reading2 = vocabularies[i][0].trim();
									var reading3 = vocabularies[i][1].trim();
									
									if (reading1 == reading2 || reading1 == reading3 || data.length == 1){
										
										if(dataByReading.children('#content-4').length == 0){
											var dataByType = dataByReading.children('#content-5');
											var array_tmp = [];
											array_tmp.push(array_word[i]);
											var dataByMeaning = dataByType
																.children('dl')
																.children('dd')
																.children('dl')
																.children('dd');
											
											for (var m = 0; m < dataByMeaning.length; m ++ ){
												array_tmp.push(dataByMeaning.eq(m).text().trim());
											}
											array_examples.push(array_tmp);

										}else{
									
											var dataByType = dataByReading.children('#content-4');
											var array_tmp = [];
											array_tmp.push(array_word[i]);
											for (var t = 0; t < dataByType.length; t ++){
												var dataByMeaning = dataByType
																	.eq(t)
																	.children('#content-5')
																	.children('dl')
																	.children('dd')
																	.children('dl')
																	.children('dd');
												
												for (var m = 0; m < dataByMeaning.length; m ++ ){
													array_tmp.push(dataByMeaning.eq(m).text().trim().replace(",","、"));
												}
											}
											array_examples.push(array_tmp);
										}
									}else{
										j2++
									}
									j1++;
								});
								if(j2 == j1){
									var array_tmp = [];
									array_tmp.push(array_word[i]);
									array_tmp.push("NEED TO REVIEW");
									array_examples.push(array_tmp);
								}
							}
			    	}else{
			    			var array_tmp = [];
			    			array_tmp.push(array_word[i]);
							array_examples.push(array_tmp);
			    	}
			    	stringify(array_examples,{header:false, quotedString:false}, function(err, output){
				        fs.appendFile(path.resolve(__dirname, 'examples.csv'), output, function (err) {
				        	if (err){
				          		console.log(err);
				          		return;
				          	}
				          	console.log("   Writed examples to file examples.csv"); 
				          	next(err);
				        });
			      	});
			    }
	    	})
	    },
		function(err, data) {
		    if(err){
		    	console.log(err);
		    	return;
		    }
			console.log("   =======================");
		    console.log('   END: GET EXAMPLE'); 
	});
});
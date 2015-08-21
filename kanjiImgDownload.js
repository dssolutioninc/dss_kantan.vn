var fs = require('fs'),
    request = require('request'),
    parse = require('csv-parse');

var parser = parse({delimiter : ','});

//var sleep = require('sleep');

var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    //console.log('content-type:', res.headers['content-type']);
    //console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

data = fs.readFileSync('work/kanji_gif/kanji_gif_list.csv',{"encoding":"utf8"});
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

	
	// rows.forEach(function(row) {
		
	// 	download('http://kakijun.jp/gif/' + row[0] + '.gif', 'work/kanji_gif/' + row[0] + '.gif', function(){
	// 	    console.log('work/kanji_gif/' + row[0] + '.gif : done');
	// 	});

	// 	// sleep.sleep(1);
	// });

	var i, row;
	for (i = 0; i < 1000; i++) {
		row = rows[i];
		download('http://kakijun.jp/gif/' + row[0] + '.gif', 'work/kanji_gif/' + row[0] + '.gif', function(){
		    console.log('work/kanji_gif/' + row[0] + '.gif : done');
		});
	}
});

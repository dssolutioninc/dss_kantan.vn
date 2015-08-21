var querystring = require('querystring');
var request = require('request');
var async = require('async');
var fs = require('fs');
var parse = require('csv-parse');
var stringify = require('csv-stringify');
var parser = parse({delimiter : ','});
var config = require('./../config.json');

var columns = {
 ObjectID:  'ID',
 kanji:     'KANJI',
 reading:   'READING' 
};
var arrayBefore = [];
var arrayAfter = [];

data = fs.readFileSync('./data.csv',{"encoding":"utf8"});

parse(data, {delimiter : ',', comment: '#'}, function(err, arrays){
  arrays.forEach(function(item) {
     arrayBefore.push({
      id:     item[0],
      kanji:  item[1]
     });
  });
  console.log('START: CONVERTING TO HIRAGANA...');
  console.log('========================');
  async.map(arrayBefore, fetch, function(err, results){
    if (err) {
      console.log(err);
    }else {
      results.forEach(function(item) {
        console.log(item);
        arrayAfter.push([
          item.request_id,
          item.converted
        ]);
      });
      stringify(arrayAfter,{header:false, columns: columns}, function(err, output){
        //console.log(output.length);
        fs.writeFile('./dataConverted.csv', output, function (err) {
          if (err) throw err;
          console.log("Writed documents to file dataConverted.csv");
          console.log('========================');
          console.log('END: CONVERTED TO HIRAGANA');  
        });
      });
    }
  });
});

var fetch = function(sentence,callback){
  var post_data = querystring.stringify({
  app_id:       "7d1769a7d48a6f631ecce039ddcbb57a9aa2bdeb221e7359fc4ce7daa73ee2a1",
  request_id:   sentence.id,
  sentence:     sentence.kanji,
  output_type:  "katakana"
  });

  request.post({
    uri:"https://labs.goo.ne.jp/api/hiragana",
    headers:{'content-type': 'application/x-www-form-urlencoded'},
    body:post_data
    },function(err,res,body){
      if (!err && res.statusCode == 200) {
        var json = JSON.parse(body);
        callback(null, json);
      }else {
        callback(err);
      }
  });
};
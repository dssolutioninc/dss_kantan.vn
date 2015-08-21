var async = require('async');
var fs = require('fs');
var parse = require('csv-parse');
var parser = parse({delimiter : ','});
var mongoose = require('mongoose');
var config = require('./../config.json');

var collection = 'example';
var fromColl = 'example';
var toColl = 'reading';
var array = [];

var schema = new mongoose.Schema({
  vocabulary:   mongoose.Schema.Types.ObjectId,
  kanji:        mongoose.Schema.Types.ObjectId,
  grammar:      mongoose.Schema.Types.ObjectId,
  example:      String,
  reading:      String,
  meaning:      String
},{ collection: collection});

var model = mongoose.model(collection, schema);


data = fs.readFileSync('./dataConverted.csv',{"encoding":"utf8"});

parse(data, {delimiter : ',', comment: '#'}, function(err, arrays){
  arrays.forEach(function(item) {
     array.push({
      id:       item[0],
      reading:  item[1]
     });
  });
  // connect to mongodb
  mongoose.connect('mongodb://' + config.dbhost + '/' + config.database, function (err){
    if (err) {
        return console.log(err);
    }
  });
  console.log('START: UPDATING DATA...');
  console.log('========================');
  async.map(array, fetch, function(err, results){
    if (err) {
      console.log(err);
    }else {
      console.log(collection +" collection:" + results.length + " records was updated");
    }
    //disconect mongodb
    mongoose.disconnect();
    console.log('========================');
    console.log('END: UPDATED DATA...');
  });
});

var fetch = function(sentence,callback){
  model.findByIdAndUpdate(sentence.id, { $set: { reading: sentence.reading }}, function (err, tank) {
    if (err) {
      callback(err);
    }else {
      callback(null,tank);
    }
  });
};
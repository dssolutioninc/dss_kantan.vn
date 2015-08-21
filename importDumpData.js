var exec = require('child_process').exec;
var Db = require('mongodb').Db;
var Server = require('mongodb').Server;
var config = require('./config.json');

var importDumpData;
var command;
var db = new Db(config.database, new Server(config.dbhost, config.dbport));

command = 'mongorestore --host '  + config.dbhost   +
          ' --port '              + config.dbport   +
          ' --db '                + config.database +
          ' '                     + config.dbimport ;
db.open(function(err, db) {
  if(err){
    console.log(err);
  }
 
  db.dropDatabase(function(err, result) {
    if(err){
      console.log(err);
      db.close();
    }
    importDumpData = exec(command, function (error, stdout, stderr) {
      if (stdout){
        console.log('stdout: ' + stdout);
      }

      if (stderr){
        console.log('stderr: ' + stderr);
      }
      
      if (error) {
        console.log('exec error: ' + error);
      } 
      db.close();
    });
  });
});


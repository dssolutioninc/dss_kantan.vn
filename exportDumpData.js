var exec = require('child_process').exec;
var config = require('./config.json');

var exportDumpData;
var command;

command = 'mongodump --host ' + config.dbhost   +
          ' --port '          + config.dbport   +
          ' --db '            + config.database +
          ' --out '           + config.dbexport ;

exportDumpData = exec(command, function (error, stdout, stderr) {
  	if (stdout){
  		console.log('stdout: ' + stdout);
  	}

  	if (stderr){
  		console.log('stderr: ' + stderr);
  	}

    if (error) {
      console.log('exec error: ' + error);
    } 
});
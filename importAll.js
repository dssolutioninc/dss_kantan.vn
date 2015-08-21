var exec = require('child_process').exec;

var importVocabulary;
importVocabulary = exec('node importVocabulary.js {{args}}',
  {maxBuffer: 1024 * 500} ,
  function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    } 
});

var importKanji;
importKanji = exec('node importKanji.js {{args}}',
  {maxBuffer: 1024 * 500} ,
  function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    } 
});

var importQuestion;
importQuestion = exec('node importQuestion.js {{args}}',
  {maxBuffer: 1024 * 500} ,
  function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    } 
});

var importBook;
importBook = exec('node importBook.js {{args}}',
  {maxBuffer: 1024 * 500} ,
  function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    } 
});

var importSurvey;
importSurvey = exec('node importSurvey.js {{args}}',
  {maxBuffer: 1024 * 500} ,
  function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    } 
});

var importGrammar;
importGrammar = exec('node importGrammar.js {{args}}',
  {maxBuffer: 1024 * 500} ,
  function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    } 
});

var importSpeech;
importSpeech = exec('node importSpeech.js {{args}}',
  {maxBuffer: 1024 * 500} ,
  function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    } 
});
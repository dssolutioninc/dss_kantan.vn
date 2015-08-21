/**
 * translate Response service
 * 
 */

module.exports = {

    //Google translate api
	googleTranslate: function(languageLocale, word, callback) {
		var request = require('request');
		var streamBuffers = require("stream-buffers");
	    var url = "http://translate.google.com/translate_tts?ie=utf-8&tl=" + languageLocale + "&q=" + word;
	      
	    var myWritableStreamBuffer = new streamBuffers.WritableStreamBuffer({
	        initialSize: (100 * 1024),      // start as 100 kilobytes.
	        incrementAmount: (10 * 1024)    // grow by 10 kilobytes each time buffer overflows.
	    });

	    var r = request(url, function (error, response, buffer) {
	        if (!error && response.statusCode == 200) {
	            var data = myWritableStreamBuffer.getContents().toString('base64');
	            var result = {'audio' : data, 'success' : true };
	            callback(result);
	         } else {
	           var result = {'success' : false, 'error' : error, 'responseCode' : response.statusCode };
	           callback(result);
	         }
	      }).pipe(myWritableStreamBuffer);
  	},

  	//VoicerRSS api
  	voicerRSS: function(languageLocale, word, callback){
  		var request = require('request');
		var streamBuffers = require("stream-buffers");
	    var url = "https://api.voicerss.org/?key=6e1c89141fe9405198f5c8c9e33e0dd3&hl=" + languageLocale + "&r=0&c=mp3&f=48khz_16bit_stereo&src=" + word;
	    var myWritableStreamBuffer = new streamBuffers.WritableStreamBuffer({
	        initialSize: (100 * 1024),      // start as 100 kilobytes.
	        incrementAmount: (10 * 1024)    // grow by 10 kilobytes each time buffer overflows.
	    });

	    var r = request(url, function (error, response, buffer) {
	        if (!error && response.statusCode == 200) {
	            var data = myWritableStreamBuffer.getContents().toString('base64');
	            var result = {'audio' : data, 'success' : true };
	            callback(result);
	         } else {
	           var result = {'success' : false, 'error' : error, 'responseCode' : response.statusCode };
	           callback(result);
	         }
	      }).pipe(myWritableStreamBuffer);
  	}
}
/**
 * Created by Dulv on 8/9/2015.
 */

module.exports = {
    _config: {
        locals: {
            layout: 'layout/layout-japtool'
        }
    },
    
    index: function (req, res) {

        // sails.log(JSON.stringify(req.session.user));
    	if (!req.session.authenticated) {
	        res.ok();
	    } else if (req.session.user.currentLevel == null) {
            // sails.log('req.session.user.currentLevel: ' + req.session.user.currentLevel);
	    	res.render('japtool/survey/getLevel');
        // } else if () {

	    } else {

	    	SurveyResult.find({where: {user: req.session.user.id}})
	    	.exec(function(err, doneSurveys){
	    		var doneSurveyIDs = [];
	    		doneSurveys.forEach( function(doneSurvey) {
	    			doneSurveyIDs.push(doneSurvey.survey);
	    		});

	    		// sails.log("doneSurveyIDs: " + doneSurveyIDs);
	    		Survey.find({
	    			where: {id: {'!': doneSurveyIDs}},
	    			limit: 1,
	    			sort: {sort: 1} })
	    		.exec(function(err, surveys){
	    			// sails.log("surveys: " + JSON.stringify(surveys));
	    			if (surveys.length > 0) {
		    			res.render('japtool/survey/getSurvey', {survey: surveys[0], timeStamp: new Date().getTime()});
		    		}　else {
	    				res.ok();
		    		}
	    		});
	    	});
	    }
    },

    postSurvey: function (req, res) {
	    var params = req.allParams();

	    if (!req.session.authenticated || req.method != 'POST') {
	    	res.send(404);
	    } else {
	      	SurveyResult.create({
		      	user: req.session.user.id, 
		      	survey: params.surveyID,
		      	answer: params.selectedAnswer})
	      	.exec(function (err, SurveyResult) {
                if (err) {
                	res.send(404);
                } else {
                	res.ok();
                }
            });
	    }
  	},
}
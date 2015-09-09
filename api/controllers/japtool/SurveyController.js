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

        sails.log(JSON.stringify(req.session.user));
    	if (!req.session.authenticated) {
	        res.ok();
	    } else if (req.session.user.currentLevel == null) {
            sails.log('req.session.user.currentLevel: ' + req.session.user.currentLevel);
	    	res.render('japtool/survey/getLevel',
                {
                }
            );
	    } else {
	    	res.ok();
	    }
    },
}
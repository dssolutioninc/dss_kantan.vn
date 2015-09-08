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

    	if (!req.session.authenticated) {
	        res.ok();
	    } else if (req.session.User.currentLevel == null) {
	    	res.render('japtool/survey/getLevel',
                {
                }
            );
	    } else {
	    	res.ok();
	    }
    },
}
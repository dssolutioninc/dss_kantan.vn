/**
 * Created by Dulv on 7/27/2015.
 */
module.exports = function(req, res, next) {

	// set languge for interface
	if ( req.param('lang') ) {
    req.session.lang = req.param('lang');
    if (req.session.authenticated){
      // update interface language for user
      User.update({id: req.session.user.id}, {language: req.session.lang}, function (err, updateUser) {
      });
    }
	}

  if ( !req.session.lang ) {
    req.session.lang = 'vi'; 
  }

	req.setLocale(req.session.lang);


  // authenticate
  //if (!req.session.authenticated &&
  //      (req.path.indexOf('japtool/user') > -1 ||
  //      req.path.indexOf('japtool/vocabulary') > -1  ||
  //      req.path.indexOf('japtool/BookMaster') > -1  ||
  //      req.path.indexOf('japtool/authenticated') > -1  ||
  //      req.path.indexOf('japtool/Learning') > -1  ||
  //      req.path.indexOf('japtool/Library') > -1 ) ){
  //
  //      var requireLoginError = [{name: 'requireLogin', message: 'You must be sign in.'}]
  //      req.session.flash = {
  //          err: requireLoginError
  //      }
  //      res.redirect('/japtool/auth');
  //
  //  }
  //  if (req.session.authenticated) {
  //      return ok();
  //  }//User is not allowed
  //  else {
  //      var requireLoginError = [{name: 'requireLogin', message: 'You must be sign in.'}]
  //      req.session.flash = {
  //          err: requireLoginError
  //      }
  //      res.view('/japtool/auth');
  //      return;
  //  }
	// pre check validate
	res.locals.flash ={};
  if(req.session.flash){
    res.locals.flash = _.clone(req.session.flash);

    //clear flash
    req.session.flash ={};
  }
    
  next();
};
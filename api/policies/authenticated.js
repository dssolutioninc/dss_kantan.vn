/*
*Allow any authenticated user
*/
module.exports = function (req, res, ok) {
    //User us allowed, proceed to controller
    if (req.session.authenticated) {
        return ok();
    }
    //User is not allowed
    else {
        var requireLoginError = [{
            name: req.__('Sigin Please!'), 
            message: req.__('You must be sign in if you want using this page.')
        }]
        req.session.flash = {
            err: requireLoginError
        }
        res.redirect('/japtool/auth');
        return;
    }
};

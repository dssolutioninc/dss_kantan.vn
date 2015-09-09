/*
 * Allow any authenticated user.
 */
module.exports = function (req, res, ok) {
    //User is allowed. proceed to controller
    if (req.session.user && req.session.user.admin) {
        return ok();
    }
    //User is not allowed
    else {
        var requireAdminError = [{name: 'requireAdminError', message: 'You must be an admin.'}]
        req.session.flash = {
            err: requireAdminError
        }
        // res.redirect('/japtool/auth');
        // return;
        return res.json(requireAdminError);
    }
}
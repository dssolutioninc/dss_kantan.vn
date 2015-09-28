/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var passport = require('passport');
var bcrypt = require('bcryptjs');
module.exports = {
    index: function (req, res) {
        if (req.session.user) {
            res.redirect('/japtool/user/index');
        } else {
            res.view();
        }
    },
    login: function (req, res, next) {
        // Check for email and password in params sent via the form, if none
        // redirect the browser back to the sign-in form.

        if (!req.param('email') || !req.param('password')) {
            var usernamePasswordRequiredError = [{
                name: req.__('username and Password Required'),

                message: req.__('You must enter both a email and password')

            }]

            // Remember that err is the object being passed down, whose value is another object with
            // the key of usernamePasswordRequiredError
            req.session.flash = {
                err: usernamePasswordRequiredError
            }
            res.redirect('/japtool/auth');
            return;
        }

        // Try to find the user by there email address.
        // findOneByEmail() is a dynamic finder in that it searches the model by a particular attribute.
        // User.findOneByEmail(req.param('email')).done(function(err, user) {
        User.findOneByEmail(req.param('email'), function foundUser(err, user) {
            if (err) return next(err);

            // If no user is found...
            if (!user) {
                var noAccountError = [{
                    name: 'noAccount',
                    message: req.__('The email address ') + req.param('email') + req.__(' not found')
                }]
                req.session.flash = {
                    err: noAccountError
                }
                res.redirect('/japtool/auth');
                return;
            }

            // Account is not activated yet
            if (!user.active) {
                var inactiveError = [{
                    name: 'inactiveAccount',
                    message: req.__('Account is not activated yet. Please check your mail and get activate link')
                }]
                req.session.flash = {
                    err: inactiveError
                }
                res.redirect('/japtool/auth');
                return;
            }

            // Compare password from the form params to the encrypted password of the user found.
            bcrypt.compare(req.param('password'), user.encryptedPassword, function (err, valid) {
                if (err) return next(err);

                // If the password from the form doesn't match the password from the database...
                if (!valid) {
                    var usernamePasswordMismatchError = [{
                        name: req.__('username Password Mismatch'),
                        message: req.__('Invalid username and password combination')
                    }]
                    req.session.flash = {
                        err: usernamePasswordMismatchError
                    }
                    res.redirect('/japtool/auth');
                    return;
                }

                req.session.authenticated = true;
                req.session.user = user;
                req.session.lang = user.language;

                //If the user is also an admin redirect to the user list(/view/user/index.ejs)
                //This is user in conjuntion with config/policies.js file
                //if (req.session.user.admin) {
                //    res.redirect('/japtool/user');
                //    return;
                //}
                // Change status to online
                user.online = true;
                user.save(function (err, user) {
                    if (err) return next(err);

                    // Inform other sockets (e.g. connected sockets that are subscribed) that this user is now logged in
                    User.publishUpdate(user.id, {
                        loggedIn: true,
                        id: user.id,
                        name: user.name,
                        action: req.__(' has logged in')
                    });

                    // If the user is also an admin redirect to the user list (e.g. /views/user/index.ejs)
                    // This is used in conjunction with config/policies.js file
                    //if (req.session.user.admin) {
                    //    res.redirect('/japtool/user');
                    //    return;
                    //}

                    //Redirect to their profile page (e.g. /views/user/show.ejs)
                    if (user.currentLevel == null) {
                        res.redirect('/japtool/page/guide');

                    } else {
                        res.redirect('/japtool/myLearning');

                    }
                });
            });
        });

    },
    destroy: function (req, res, next) {
        // var lang = req.session.lang;
        // if(!lang) lang = 'en';
        sails.log('destroy');
        User.findOne(req.session.user.id, function foundUser(err, user) {
            var userId = req.session.user.id;
            //The user is "logging out"
            console.log(userId);
            User.update(userId, {
                online: false
            }, function (err) {
                if (err) return next(err);
                //Wipe out the session (log out)
                req.session.destroy();
                //redirect the browser to the sign-in screen
                // res.redirect('/japtool/auth?lang='+lang);
                res.redirect('/japtool/auth');
            })
        })
    },
    _config: {
        locals: {
            layout: 'layout/layout-japtool'
        }
    }
};


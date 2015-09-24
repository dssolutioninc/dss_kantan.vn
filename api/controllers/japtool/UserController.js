/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var bcrypt = require('bcryptjs');
var format = require('date-format');
module.exports = {
//This loads the sign-up page new.ejs
  'new': function (req, res) {
    res.view();
  },
  //Create user
  create: function (req, res) {
    var yourAddress = {
      company: '',
      address: '',
      city: '',
      postCode: '',
      country: ''
    };
    var regisInfor = req.params.all();
    // check existing registed email
    User.findOne({email: regisInfor.email}, function (err, foundUser){
      if (err) { res.send(400); }
      else {
        if (foundUser){

          var existingEmail = [{
              name: req.__('Email address is being used'),
              message: req.__('Your registing email is in using. Please use other or go to foget password page if you lost you password.')
          }]
          req.session.flash = {
              err: existingEmail
          }
          return res.redirect('/japtool/user/new');
        } 
        else {
          //Create a user with the params sent from the sign-up form new.ejs
          User.create(req.params.all(), function userCreated(err, user) {
            //If there's an error
            if (err) {
              req.session.flash = {
                err: err
              }
              //if error redirect back to sign-up page
              return res.redirect('/japtool/user/new');
            }
            //Update user address
            User.update({id: user.id}, {yourAddress: yourAddress}, function (err, updateUser) {
            });

            var strPort = sails.config.port == 80 ? '' : ':' + sails.config.port;

            var homeUrl = req.protocol + '://' + req.host + strPort;
            var activateUrl = homeUrl + '/japtool/user/active?activatecode=' + user.id;
            var subject = req.__('Account activate mail subject');
            var mailLayoutFile = 'activeAccount_' + req.session.lang + '.ejs';

            Mailer.send(mailLayoutFile, user, {subject: subject, homeUrl: homeUrl, activateUrl: activateUrl} );

            //　go to waiting active page
            res.view('japtool/user/active-account', {code: 'waitActivate'});
          });
        }
      }
    });
  },
  //active account after new user created
  active: function (req, res) {
    var userID = req.param('activatecode');

    User.findOne(userID, function(err, user) {
      if (err || !user) {
        return res.view('japtool/user/active-account', {code: 'fail'});
      }
      
      User.update(user.id, {active: true}, function (err, userUpdated) {
        if (err) {
          return res.view('japtool/user/active-account', {code: 'fail'});
        } 

        return res.view('japtool/user/active-account', {code: 'success'});
      });
    });
  },
  //render the profile view (show.ejs)
  show: function (req, res, next) {
    User.findOne(req.param('id'), function foundUser(err, user) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next();
      }
      var createDate = format.asString('dd-MM-yyyy', new Date(user.createdAt));
      res.view({user: user,createDate:createDate});
    });
  },
  //render the edit view edit.ejs
  edit: function (req, res, next) {
    //Find the user from the id passed in via params
    var id = req.param('id');
    var sessionIdUser = req.param('sessionIdUser');
    console.log('sessionIdUser:',sessionIdUser);
    console.log('id',id);
    User.findOne(req.param('id'), function foundUser(err, user) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next();
      }
      Country.find(function (err, listCountrys) {
        if (err) {
          return next(err);
        }
        res.render('japtool/user/edit-user-information', {
          listCountry: listCountrys,
          user: user
        });
      });
    });
  },
  //Process the info from edit view
  update: function (req, res, next) {
    var id = req.param('userInfoId');
    User.update(id, req.params.all(), function (err, users) {
      if (err) {
        return next(err);
      }
      res.render('japtool/user/show-user-info', {user: users[0]});
    });
  },
  // common update user infor function
  commonUpdate: function (req, res) {
    var params = req.allParams();
    delete params.id;

    if (!req.session.authenticated || req.method != 'PUT') {
      res.send(404);
    } else {
      User.update(req.session.user.id, params, function (err, users) {
        if (err) {
          res.send(404);
        } else {
          req.session.user = users[0];
          res.ok();
        }
      });
    }
  },
  //edit avatar user
  editAvatar: function (req, res, next) {
    var userCodeID = req.param('userCodeID');
    var userAvatar = req.param('userAvatar');
    FileAction.rm(userAvatar, function (err, file) {
      if (err) {
        sails.log(err);
      }
    });
    FileAction.upload('uploadAvatar', req, function (err, img) {
      if (err) {
        res.negotiate(err);
      } else {
        avatarimg = img[0].fd;
        User.update({id: userCodeID}, {avatar: avatarimg}, function (err, updateAvatar) {
          if (err) {
            sails.log(err)
          } else {
            res.redirect('japtool/user/show/' + userCodeID)
          }
        });
      }
    });
  },
  //display all list user to index.ejs
  index: function (req, res, next) {
    //Get an array of all user in the user collection (ex: SQL select table)
    var lv;
    var crt;
    var userId = req.session.user.id
    User.findOne({id: userId}).exec(function (err, user) {
      if (err) {
      }
      else {
        lv = user.currentLevel;
        if (lv == null || lv == '') {
          /* res.redirect('japtool/user/afterLogin');*/
          res.view({
            lv: '',
            crt: ''
          });
        }
        else {
          SurveyResult.find({UserID: user.id}).exec(function (err, svuss) {
            if (err) {
            }
            else {
              crt = user.currentLearningTime;
              if (svuss == null || svuss == '') {
                res.view({
                  lv: lv,
                  crt: crt
                });
              }
              else {
                res.redirect('japtool/user/afterLogin');
              }
            }
          })
        }
      }
    })
  },
  //Delete user
  destroy: function (req, res, next) {
    User.findOne(req.param('id'), function foundUser(err, user) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next(req.__("User doesn't exit"));
      }
      User.destroy(req.param('id'), function userDestroyed(err) {
        if (err) {
          return next(err);
        }
      });
      res.redirect('/japtool/auth');
    });
  },
  //Change Password
  changePass: function (req, res) {
    var id = req.param('id');
    var oldPass = req.param('oldPass');
    var newPass = req.param('newPass');
    var newPassCf = req.param('newPassCf');
    var mess = '';
    //check user pass with input pass
    bcrypt.compare(oldPass, req.session.user.encryptedPassword, function (err, valid) {
      //if the input password doesn't match the password from the database...
      if (err || !valid) {
        mess = req.__('Your password is invalid');
        res.send({mess: mess, code: 'error'});
      }
      //everything is valid, encrypting password and save to db, session
      else {
        require('bcryptjs').hash(newPass, 10, function passwordEncypted(err, encryptedPassword) {
          if (err) {
            mess = req.__('Encrypt password failed');
            res.send({mess: mess, code: 'error'});
          } else {
            User.update(id, {encryptedPassword: encryptedPassword}, function (err, userUpdated) {
              if (err) {
                mess = req.__('Update failed');
                res.send({mess: mess, code: 'error'});
              } else {
                mess = req.__('Update success');
                req.session.user.encryptedPassword = userUpdated[0].encryptedPassword;
                res.send({mess: mess, code: 'valid'});
              }
            });
          }
        });
      }
    });
    //res.send({mess: mess});
  },
  passforget: function (req, res) {
    if( req.method=="GET" ) {
      res.view('japtool/user/forget-password');
    } 
    else if (req.method=="POST" ) {
      var email = req.param('email');

      User.findOne({email: email}).exec(function (err, user) {
        if (!user) {
          var wrongEmail = [{
              name: req.__('Email address is wrong'),
              message: req.__('Your inputed email address is not correct. Check and do it again.')
          }]
          req.session.flash = {
              err: wrongEmail
          }
          return res.redirect('/japtool/user/passforget');
        } 
        else {
          var newPass = Utils.randomPassword(10);

          require('bcryptjs').hash(newPass, 10, function (err, encryptedPassword) {
            if (err) {
              console.log ('Encrypt password error');
              res.send(400);
            } else {
              User.update(user.id, {encryptedPassword: encryptedPassword}, function (err, userUpdated) {
                if (err) {
                  res.send(400);
                } else {
                  // send pass to user's email
                  var homeUrl = req.protocol + '://' + req.host + ':' + sails.config.port;
                  var subject = req.__('User Account password reset');
                  var mailLayoutFile = 'newPassword_' + req.session.lang + '.ejs';

                  Mailer.send(mailLayoutFile, user, {subject: subject, newPassword: newPass, homeUrl: homeUrl} );

                  //　go to waiting active page
                  res.view('japtool/user/active-account', {code: 'resetPassword'});
                }
              });
            }
          });
        }
      });
    }
  },
  afterLogin: function (req, res) {
    res.view('japtool/user/afterLogin');
  },
  searchUser: function (req, res, next) {
    var id_origin = req.param('id_origin');
    var username = req.param('username');
    User.find({username: '%' + username + '%'}, function searchUser(err, user) {
      if (err) {
        res.send(400);
      } else {
        Buddy.find(function (err, buddy) {
          res.render('japtool/user/list-find-friends', {
            id_origin: id_origin,
            buddy: buddy,
            ob: user
          });
        });
      }
    });
  },
  //Add Friend of user to collection with module "One to Many"
  addBuddy: function (req, res) {
    var users = req.param('id_origin_hidden');
    var user_id = req.param('userid');
    var statusBuddy = req.param('statusBuddy');
    if (statusBuddy == 1) {
      sails.log('status 1');
    }
    else if (statusBuddy == 2) {
      sails.log('status 1');
    }
    else {
      Buddy.create({user_id: user_id, statusBuddy: '2', buddyOf: users}, function userCreated(err, buddy) {
        if (err) {
          res.send(400);
        } else {
          res.json({isFlag: 1});
        }
      })
    }
  },
  //Find all Friend of User
  findBuddy: function (req, res) {
    var id = req.param('idUser');
    User.findOne(id).populate('buddy').exec(function findBuddy(err, buddys) {
      if (err) {
        res.send(400);
      } else {
        //res.send(buddys);
        res.view('japtool/user/list-friends', {buddys: buddys})
      }
    });
  },
  _config: {
    locals: {
      layout: 'layout/layout-japtool'
    }
  }
};

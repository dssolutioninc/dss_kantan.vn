/**
 * AuthController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var bcrypt = require('bcryptjs');
module.exports = {
  index:function(req, res){
    res.view();
  },
  _config: {
    locals: {
      layout: 'layout/layout-auth'
    }
  }
};


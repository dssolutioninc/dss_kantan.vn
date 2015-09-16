/**
 * UsersController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var moment = require('moment');
module.exports = {
  'new': function (req, res) {
    res.view();
  },
  _config: {
    locals: {
      layout: 'layout/layout-admin'
    }
  }
};


/**
 * Created by DongDL1 on 7/13/2015.
 */
/**
 * Grammar.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
    item: {
      type: 'string'
    },
    description: {
      type: 'string'
    },
    useGuide: {
      type: 'string'
    },
    examples: {
      collection: "Example",
      via: "grammar"
    },
    image: {
      type: 'string'
    },
    audio: {
      type: 'string'
    },
    video: {
      type: 'string'
    },
    level: {
      type: 'string'
    },
    sort: {
      type: 'integer'
    },
    tag: {
      type: 'string'
    },
    category: {
      type: 'string'
    }

  },

  //select grammar by Level
  selectByLevel: function (opts, cb) {
    var condition = opts.condition;
    var jsonObj = JSON.parse(condition);
    Grammar.find({where: jsonObj, sort: 'sort'})
      .populate('examples')
      .exec(function (err, grammars) {
        if (err) {
          return cb(err);
        }
        if (grammars == null || grammars.length == 0) {
          err = new Error();
          err.message = require('util').format('Cannot find grammars');
          err.status = 404;
          console.log(err.message);
          return cb(err);
        }
        return cb(null, grammars);
      });
  }

};


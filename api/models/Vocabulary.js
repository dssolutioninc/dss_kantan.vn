/**
 * Vocabulary.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {
        item: {
            type: 'string'
        },
        reading: {
            type: 'string'
        },
        type: {
            type: 'string'
        },
        description: {
            type: 'string'
        },
        examples: {
            collection: "Example",
            via: "vocabulary"
        },
        synonymous: {
            type: 'string'
        },
        antonymous: {
            type: 'string'
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

    //select vocabulary by Level
    selectByLevel: function (opts, cb) {
        var condition = opts.condition;
        sails.log("condition 1:")
        sails.log(condition)
        var jsonObj = JSON.parse(condition);
        sails.log("jsonObj 1:")
        sails.log(jsonObj)

        Vocabulary.find({where: jsonObj, sort: 'sort'})
            .populate('examples')
            .exec(function (err, vocabularies) {
                if (err) {
                    return cb(err);
                }
                //if (vocabularies == null || vocabularies.length == 0) {
                //    err = new Error();
                //    err.message = require('util').format('Cannot find vocabularies');
                //    err.status = 404;
                //    console.log(err.message);
                //    return cb(err);
                //}
                return cb(null, vocabularies);
            });
    }

};


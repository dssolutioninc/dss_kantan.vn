/**
 * Created by TuyenTV1 on 7/10/2015.
 */
module.exports = {
    attributes: {
        item: {
            type: 'string'
        },
        hanviet: {
            type: 'string'
        },
        kunyomi: {
            type: 'string'
        },
        onyomi: {
            type: 'string'
        },
        description: {
            type: 'string'
        },
        image: {
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
        },
        examples: {
            collection: "example",
            via: "kanji"
        }
    },
    //select vocabulary by Level
    selectByLevel: function (opts, cb) {
        var condition = opts.condition;
        var jsonObj = JSON.parse(condition);

        Kanji.find({where: jsonObj, sort: 'sort'})
            .populate('examples')
            .exec(function (err, kanji) {
                if (err) {
                    return cb(err);
                }
                //if (kanji == null || kanji.length == 0) {
                //    err = new Error();
                //    err.message = require('util').format('Cannot find Kanji');
                //    err.status = 404;
                //    console.log(err.message);
                //    return cb(err);
                //}
                return cb(null, kanji);
            });
    }
}

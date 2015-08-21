/**
 * Created by TuyenTV1 on 7/28/2015.
 */
module.exports = {
    attributes: {
        sentence: {
            type: 'string'
        },
        description: {
            type: 'string'
        },
        level: {
            type: 'string'
        },
        sort: {
            type: 'int'
        },
        tag: {
            type: 'string'
        }
    },
    //select vocabulary by Level
    selectByLevel: function (opts, cb) {
        var condition = opts.condition;
        var jsonObj = JSON.parse(condition);

        Sentence.find({where: jsonObj, sort: 'sort'})
            .exec(function (err, sentences) {
                if (err) {
                    return cb(err);
                }
                return cb(null, sentences);
            });
    }

}
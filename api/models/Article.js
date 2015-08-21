/**
 * Created by DuongTD2 on 6/30/2015.
 */
module.exports = {

    attributes: {
        subject: {
            type: "string",
            required:true
        },

        content: {
            type: "string",
            required:true
        },
        question:{
            collection: 'Question',
            via: 'article'
        },
        explaination: {
            type: "string",
            required: true
        },

        translation: {
            type: "string",
            required: true
        },

        level: {
            type: "string",
            required: true
        },

        sort:{
            type: 'integer',
            autoIncrement: true
        },

        tag: {
            type: "string"
        },

        category: {
            type: "string",
            required: true
        },

        video: {
            type: "string"
        },

        image: {
            type: "string"
        },

        audio: {
            type: "string"
        }
    },

    getLessonArticle: function(opts,cb) {
        var condition = opts.condition;
        var jsonObj = JSON.parse(condition);

        Article.find({where: jsonObj, sort : 'sort'})
            .populate('question')
            .exec(function(err,articles){
                if(err) {
                    return cb(err);
                }
                if(articles == null || articles.length == 0) {
                    err = new Error();
                    err.message = require('util').format('Cannot find Article');
                    err.status = 404;
                    console.log(err.message);
                    return cb(err);
                }
                return cb(null,articles);
            });
    }
};
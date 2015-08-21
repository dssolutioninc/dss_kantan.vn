/**
 * Japtool/testController
 *
 * @description :: Server-side logic for managing japtool/tests
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    index: function (req, res) {
        var condition = req.param('condition');
        Article.getLessonArticle({condition: condition}, function (err, articles) {
            res.render('japtool/learning/learnArticle',
                {
                    data: articles
                }
            );
        })
    },
    previewTest : function(req,res) {
        var condition = req.param('condition');
        Article.getLessonArticle({condition: condition}, function (err, articles) {
            res.render('japtool/learning/previewTestArticle',
                {
                    articles: articles
                }
            );
        })
    },
    _config: {
        locals: {
            layout: 'layout/layout-japtool'
        }
    }
};


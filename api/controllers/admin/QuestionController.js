/**
 * Created by DuongTD2 on 6/30/2015.
 */
/**
 * QuestionController
 *
 * @description :: Server-side logic for managing Questions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    create: function (req, res) {
        //get value parameters of input view
        var articleID = req.param('articleID');
        var question = req.param('question');
        var option1 = req.param('option1');
        var resultOption1 = req.param('resultOption1');
        var option2 = req.param('option2');
        var resultOption2 = req.param('resultOption2');
        var option3 = req.param('option3');
        var resultOption3 = req.param('resultOption3');
        var option4 = req.param('option4');
        var resultOption4 = req.param('resultOption4');
        var sort = null;
        // upload files and get FD
        // Up load Image
        FileAction.upload('img', req, function (err, imgUpload) {
            if (err) {
                return res.negotiate(err);
            }
            else {
                var fdImage = null;
                // get "file description"
                // test length of byte , if they're available , will pass file description to variable : image
                if (imgUpload.length != 0) fdImage = imgUpload[0].fd;
                // create question object

                // count and pass sort variable
                Question.count().exec(function(err, cnt) {
                    if (err) res.send(err);
                    else {
                        sort = cnt + 1;
                    }
                    if (fdImage != null) { // if user upload image
                        Question.create(
                            {
                                articleID: articleID,
                                question: question,
                                sort:sort,
                                option1: option1,
                                resultOption1: resultOption1,
                                option2: option2,
                                resultOption2: resultOption2,
                                option3: option3,
                                resultOption3: resultOption3,
                                option4: option4,
                                resultOption4: resultOption4,
                                image: fdImage
                            }).exec(function articleCreated(err, question) {
                                console.log("Da nhay vao Upload img");
                                //sails.log(Article);
                                //If there's an error
                                if (err) {
                                    sails.log(err)
                                }
                                else {
                                    //affter successfuly creating the user
                                    //redirect to the show action
                                    res.redirect('/displayQuestionCT/' + question.id);
                                }
                            });
                    } else {
                        // if User don't upload Image
                        Question.create(
                            {
                                articleID: articleID,
                                question: question,
                                sort:sort,
                                option1: option1,
                                resultOption1: resultOption1,
                                option2: option2,
                                resultOption2: resultOption2,
                                option3: option3,
                                resultOption3: resultOption3,
                                option4: option4,
                                resultOption4: resultOption4
                            }).exec(function articleCreated(err, question) {
                                //If there's an error
                                console.log("Da nhay vao add thuong");
                                if (err) {
                                    req.session.flash = {
                                        err: err
                                    }
                                    return res.send(err);
                                } else {
                                    //affter successfuly creating the user
                                    //redirect to the show action
                                    console.log("Add question thanh cong");
                                    res.redirect('/displayQuestionCT/' + question.id);
                                }
                            });
                    }
                })

            }
        });
    },

    showQuestion: function (req, res) {
        var id = req.param('id');
        Question.findOne({id: id}).exec(function findOneCB(err, foundQuestion) {
            Article.findOne({id: foundQuestion.articleID}).exec(function foundArticles(err, foundArt) {
                if (err) {
                    res.send(err);
                }
                res.view('admin/question/detailsQuestion', {
                    ArticleSubject:foundArt.subject,
                    Question: foundQuestion,
                    layout:'layout/layout-admin'
                });
            });
        });
    },

    showAll: function (req, res, next) {
        Question.find(function foundQuestion(err, questions) {
            // get a list of Article's Subject
            Article.find(function foundArticles(err, Articles) {
                if (err) {
                    res.send(err);
                }
                res.view(
                    'admin/question/DisplayAllQuestion',
                    {
                        questions: questions,
                        Articles:Articles,
                        layout:'layout/layout-admin'
                    }
                );
            });
        });
    },
    delete: function (req, res) {
        var id = req.param('id');
        Question.findOne({id: id}).exec(function findOneQue(err, foundQue) {
            var image = foundQue.image;
            Question.destroy({id: id}).exec(function deleteCB(err, question) {
                if (err) {
                    sails.log(err)
                } else {
                    if (image != null) {
                        var skipperAdapter = common.skipperAdapter('files');
                        skipperAdapter.rm(image, function (err) {
                            if (err) sails.log(err);
                            else {
                                sails.log('image has been deleted!');
                            }
                        })
                    }
                    res.redirect('/showAllQuestion');
                }
            });
        });
    },
    update: function (req, res) {
        //get value parameters of input view
        var id = req.param('id');
        var articleID = req.param('articleID');
        var question = req.param('question');
        var option1 = req.param('option1');
        var resultOption1 = req.param('resultOption1');
        var option2 = req.param('option2');
        var resultOption2 = req.param('resultOption2');
        var option3 = req.param('option3');
        var resultOption3 = req.param('resultOption3');
        var option4 = req.param('option4');
        var resultOption4 = req.param('resultOption4');
        var isImgQueChange = req.param('isImgQueChange');
        console.log(isImgQueChange);
        FileAction.upload('img', req, function (err, imgUpload) {
            if (err) {
                return res.negotiate(err);
            }
            else {
                console.log("Upload image");
                console.log(id);
                var fdImage = null;
                // get "file description"
                // test length of byte , if they're available , will pass file description to variable :image
                if (imgUpload.length != 0) fdImage = imgUpload[0].fd;
                // delete media exist
                Question.findOne({id: id}).exec(function findOneCB(err, foundQue) {
                    if (foundQue.image != null) {
                        var image = foundQue.image;
                    }
                    if (err) {
                        sails.log(err)
                    } else {
                        if(isImgQueChange=="yes") {
                            if (image != null) {
                                var skipperAdapter = common.skipperAdapter('img');
                                skipperAdapter.rm(image, function (err) {
                                    if (err) sails.log(err);
                                    else {
                                        sails.log('image has been deleted to Update question');
                                    }
                                })
                            }
                        }
                    }
                });
                // update article object
                if (fdImage != null) { // if user upload image
                    Question.update({id: id}, {
                        articleID: articleID,
                        question: question,
                        option1: option1,
                        resultOption1: resultOption1,
                        option2: option2,
                        resultOption2: resultOption2,
                        option3: option3,
                        resultOption3: resultOption3,
                        option4: option4,
                        resultOption4: resultOption4,
                        image: fdImage
                    }).exec(function afterwards(err) {
                        if (err) {
                            return res.send(err);
                        } else {
                            res.redirect('/showAllQuestion');
                        }
                    });
                } else {
                    // if User don't upload Image
                    Question.update({id: id}, {
                        articleID: articleID,
                        question: question,
                        option1: option1,
                        resultOption1: resultOption1,
                        option2: option2,
                        resultOption2: resultOption2,
                        option3: option3,
                        resultOption3: resultOption3,
                        option4: option4,
                        resultOption4: resultOption4
                    }).exec(function afterwards(err) {
                        if (err) {
                            return res.send(err);
                        } else {
                            res.redirect('/showAllQuestion');
                        }
                    });
                }
            }
        });
    },
    editQue: function (req, res) {
        //var id = req.param('id');
        var id = req.param("id");
        console.log(req.param('id'));
        Question.findOne({id: id}).exec(function findOneQue(err, foundQue) {
            if (err) {
                res.send(err);
            }
            Article.find(function foundArticles(err, Articles) {
                if (err) {
                    res.send(err);
                }
                sails.log("Edit no error");
                res.view('admin/question/editQuestion', {
                    question: foundQue,
                    articles: Articles,
                    layout:'layout/layout-admin'
                });
            });
        });
    },
    pointToAddQue: function (req, res) {
        Article.find(function foundAr(err, Articles) {
            if (err) {
                res.send(err);
            }
            res.view('admin/question/addQuestion',
                {
                    layout:'layout/layout-admin',
                    articles: Articles
                }
            );
        });
    }
};


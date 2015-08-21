/**
 * ArticleController
 *
 * @description :: Server-side logic for managing articles
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    create: function (req, res) {
        //get value parameters of input view
        var subject = req.param('subject');
        var content = req.param('content');
        var explaination = req.param('explaination');
        var translation = req.param('translation');
        var level = req.param('level');
        var tag = req.param('tag');
        var category = req.param('category');
        var sort=null;
        // upload files and get FD
        // Up load Image
        FileAction.upload('video', req, function(err, videoUpload) {
            if (err) {
                return res.negotiate(err);
            }
            else {
                FileAction.upload('audio', req, function(err, audioUpload) {
                    if (err) {
                        return res.negotiate(err);
                    } else {
                        FileAction.upload('img', req, function(err, imgUploaded) {
                            if (err) {
                                return res.negotiate(err);
                            } else {
                                var fdImage = null;
                                var fdAudio = null;
                                var fdVideo = null;
                                // get "file description"
                                // test length of byte , if they're available , will pass file description to variable : audio ,image,video
                                if (audioUpload.length != 0) fdAudio = audioUpload[0].fd;
                                if (videoUpload.length != 0) fdVideo = videoUpload[0].fd;
                                if (imgUploaded.length != 0) fdImage = imgUploaded[0].fd;
                                // create article object

                                //pass sort variable
                                Article.count().exec(function(err, cnt){
                                    if(err) res.send(err);
                                    else{
                                        sort = cnt + 1;
                                    }
                                    //create object
                                    if (fdVideo != null || fdAudio != null || fdImage != null) { // if user upload image
                                        Article.create(
                                            {
                                                subject: subject,
                                                content: content,
                                                explaination: explaination,
                                                translation: translation,
                                                level: level,
                                                tag: tag,
                                                category: category,
                                                video: fdVideo,
                                                audio: fdAudio,
                                                image: fdImage

                                            }).exec(function articleCreated(err, Article) {
                                                sails.log('videos', videoUpload);
                                                sails.log('audio', audioUpload);
                                                sails.log('image', imgUploaded);
                                                console.log("Da nhay vao Upload hai thang");
                                                //sails.log(Article);
                                                //If there's an error
                                                if (err) {
                                                    sails.log(err)
                                                }
                                                else {
                                                    //affter successfuly creating the user
                                                    //redirect to the show action
                                                    res.redirect('/displayArticleCT/' + Article.id);
                                                }
                                            });
                                    } else {
                                        // if User don't upload Image
                                        Article.create(
                                            {
                                                subject: subject,
                                                content: content,
                                                explaination: explaination,
                                                translation: translation,
                                                level: level,
                                                tag: tag,
                                                category: category
                                            }).exec(function articleCreated(err, Article) {
                                                //If there's an error
                                                console.log("Da nhay vao Upload thuong");
                                                if (err) {
                                                    req.session.flash = {
                                                        err: err
                                                    }
                                                    return res.send(err);
                                                } else {
                                                    //affter successfuly creating the user
                                                    //redirect to the show action
                                                    res.redirect('/displayArticleCT/' + Article.id);
                                                }
                                            });
                                    }
                                })

                            }
                        });
                    }
                });
            }
        });
    },

    delete: function (req, res) {
        var id = req.param('id');
        Article.findOne({id: id}).exec(function findOneAr(err, foundAr) {
            if(foundAr.image!=null) {
                var image = foundAr.image;
            }
            if(foundAr.audio!=null) {
                var audio = foundAr.audio;
            }
            if(foundAr.video!=null) {
                var video = foundAr.video;
            }
            Article.destroy({id: id}).exec(function deleteCB(err, article) {

                //delete all question of Article
                console.log("Article ID delete is "+id);
                Question.destroy({articleID: id}).exec(function deleteCB(err, deletedQue) {
                    if(err){
                        res.send(err);
                    } else {
                        console.log("deleted : " +deletedQue);
                    }
                });

                // delete media of Article
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
                    if (audio != null) {
                        var skipperAdapter = common.skipperAdapter('files');
                        skipperAdapter.rm(audio, function (err) {
                            if (err) sails.log(err);
                            else {
                                sails.log('audio has been deleted!');
                            }
                        })
                    }
                    if (video != null) {
                        var skipperAdapter = common.skipperAdapter('files');
                        skipperAdapter.rm(video, function (err) {
                            if (err) sails.log(err);
                            else {
                                sails.log('video has been deleted!');
                            }
                        })
                    }
                    res.redirect('/showAllArticle');
                }
            });
        });
    },
    showAll: function (req, res, next) {

        Article.find(function foundProduct(err, articles) {
            if (err) {
                return next(err);
            }
            res.view(
                'admin/article/DisplayAllArticle',
                {
                    articles: articles,
                    layout: 'layout/layout-admin'
                }
            );
        });
    },
    editAr: function (req, res) {
        //var id = req.param('id');
        var id = req.param("id");
        console.log(req.param('id'));
        Article.findOne({id: id}).exec(function findOneAr(err, foundAr) {
            if (err) {
                res.send(err);
            }
            sails.log("Edit no error");
            res.view('admin/article/editArticle', {
                Article: foundAr,
                layout:'layout/layout-admin'
            });
        });
    },
    update: function (req, res) {
        //get value parameters of input view
        var id = req.param('id');
        var subject = req.param('subject');
        var content = req.param('content');
        var explaination = req.param('explaination');
        var translation = req.param('translation');
        var level = req.param('level');
        var tag = req.param('tag');
        var category = req.param('category');
        var isVideoChange = req.param('isVideoChange');
        var isAudioChange = req.param('isAudioChange');
        var isImgChange = req.param('isImgChange');
        FileAction.upload('video', req, function(err, videoUpload) {
            if (err) {
                return res.negotiate(err);
            }
            else {
                console.log("Upload video");
                FileAction.upload('audio', req, function(err, audioUpload) {
                    if (err) {
                        return res.negotiate(err);
                    } else {
                        console.log("Upload audio");
                        FileAction.upload('img', req, function(err, imgUploaded) {
                            if (err) {
                                return res.negotiate(err);
                            } else {
                                console.log("Upload image");
                                var fdImage = null;
                                var fdAudio = null;
                                var fdVideo = null;
                                // get "file description"
                                // test length of byte , if they're available , will pass file description to variable : audio ,image,video
                                if (audioUpload.length != 0) fdAudio = audioUpload[0].fd;
                                if (videoUpload.length != 0) fdVideo = videoUpload[0].fd;
                                if (imgUploaded.length != 0) fdImage = imgUploaded[0].fd;
                                console.log(fdAudio);
                                console.log(fdVideo);
                                console.log(fdImage);

                                // delete media exist
                                Article.findOne({id: id}).exec(function findOneAr(err, foundAr) {
                                    var image = foundAr.image;
                                    var audio = foundAr.audio;
                                    var video = foundAr.video;
                                    if (err) {
                                        sails.log(err)
                                    } else {
                                        if (isImgChange=="yes") {
                                            if (image != null) {
                                                var skipperAdapter = common.skipperAdapter('files');
                                                skipperAdapter.rm(image, function (err) {
                                                    if (err) sails.log(err);
                                                    else {
                                                        sails.log('image has been deleted to Update');
                                                    }
                                                })
                                            }
                                        }
                                        if(isAudioChange=="yes"){
                                            if (audio != null) {
                                                var skipperAdapter = common.skipperAdapter('files');
                                                skipperAdapter.rm(audio, function (err) {
                                                    if (err) sails.log(err);
                                                    else {
                                                        sails.log('audio has been deleted to Update');
                                                    }
                                                })
                                            }
                                        }
                                        if(isVideoChange=="yes") {
                                            if (video != null) {
                                                var skipperAdapter = common.skipperAdapter('files');
                                                skipperAdapter.rm(video, function (err) {
                                                    if (err) sails.log(err);
                                                    else {
                                                        sails.log('video has been deleted to Update');
                                                    }
                                                })
                                            }
                                        }
                                    }
                                });
                                // update media before
                                if (fdVideo!=null && isVideoChange=="yes") {
                                    Article.update({id: id}, {
                                        video: fdVideo
                                    }).exec(function afterwards(err) {
                                        if (err) {
                                            return res.send(err);
                                        }
                                    });
                                }
                                if (fdAudio!=null && isAudioChange=="yes") {
                                    Article.update({id: id}, {
                                        audio: fdAudio
                                    }).exec(function afterwards(err) {
                                        if (err) {
                                            return res.send(err);
                                        }
                                    });
                                }
                                if (fdImage!=null && isImgChange=="yes") {
                                    Article.update({id: id}, {
                                        image: fdImage
                                    }).exec(function afterwards(err) {
                                        if (err) {
                                            return res.send(err);
                                        }
                                    });
                                }
                                // update article object
                                Article.update({id: id}, {
                                    subject: subject,
                                    content: content,
                                    explaination: explaination,
                                    translation: translation,
                                    level: level,
                                    tag: tag,
                                    category: category
                                }).exec(function afterwards(err , updated) {
                                    if (err) {
                                        return res.send(err);
                                    } else {
                                        res.redirect('/showAllArticle');
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    },
    showArticle: function (req, res) {
        var id = req.param('id');
        Article.findOne({id: id}).exec(function findOneCB(err, foundArticle) {
            if (err) {
                res.send(err);
            }
            res.view('admin/article/detailsArticle' , {
                Article: foundArticle,
                layout:'layout/layout-admin'
            });
        });
    },

    showToLearn:function (req,res) {
        Article.find(function foundProduct(err, articles) {
            if (err) {
                return res.send(err);
            }
            res.view(
                'japtool/learning/showArticleToLearn',
                {
                    articles: articles,
                    layout: 'layout/layout-japtool'
                }
            );
        });
    },
    doTest:function (req,res){
        var id = req.param('id');
        Article.findOne({id:id}).exec(function found(err,foudAr){
            if (err) {
                res.send(err);
            }
            Question.find({articleID:foudAr.id}).exec(function foundAllQue(err,questions){
                if(err){
                    res.send(err);
                }
                res.view('japtool/learning/doTestArticle',
                    {
                        article:foudAr,
                        questions:questions,
                        layout:'layout/layout-japtool'
                    }
                );
            });
        });
    }
    //
    //getObject:function(req,res){
    //    var articleID = req.param('articleID');
    //    Question.find({articleID:articleID}).exec(function foundQue(err,questions){
    //        if(err){
    //            res.send(500);
    //        }
    //        else{
    //            res.send(questions);
    //        }
    //    });
    //}

};

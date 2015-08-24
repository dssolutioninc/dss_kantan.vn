/**
 * Created by TuyenTV1 on 6/22/2015.
 */
module.exports = {
    _config: {
        locals: {
            layout: 'layout/layout-japtool'
        }
    },
//This loads index.ejs
    index: function (req, res) {
        userId = req.session.User.id;
        SelfLearning.find({
            where: {user: userId},
            limit: Constants.bookNumOnHome,
            sort: {finishDate: 0, startDate: 0}
        }).populate('bookMaster').exec(function (err, learnings) {
            if (err) {
                if (err) return res.serverError(err);
            } else {

                var listLearnings = [];
                learnings.forEach(function (learning){
                    Database.learningSumary(
                        {
                            userID: req.session.User.id,
                            id: learning.id,
                            bookID: learning.bookMaster.id
                        }, 
                        function(err, sumary){
                            learning.passedNum = sumary.passedNum;
                            learning.fasledNum = sumary.fasledNum;

                            listLearnings.push(learning);

                            console.log('learning.passedNum: ' +  learning.passedNum);
                            console.log('learning.fasledNum: ' +  learning.fasledNum);


                        });
                    

                });







                res.view('japtool/home/home', {listLearnings: learnings});

            }
        })

    },
    loadSumary: function (req, res) {

    },
    lessonHome: function (req, res) {
        var bookMasterId = req.param('bookMasterId');
        var selfLearningId = req.param('selfLesson');
        var moreSelfLearningId = req.param('moreSelfLesson');
        BookDetail.find({
            bookMaster: bookMasterId,
            sort: 'sort ASC'

        }).exec(function (err, listItems) {
            if (err) {
                console.log(err);
            } else {
                if(!moreSelfLearningId || moreSelfLearningId == undefined) {
                    var lessonList = [];
                    UserLearnHistory.find({selfLearning: selfLearningId}).exec(function (err, selfLesson) {
                        if (err) {
                            console.log(err);
                        } else {

                                listItems.forEach(function (lesson) {
                                    selfLesson.forEach(function (learnedItem) {
                                        if (lesson.id == learnedItem.bookDetail) {
                                            lesson.learnHistory = learnedItem;
                                            return false;
                                        } else {
                                            return true;
                                        }

                                    });
                                    lessonList.push(lesson);

                                });

                            res.render('japtool/home/lessonHome', {
                                lessonList: lessonList,
                                selfLesson: selfLesson,
                                selfLearningId:selfLearningId
                            });

                        }
                    })
                }else{
                    UserLearnHistory.find({selfLearning: moreSelfLearningId}).exec(function (err, selfLesson) {
                        if (err) {
                            console.log(err);
                        } else {
                            var lessonList = [];
                            listItems.forEach(function (lesson) {
                                selfLesson.forEach(function (learnedItem) {
                                    if (lesson.id == learnedItem.bookDetail) {
                                        lesson.learnHistory = learnedItem;
                                        return false;
                                    } else {
                                        return true;
                                    }

                                });
                                lessonList.push(lesson);
                            });
                            res.render('japtool/home/limitLessonHome', {
                                lessonList: lessonList,
                                moreSelfLesson: selfLesson,
                                moreSelfLearningId:moreSelfLearningId
                            });

                        }
                    })
                }
            }
        })
    },
    loadMoreIndex: function (req, res) {
        userId = req.session.User.id;
        var start = parseInt(req.param('start'));
        SelfLearning.find({
            where: {user: userId},
            limit: Constants.bookNumOnHomeMore,
            skip: start,
            sort: {finishDate: 0, startDate: 0}
        }).populate('bookMaster').exec(function (err, listLessons) {
            if (err) {
                if (err) return res.serverError(err);
            } else {

                if(listLessons.length == '' || listLessons.length == null){
                    res.ok();
                }else{
                    res.render('japtool/home/limitLesson', {
                        loadMorelistLessons: listLessons
                    });
                }

                //if (listLessons.length > 0) {
                //    res.render('japtool/home/limitLesson', {
                //        loadMorelistLessons: listLessons
                //    });
                //} else {
                //    res.send(null);
                //}
            }
        })

    }
}

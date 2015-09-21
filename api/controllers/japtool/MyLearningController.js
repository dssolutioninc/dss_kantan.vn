/**
 * Created by Dulv on 6/29/2015.
 */
module.exports = {
    _config: {
        locals: {
            layout: 'layout/layout-japtool'
        }
    },
   
    index: function (req, res) {
        if (!req.session.loadBookNum) {
            req.session.loadBookNum = Constants.bookNumOnHome;
        }

        SelfLearning.count({where: {user: req.session.user.id}}).exec(function (err, count) {
            req.session.learningCount = count;

            var noMore = false;
            if (count <= req.session.loadBookNum) {
                req.session.loadBookNum = count;
                noMore = true;
            }
            SelfLearning.find({
                where: {user: req.session.user.id},
                limit: req.session.loadBookNum,
                sort: {finishDate: 0, startDate: 0}
            }).populate('bookMaster').exec(function (err, learnings) {
                if (err) {
                    if (err) return res.serverError(err);
                } else {
                    res.view('japtool/myLearning/index',
                        {listLearnings: learnings, noMore: noMore});
                }
            })
        })
    },

    loadMore: function (req, res) {
       SelfLearning.find({
           where: {user: req.session.user.id},
           limit: Constants.bookNumOnHomeMore,
           skip: req.session.loadBookNum,
           sort: {finishDate: 0, startDate: 0}
       }).populate('bookMaster').exec(function (err, learnings) {
           if (err) {
               if (err) return res.serverError(err);
           } else {
    
               if(learnings.length == '' || learnings.length == null){
                   res.ok();
               }else{
                   req.session.loadBookNum += learnings.length;
                   var noMore = (req.session.loadBookNum == req.session.learningCount);
    
                   res.render('japtool/myLearning/loadMore', {
                       listLearnings: learnings, noMore: noMore
                   });
               }
           }
       })
    },

    learningDetail: function (req, res) {
        var learningID = req.param('learningID');
        var bookID = req.param('bookID');

        BookDetail.find({
            bookMaster: bookID,
            sort: 'sort ASC'
        }).exec(function (err, listItems) {
            if (err) { 
                sails.log(err); 
            }
            else {
                var lessonList = [];

                UserLearnHistory.find({selfLearning: learningID}).exec(function (err, selfLesson) {
                    if (err) { 
                        sails.log(err); 
                    }
                    else {
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

                        res.render('japtool/myLearning/learningDetail', {
                            lessonList: lessonList,
                            selfLesson: selfLesson,
                            learningID: learningID
                        });
                    }
                })
            }
        })
    },

    loadSumary: function (req, res) {
        // get lessons list by bookid
        BookDetail.find({where: {bookMaster: req.param('bookID')}, sort: {sort: 1}}).
            exec(function (err, lessons) {

                // get learn history of these lessons
                UserLearnHistory.find({
                    where: {user: req.session.user.id, selfLearning: req.param('learningID')}
                }).exec(function (err, learnedLessons) {

                    // console.log('learnedLessons: ' + JSON.stringify(learnedLessons));
                    var lessonList = [];

                    lessons.forEach(function (lesson) {

                        var learnedInfo = learnedLessons.filter(function (learnedLesson) {
                            return learnedLesson.bookDetail == lesson.id;
                        });

                        if (learnedInfo.length > 0) {
                            lesson.learnedInfo = learnedInfo[0];
                        }

                        // console.log('lesson.learnedInfo: ' + JSON.stringify(lesson.learnedInfo));
                        lessonList.push(lesson);
                    });

                    var passedNum = 0;
                    var fasledNum = 0;
                    var lessonName = "";

                    for (var i = 0; i < lessonList.length; ++i) {
                        if (lessonName == lessonList[i].lesson) {
                            // console.log('lessonName == lessonList[i].lesson' );

                        } else {
                            // console.log('lessonName != lessonList[i].lesson' );
                            lessonName = lessonList[i].lesson;

                            var subLessons = lessonList.filter(function (les) {
                                return les.lesson == lessonName;
                            });
                            // console.log('subLessons.length: ' +  subLessons.length);

                            var allPass = true;
                            var hasHistory = false;
                            subLessons.forEach(function (subLesson) {
                                if (!subLesson.learnedInfo) {
                                    allPass = false;
                                } else {
                                    hasHistory = true;

                                    // console.log('subLesson.learnedInfo.mark: ' +  subLesson.learnedInfo.mark);
                                    if (!subLesson.learnedInfo.mark || subLesson.learnedInfo.mark < Constants.passMark) {
                                        allPass = false;
                                    }
                                }
                            });

                            if (allPass) {
                                passedNum += 1;
                            } else if (hasHistory) {
                                fasledNum += 1;
                            }
                        }
                    }


                    var bookMasterLessonNum = req.param('bookMasterLessonNum');
                    var startDate = new Date(req.param('startDate'));
                    var finishDate = new Date(req.param('finishDate'));
                    //recommend book each day
                    var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
                    var TotalDays = Math.round(Math.abs((finishDate.getTime() - startDate.getTime()) / (oneDay)));
                    var eachDayLesson = Math.ceil(bookMasterLessonNum / TotalDays);
                    // status learning
                    // percent of current day on total day
                    var now = new Date();
                    var percentDay = 0;
                    if(now.getTime() >= startDate.getTime()){
                        percentDay = Math.round(Math.abs((now.getTime() - startDate.getTime()) / (oneDay))) / TotalDays;
                    }
                    //percent of passed lesson on total lesson
                    var percentLesson = passedNum / bookMasterLessonNum;
                    var rs = percentLesson - percentDay;
                    // get status learning
                    var statusLearning;
                    if (rs >= 0 && rs < 0.2) {
                        statusLearning = req.__("you catch up time's learning");
                    } else if (rs > 0.2) {
                        statusLearning = req.__("you learn fast");
                    } else if (rs < 0) {
                        statusLearning = req.__("you learn slowly");
                    }
                    res.send({
                        passedNum: passedNum,
                        fasledNum: fasledNum,
                        eachDayLesson: eachDayLesson,
                        percentDay: percentDay * 100,
                        statusLearning: statusLearning
                    });
                });
            })
    },
}
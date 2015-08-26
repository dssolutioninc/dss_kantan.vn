/**
 * Created by TuyenTV1 on 6/22/2015.
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

        SelfLearning.find({
            where: {user: req.session.User.id},
            limit: req.session.loadBookNum,
            sort: {finishDate: 0, startDate: 0}
        }).populate('bookMaster').exec(function (err, learnings) {
            if (err) {
                if (err) return res.serverError(err);
            } else {
                var noMore = false;
                if (learnings.length < req.session.loadBookNum){
                    noMore = true;
                    req.session.loadBookNum = learnings.length;
                }

                res.view('japtool/home/index', {listLearnings: learnings, noMore: noMore});
            }
        })

    },

    loadMore: function (req, res) {
        // userId = req.session.User.id;
        // var start = parseInt(req.param('start'));
        SelfLearning.find({
            where: {user: req.session.User.id},
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
                    var noMore = (learnings.length < Constants.bookNumOnHomeMore);

                    res.render('japtool/home/loadMore', {
                        listLearnings: learnings, noMore: noMore
                    });
                }
            }
        })
    },

    loadSumary: function (req, res) {
        // get lessons list by bookid
        BookDetail.find({where: {bookMaster: req.param('bookID')}, sort: {sort: 1} }).
        exec(function(err, lessons){

            // get learn history of these lessons
            UserLearnHistory.find({where: {user: req.session.User.id, selfLearning: req.param('learningID')}
            }).exec(function(err, learnedLessons){

                // console.log('learnedLessons: ' + JSON.stringify(learnedLessons));
                var lessonList = [];

                lessons.forEach(function(lesson){

                    var learnedInfo = learnedLessons.filter(function(learnedLesson){
                        return learnedLesson.bookDetail == lesson.id;
                    });

                    if (learnedInfo.length > 0){
                        lesson.learnedInfo = learnedInfo[0];
                    }

                    // console.log('lesson.learnedInfo: ' + JSON.stringify(lesson.learnedInfo));
                    lessonList.push(lesson);
                });

                var passedNum = 0;
                var fasledNum = 0;
                var lessonName = "";

                for (var i = 0; i < lessonList.length; ++i){
                    if ( lessonName == lessonList[i].lesson){
                        // console.log('lessonName == lessonList[i].lesson' );

                    } else {
                        // console.log('lessonName != lessonList[i].lesson' );
                        lessonName = lessonList[i].lesson;

                        var subLessons = lessonList.filter(function(les){
                            return les.lesson == lessonName;
                        });
                        // console.log('subLessons.length: ' +  subLessons.length);

                        var allPass = true;
                        var hasHistory = false;
                        subLessons.forEach(function(subLesson){
                            if (!subLesson.learnedInfo){
                                allPass = false;
                            } else {
                                hasHistory = true;

                                // console.log('subLesson.learnedInfo.mark: ' +  subLesson.learnedInfo.mark);
                                if (!subLesson.learnedInfo.mark || subLesson.learnedInfo.mark < Constants.passMark){
                                    allPass = false;
                                }
                            }
                        });

                        if (allPass){
                            passedNum += 1;
                        } else if (hasHistory) {
                            fasledNum += 1;
                        }
                    }
                }

                res.send({passedNum: passedNum, fasledNum: fasledNum});
            });
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
                console.log(err);
            } else {
                var lessonList = [];
                
                UserLearnHistory.find({selfLearning: learningID}).exec(function (err, selfLesson) {
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

                        res.render('japtool/home/learningDetail', {
                            lessonList: lessonList,
                            selfLesson: selfLesson,
                            learningID:learningID
                        });

                    }
                })
            }
        })
    },

    
}

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
        }).populate('bookMaster').exec(function (err, listLearnings) {
            if (err) {
                if (err) return res.serverError(err);
            } else {

                // listLearnings.forEach(function (learning){
                //     BookDetail.find({bookMaster: learning.bookMaster.id}).sort({sort: 'sort ASC'}).
                //     exec(function(err, lessons){

                //         UserLearnHistory.find({
                //             user: req.session.User.id,
                //             selfLearning: learning.id
                //         }).exec(function(err, learnedLessons){

                //             var lessonList = [];

                //             lessons.forEach(function(lesson){
                //                 lesson.learnedInfo = learnedLessons.filter(function(learnedLesson){
                //                     return learnedLesson.bookDetail == lesson.id;
                //                 });

                //                 lessonList.push(lesson);
                //             });

                //             var passedNum = 0;
                //             var fasledNum = 0;
                //             var allPass = true;

                //             for (var i = 0; i < lessonList.length; ++i){



                //             }

                //         });
                        
                //     })

                // });

                // BookMaster.findOne({id: bookID}).populate('bookDetails', {sort: 'sort ASC'}).
                // exec(function createCB(err, book) {
                //     if (err) { sails.log(err) }
                //     else {
                //         var bookDetails = book.bookDetails;

                //         var lessonList = [];

                //         UserLearnHistory.find({selfLearning: learnID, sort: 'updatedAt DESC'}).
                //         exec(function (err, learnedLessions){
                //             if (err) { sails.log(err) }
                //             else {
                //                  bookDetails.forEach(function (lession) {

                //                     learnedLessions.forEach(function (learnedItem) {
                //                         if (lession.id == learnedItem.bookDetail) {
                //                             lession.learnHistory = learnedItem;
                //                             return false;
                //                         } 
                //                         else { 
                //                             return true;
                //                         }
                //                     });

                //                     lessonList.push(lession);
                //                 });
                //             }
                //             // console.log('req.param(lessonID): ' + lessonID);

                //             if (!lessonID) {
                //                 if (learnedLessions[0]) { lessonID = learnedLessions[0].bookDetail; }
                //                 // console.log('learnedLessions[0].bookDetail: ' + lessonID);
                //             }
                //             //console.log('book: ' + JSON.stringify(book));
                //             //console.log('lessonList: ' + JSON.stringify(lessonList));

                //             res.view('japtool/learning/show-book-detail', {
                //                 learnID: learnID,
                //                 book: book,
                //                 lessonList: lessonList,
                //                 goLessonID: lessonID
                //             });
                //         });
                //     }
                // });






                res.view('japtool/home/home', {listLearnings: listLearnings});

            }
        })

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

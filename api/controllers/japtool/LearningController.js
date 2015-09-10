/**
 * Created by NamMH on 6/29/2015.
 */
module.exports = {
    _config: {
        locals: {
            layout: 'layout/layout-japtool'
        }
    },
    /**
     * GET: japtool/learning/create
     * @param req
     * @param res
     */
    create: function (req, res) {
        var bookid = req.param('bookid');
        var userId = req.session.user.id;
        var create = null;
        SelfLearning.findOne({
            user: userId,
            bookMaster: bookid
        }).populate('bookMaster', {sort: 'startDate'}).exec(function (err, learning) {
            if (err) {

            }
            else if (learning == undefined) {
                BookMaster.findOne({id: bookid}).exec(function (err, books) {
                    if (err) {

                    }
                    else {
                        res.render('japtool/learning/create', {
                            create: create,
                            book: books
                        });
                    }
                })
            }
            else {
                var now = new Date();
                var finish = learning.finishDate;
                finish.setHours(23, 59, 59);
                if (finish < now) {
                    var msg = 2;
                    res.render('japtool/learning/mesage', {
                        learning: learning,
                        msg: msg
                    });
                }
                else {
                    res.send("/japtool/Learning/practice/?id=" + learning.bookMaster.id + "&learnID=" + learning.id);
                }
            }

        })
    },
    checkLearning: function (req, res) {

        var learnId = req.param('learnID');
        SelfLearning.findOne({
            id: learnId
        }).populate('bookMaster', {sort: 'startDate'}).exec(function (err, learning) {
            if (err) {

            }
            else {
                var now = new Date();
                var finish = learning.finishDate;
                finish.setHours(23, 59, 59);
                if (finish < now) {
                    var msg = 2;
                    res.render('japtool/learning/mesage', {
                        learning: learning,
                        msg: msg
                    });
                }
                else {
                    res.send("/japtool/Learning/practice/?id=" + learning.bookMaster.id + "&learnID=" + learning.id);
                }
            }
        })
    },
    edit: function (req, res) {
        var id = req.param("id");
        var format = require('date-format');
        var stringFinishDate = format.asString('dd-MM-yyyy', new Date(req.param('finishDate')));
        var finishDate = req.param("finishDate");
        var notes = req.param("notes");
        SelfLearning.update({id: id}, {
            notes: notes,
            finishDate: finishDate,
            stringFinishDate: stringFinishDate
        }).exec(function (err, ok) {
            if (err) {

            }
            else {
                res.redirect('japtool/learning/');
            }
        })
    },
    loadEditForm: function (req, res) {
        var id = req.param("id");
        SelfLearning.findOne({id: id}).populate('bookMaster', {sort: 'startDate'}).exec(function (err, learning) {
            if (err) {

            }
            else {
                var startdate = learning.stringStartDate.split("-");
                learning.stringStartDate = "" + startdate[2] + "-" + startdate[1] + "-" + startdate[0] + "";
                var finishdate = learning.stringFinishDate.split("-");
                learning.stringFinishDate = "" + finishdate[2] + "-" + finishdate[1] + "-" + finishdate[0] + "";
                res.render('japtool/learning/edit', {
                    learning: learning
                });
            }

        })

    },
    add: function (req, res) {

        try {
            var lbr = req.param('lbr');
            var userId = req.session.user.id;
            var notes = req.param('notes');
            var bookMaster = req.param('bookMaster');
            var startDatepr = req.param('startDate');
            var finishDatepr = req.param('finishDate');
            var format = require('date-format');
            var stringStartDate = format.asString('dd-MM-yyyy', new Date(req.param('startDate')));
            var stringFinishDate = format.asString('dd-MM-yyyy', new Date(req.param('finishDate')));
            if (!lbr) {

                SelfLearning.findOne({
                    user: userId,
                    bookMaster: bookMaster
                }).populate('bookMaster', {sort: 'startDate'}).exec(function (err, learning) {
                    if (err) {

                    }
                    if (!learning) {
                        SelfLearning.create({
                            notes: notes,
                            startDate: startDatepr,
                            finishDate: finishDatepr,
                            stringStartDate: stringStartDate,
                            stringFinishDate: stringFinishDate,
                            bookMaster: bookMaster,
                            user: userId
                        }).exec(function (err, selfLearning) {
                            if (err) {
                                return res.json({err: err});
                            }
                            if (!selfLearning) {
                                return res.json({err: "Error"});
                            }
                            BookUseHistory.create({
                                userId: userId,
                                bookMaster: bookMaster,
                                startDate: startDatepr,
                                finishDate: finishDatepr,
                                selfLearning: selfLearning
                            }).exec(function (err, bookusehistory) {
                                if (err) {

                                }
                                else {
                                    res.send('japtool/learning/');
                                }
                            })

                        });
                    }
                    else {
                        var startDate = learning.startDate;
                        var finishDate = learning.finishDate;
                        var now = new Date();

                        if (finishDate > now) {
                            var create = '<h3> ' + req.__('book already') + ' <a href = "/japtool/Learning/practice/?id=<%= book.id %>" > < /a></h3 > ';
                            res.render('japtool/learning/create', {
                                create: create,
                                book: learning.bookMaster,
                                learning: learning
                            });
                        }

                        else {
                            SelfLearning.create({
                                notes: notes,
                                startDate: startDatepr,
                                finishDate: finishDatepr,
                                stringStartDate: stringStartDate,
                                stringFinishDate: stringFinishDate,
                                bookMaster: bookMaster,
                                user: userId
                            }).exec(function (err, selfLearning) {
                                if (err) {
                                    return res.json({err: err});
                                }
                                if (!selfLearning) {
                                    return res.json({err: "Error"});
                                }
                                BookUseHistory.create({
                                    userId: userId,
                                    bookMaster: bookMaster,
                                    startDate: startDatepr,
                                    finishDate: finishDatepr,
                                    selfLearning: selfLearning
                                }).exec(function (err, bookusehistory) {
                                    if (err) {

                                    }
                                    else {
                                        res.send('japtool/learning/');
                                    }
                                })

                            });
                        }
                    }
                })
            }
            else {
                SelfLearning.findOne({
                    user: userId,
                    bookMaster: bookMaster
                }).populate('bookMaster', {sort: 'startDate'}).exec(function (err, learning) {
                    if (err) {

                    }
                    else {
                        SelfLearning.create({
                            notes: notes,
                            startDate: startDatepr,
                            finishDate: finishDatepr,
                            stringStartDate: stringStartDate,
                            stringFinishDate: stringFinishDate,
                            bookMaster: bookMaster,
                            user: userId
                        }).exec(function (err, selfLearning) {
                            if (err) {
                                return res.json({err: err});
                            }
                            if (!selfLearning) {
                                return res.json({err: "Error"});
                            }
                            BookUseHistory.create({
                                userId: userId,
                                bookMaster: bookMaster,
                                startDate: startDatepr,
                                finishDate: finishDatepr,
                                selfLearning: selfLearning
                            }).exec(function (err, bookusehistory) {
                                if (err) {

                                }
                                else {
                                    res.send('japtool/learning/practice/?id=' + bookMaster);
                                }
                            })
                        });
                    }
                })
            }

        }
        catch (ex) {
            sails.log(ex);
        }
    },
    /**
     * GET: /learning/search
     * @param req
     * @param res
     */

    getBooks: function (req, res) {
        BookMaster.find()
            .sort('sort asc')
            .exec(function (err, books) {
                var arrTag = [];
                if (err) {

                }
                else {
                    books.forEach(function (item, index) {
                        arrTag.push(item.type);
                        if (index == (books.length - 1)) {
                            var array = require("array-extended");
                            var uniqueType = array(arrTag).unique().value();
                            res.render('japtool/learning/choosebook', {
                                books: books,
                                uniqueType: uniqueType
                            });
                        }
                    })
                }
            })
    },
    getItemsBooks: function (req, res) {
        var type = req.param('chooseBookCat');
        var level = req.param('level');
        if (type == "allbook") {
            if (level == 0) {
                BookMaster.find({}).exec(function (err, books) {
                    if (err) {
                        console.log(err)
                    } else {
                        res.render('japtool/learning/BookItem', {books: books, level: level});
                    }
                })
            }
            else {
                BookMaster.find({level: level}).exec(function (err, books) {
                    if (err) {
                        console.log(err)
                    } else {
                        res.render('japtool/learning/BookItem', {books: books, level: level});
                    }
                })
            }
        }
        else {
            if (level == 0) {
                BookMaster.find({type: type}).exec(function (err, books) {
                    if (err) {
                        console.log(err)
                    } else {
                        res.render('japtool/learning/BookItem', {books: books, level: level});
                    }
                })
            }
            else {
                BookMaster.find({type: type, level: level}).exec(function (err, books) {
                    if (err) {
                        console.log(err)
                    } else {
                        res.render('japtool/learning/BookItem', {books: books, level: level, level: level});
                    }
                })
            }
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
                    res.view('japtool/learning/index', {listLearnings: learnings, noMore: noMore});
                }
            })
        })
    },
    deleteLearning: function (req, res) {
        var id = req.param('id');
        SelfLearning.findOne({id: id}).exec(function (err, selfLearn) {
            if (err) {

            }
            else {
                var now = new Date();
                if (selfLearn.finishDate < now) {
                    var msg = '3';
                    res.render('japtool/learning/mesage', {
                        msg: msg
                    });
                }
                else {
                    SelfLearning.destroy({id: id}).exec(function (err, ok) {
                        if (err) {

                        }
                        else {
                            res.send('japtool/learning/');
                        }
                    })
                }
            }
        })

    },

    practice: function (req, res) {
        var bookID = req.param('id');
        var learnID = req.param('learnID');
        var lessonID = req.param('lessonID');
        var preview = req.param('preview');
        // var array = require("array-extended");

        BookMaster.findOne({id: bookID}).populate('bookDetails', {sort: 'sort ASC'}).
            exec(function createCB(err, book) {
                if (err) {
                    sails.log(err)
                }
                else {
                    var bookDetails = book.bookDetails;

                    if (preview == 'yes') {
                        res.view('japtool/learning/show-book-detail', {
                            learnID: null,
                            book: book,
                            lessonList: bookDetails,
                            goLessonID: null,
                            preview: true
                        });
                        return;
                    }

                    var lessonList = [];

                    UserLearnHistory.find({selfLearning: learnID, sort: 'updatedAt DESC'}).
                        exec(function (err, learnedLessions) {
                            if (err) {
                                sails.log(err)
                            }
                            else {
                                bookDetails.forEach(function (lession) {

                                    learnedLessions.forEach(function (learnedItem) {
                                        if (lession.id == learnedItem.bookDetail) {
                                            lession.learnHistory = learnedItem;
                                            return false;
                                        }
                                        else {
                                            return true;
                                        }
                                    });

                                    lessonList.push(lession);
                                });
                            }
                            // console.log('req.param(lessonID): ' + lessonID);

                            if (!lessonID) {
                                if (learnedLessions[0]) {
                                    lessonID = learnedLessions[0].bookDetail;
                                }
                                // console.log('learnedLessions[0].bookDetail: ' + lessonID);
                            }
                            //console.log('book: ' + JSON.stringify(book));
                            //console.log('lessonList: ' + JSON.stringify(lessonList));

                            res.view('japtool/learning/show-book-detail', {
                                learnID: learnID,
                                book: book,
                                lessonList: lessonList,
                                goLessonID: lessonID,
                                preview: false
                            });
                        });
                }
            });
    },

    saveHistory: function (req, res) {
        var pars = req.allParams();
        // console.log('pars: ' + JSON.stringify(pars));

        UserLearnHistory.findOne({
            user: req.session.user.id,
            selfLearning: pars.selfLearning,
            bookDetail: pars.bookDetail
        }).exec(function (err, data) {
            if (!data) {
                pars.user = req.session.user.id;
                pars.startDate = new Date();
                pars.status = 'started';
                pars.mark = 0;
                // console.log('pars: ' + JSON.stringify(pars));
                UserLearnHistory.create(pars).exec(function createCB(err, history) {
                    if (err) {
                        sails.log(err)
                    } else {
                        res.send(req.__('Create Learning history successful'));
                        // console.log('history: ' + JSON.stringify(history));
                    }
                })
            } else {
                if (pars.mark) {
                    pars.status = pars.mark < Constants.passMark ? "failed" : "passed";
                    pars.finishDate = new Date();

                    UserLearnHistory.update({id: data.id}, {
                        status: pars.status, mark: pars.mark, finishDate: pars.finishDate
                    }).exec(function (err, updated) {
                        if (err) {
                            sails.log(err)
                        } else {
                            res.send(req.__("Record has update"));
                        }
                    })
                }
            }
        });
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
                if (learnings.length == '' || learnings.length == null) {
                    res.ok();
                } else {
                    req.session.loadBookNum += learnings.length;
                    var noMore = (req.session.loadBookNum == req.session.learningCount);
                    var arraySize = learnings.length;
                    var arrTag = [];
                    //get more info learning
                    learnings.forEach(function (item, index) {
                        //get user's data lesson
                        BookDetail.find({where: {bookMaster: item.bookMaster.id}, sort: {sort: 1}}).exec(function (err, lessons) {
                            // get learn history of these lessons
                            UserLearnHistory.find({where: {user: req.session.user.id, selfLearning: item.id}}).exec(function (err, learnedLessons) {
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
                                arrTag.push(item.bookMaster.type);
                                item.fasledNum = fasledNum;
                                item.passedNum = passedNum;
                                // get percent of implementation
                                //item.percentComplete = passedNum/item.bookMaster.lessonNum;

                                //recommend book each day
                                var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
                                var TotalDays = Math.round(Math.abs((item.finishDate.getTime() - item.startDate.getTime()) / (oneDay)));
                                var eachDayLesson = Math.ceil(item.bookMaster.lessonNum / TotalDays);
                                item.eachDayLesson = eachDayLesson;
                                // status learning
                                // percent of current day on total day
                                var now = new Date();
                                var percentDay = 0
                                if(now.getTime() >= item.startDate.getTime()){
                                    percentDay = Math.round(Math.abs((now.getTime() - item.startDate.getTime()) / (oneDay))) / TotalDays;
                                }
                                item.percentDay = percentDay * 100;
                                //percent of passed lesson on total lesson
                                var percentLesson = passedNum / item.bookMaster.lessonNum;
                                var rs = percentLesson - percentDay;
                                // get status learning
                                if (rs >= 0 && rs < 0.2) {
                                    item.statusLearning = req.__("you catch up time's learning");
                                } else if (rs > 0.2) {
                                    item.statusLearning = req.__("you learn fast");
                                } else if (rs < 0) {
                                    item.statusLearning = req.__("you learn slowly");
                                }
                                // prevent non-blocking (do finish step when arraySize = arrTag.length)
                                if (arrTag.length == arraySize) {
                                    res.render('japtool/learning/loadMore', {
                                        listLearnings: learnings,
                                        noMore: noMore
                                    })
                                }
                            })
                        })
                    });
                }
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

                        res.render('japtool/learning/learningDetail', {
                            lessonList: lessonList,
                            selfLesson: selfLesson,
                            learningID: learningID
                        });
                    }
                })
            }
        })
    },
    /*getMissLesson: function (req, res) {
     var bookId = req.param('bookId');
     var learningId = req.param('learningId');
     var startDate = req.param('startDate');
     var finishDate = req.param('finishDate');
     finishDate = new Date(finishDate);
     startDate = new Date(startDate);
     finishDate.setHours(23, 59, 59);
     var currentDate = Date.now();
     //Only recommend when in learning time
     if (currentDate < startDate || currentDate > finishDate) {
     return res.send([]);
     }
     SelfLearning.findOne({user: req.session.user.id, id: learningId})
     .populate('bookMaster')
     .populate('userLearnHistories').exec(function (err, selfLearning) {
     if (err) {
     sails.log("Err when read data from server:");
     return res.serverError(err);
     }
     BookDetail.find({bookMaster: bookId}).exec(function (err, bookDetails) {
     if (err) {
     sails.log("Err when read book detail data:");
     return res.serverError(err);
     }
     if (selfLearning == null || selfLearning == undefined) {
     return res.send([]);
     }
     //Only recommend when in learning time
     if (currentDate < startDate || currentDate > finishDate) {
     return res.send([]);
     }
     //Total learning Day
     var totalDay = Math.ceil((finishDate - startDate) / 86400000);
     sails.log('Total day: ' + totalDay);
     var passedDay = totalDay - (Math.ceil((finishDate - currentDate) / 86400000));

     var lessonPerDay = Math.ceil(bookDetails.length / totalDay);
     var totalMissLesson = Math.ceil(passedDay * lessonPerDay);
     var lessonLearning = selfLearning.userLearnHistories.length;
     sails.log('lessonLearning :' + lessonLearning);
     var bookMissLessons = new Array();
     for (var j = 0; j < bookDetails.length; j++) {
     var pus=1;
     var check = 0;
     for (var k = 0; k < selfLearning.userLearnHistories.length; k++) {
     check++;
     if (bookDetails[j].id == selfLearning.userLearnHistories[k].bookDetail) {
     pus = 2;
     }
     if ((check) == selfLearning.userLearnHistories.length) {
     sails.log("Da check" + j);
     if (pus == 1) {
     bookMissLessons.push(bookDetails[j]);
     sails.log("Push");
     if (bookMissLessons.length == totalMissLesson) {
     sails.log("sended")
     res.send(bookMissLessons);
     return;
     }
     else {

     }
     }


     }
     }

     }
     /!*for (var j = 0; j < selfLearning.userLearnHistories.length; j++) {
     sails.log(i+''+selfLearning.userLearnHistories[i].bookDetail);
     if (bookDetails[i].id == selfLearning.userLearnHistories[j].bookDetail) {
     bookMissLessons.push(bookDetails[i]);
     break;
     }
     if (i == totalMissLesson - 1 && j == selfLearning.userLearnHistories.length - 1) {
     res.send(bookMissLessons);
     }
     }*!/


     });
     });
     }*/
};

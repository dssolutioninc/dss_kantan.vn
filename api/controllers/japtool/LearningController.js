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
        var create = null;
        SelfLearning.findOne({
            user: req.session.user.id,
            bookMaster: bookid
        }).populate('bookMaster', {sort: 'startDate'}).exec(function (err, learning) {
            if (err) {
                sails.log(err);
            }
            else if (learning == undefined) {
                BookMaster.findOne({id: bookid}).exec(function (err, books) {
                    if (err) {
                        sails.log(err);
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
                sails.log(err);
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
                sails.log(err);
            }
            else {
                res.redirect('japtool/mylearning/');
            }
        })
    },
    loadEditForm: function (req, res) {
        var id = req.param("id");
        SelfLearning.findOne({id: id}).populate('bookMaster', {sort: 'startDate'}).exec(function (err, learning) {
            if (err) {
                sails.log(err);
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
                                    BookMaster.find({id: bookMaster})
                                        .exec(function (err, book) {
                                            var usedNum = book.usedNum ? book.usedNum + 1 : 1;
                                            BookMaster.update({id: bookMaster}, {usedNum: usedNum})
                                                .exec(function (err, book) {
                                                    res.send('japtool/learning/');
                                                })
                                        })
                                }
                            })
                        });
                    }
                    else {
                        var startDate = learning.startDate;
                        var finishDate = learning.finishDate;
                        var now = new Date();

                        if (finishDate > now) {
                            var create = '<h3> ' + req.__('book already') + ' <a href = "/japtool/Learning/practice/?id=<%= book.id %>" > </a></h3 > ';
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
                                        console.log(err);
                                    }
                                    else {
                                        res.send('japtool/mylearning/');
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
                        sails.log(err);
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
                                    sails.log(err);
                                }
                                else {
                                    BookMaster.find({id: bookMaster})
                                        .exec(function (err, book) {
                                            var usedNum = book.usedNum ? book.usedNum + 1 : 1;
                                            BookMaster.update({id: bookMaster}, {usedNum: usedNum})
                                                .exec(function (err, book) {
                                                    res.send('japtool/learning/practice/?id=' + bookMaster);
                                                })
                                        })
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
                    sails.log(err);
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
                        sails.log(err);
                    }
                    else {
                        res.render('japtool/learning/BookItem', {books: books, level: level});
                    }
                })
            }
            else {
                BookMaster.find({level: level}).exec(function (err, books) {
                    if (err) {
                        sails.log(err);
                    }
                    else {
                        res.render('japtool/learning/BookItem', {books: books, level: level});
                    }
                })
            }
        }
        else {
            if (level == 0) {
                BookMaster.find({type: type}).exec(function (err, books) {
                    if (err) {
                        sails.log(err);
                    }
                    else {
                        res.render('japtool/learning/BookItem', {books: books, level: level});
                    }
                })
            }
            else {
                BookMaster.find({type: type, level: level}).exec(function (err, books) {
                    if (err) {
                        sails.log(err);
                    }
                    else {
                        res.render('japtool/learning/BookItem', {books: books, level: level, level: level});
                    }
                })
            }
        }


    },

    deleteLearning: function (req, res) {
        var id = req.param('id');
        SelfLearning.findOne({id: id}).exec(function (err, selfLearn) {
            if (err) {
                sails.log(err);
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
                            sails.log(err);
                        }
                        else {
                            res.send('japtool/mylearning/');
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


};

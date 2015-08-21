module.exports = {
    getStep3: function (req, res) {

        Survey.find().exec(function (err, surveies) {
            if (err) {
            }
            var suv = new Array();
            var check;
            do {
                var random = Math.floor(Math.random() * ((surveies.length - 1) - 0 + 1) + 0);
                var Surveyrandom = surveies[random];
                if (suv.length == 0) {
                    suv.push(Surveyrandom);
                }
                else {
                    check = true;
                    for (var i = 0; i < suv.length; i++) {
                        if (suv[i] == Surveyrandom) {
                            check = false;
                        }
                    }
                    suv.push(Surveyrandom);
                }
            }
            while (suv.length < Constants.maxSurveyQuestion && suv.length < surveies.length)

            res.render('japtool/Recommend/step3', {
                surveies: suv
            });
        })
    },
    getLibraryForFirtLogin: function (req, res) {
        var lv = req.param('lv');
        var cLT = req.param('cLT');
        var listSv = req.param('sV');
        if (listSv == null) {
            BookMaster.find({level: lv}).populate('bookDetails', {sort: 'sort ASC'}).limit(Constants.maxLibraRs).exec(function createCB(err, data) {
                User.update({id: req.session.User.id}, {
                    currentLevel: lv,
                    currentLearningTime: cLT
                }).exec(function (err, ok) {
                    if (err) {
                    }
                    var arrTag = [];
                    var arrAllLesson = [];
                    data.forEach(function (book) {
                        var arrLesson = [];
                        if (book.bookDetails.length != 0) {
                            book.bookDetails.forEach(function (item, index) {
                                arrLesson.push(item.lesson);
                                if (index == (book.bookDetails.length - 1)) {
                                    var array = require("array-extended");
                                    var uniqueArrLesson = array(arrLesson).unique().value();
                                    var objLesson = {
                                        arrLesson: uniqueArrLesson,
                                        idLesson: book.id
                                    };
                                    arrAllLesson.push(objLesson);
                                }
                            })
                        }
                    });
                    data.forEach(function (item, index) {
                        arrTag.push(item.type);
                    })
                    var array = require("array-extended");
                    var uniqueType = array(arrTag).unique().value();
                    res.view('japtool/Recommend/LibraRecommend', {
                        data: data,
                        uniqueType: uniqueType,
                        arrAllLesson: arrAllLesson
                    })
                })

            })
        }
        else {
            var listid = req.param("id").split(",");
            BookMaster.find({level: lv}).populate('bookDetails', {sort: 'sort ASC'}).limit(Constants.maxLibraRs).exec(function createCB(err, data) {
                User.update({id: req.session.User.id}, {
                    currentLevel: lv,
                    currentLearningTime: cLT
                }).exec(function (err, ok) {
                    if (err) {
                    }
                    var ArraySvResult = listSv.split(",");
                    for (var i = 0; i < listid.length; i++) {
                        SurveyResult.create({
                            surveyID: listid[i],
                            UserID: req.session.User.id,
                            Answer: ArraySvResult[i]
                        }).exec(function (err, sur) {
                            if (err) {
                            }
                        })
                    }
                    var arrTag = [];
                    var arrAllLesson = [];

                    data.forEach(function (book) {
                        var arrLesson = [];
                        if (book.bookDetails.length != 0) {
                            book.bookDetails.forEach(function (item, index) {
                                arrLesson.push(item.lesson);
                                if (index == (book.bookDetails.length - 1)) {
                                    var array = require("array-extended");
                                    var uniqueArrLesson = array(arrLesson).unique().value();
                                    var objLesson = {
                                        arrLesson: uniqueArrLesson,
                                        idLesson: book.id
                                    };
                                    arrAllLesson.push(objLesson);
                                }
                            })
                        }
                    });

                    data.forEach(function (item, index) {
                        arrTag.push(item.type);
                    })
                    var array = require("array-extended");
                    var uniqueType = array(arrTag).unique().value();
                    res.view('japtool/Recommend/LibraRecommend', {
                        data: data,
                        uniqueType: uniqueType,
                        arrAllLesson: arrAllLesson
                    })
                })
            })
        }
    },

    getLibraryLogin: function (req, res) {
        var lv = req.session.User.currentLevel;
        BookMaster.find({level: lv}).populate('bookDetails', {sort: 'sort ASC'}).limit(Constants.maxLibraRs).exec(function createCB(err, data) {
            var arrTag = [];
            var arrAllLesson = [];
            data.forEach(function (book) {
                var arrLesson = [];
                if (book.bookDetails.length != 0) {
                    book.bookDetails.forEach(function (item, index) {
                        arrLesson.push(item.lesson);
                        if (index == (book.bookDetails.length - 1)) {
                            var array = require("array-extended");
                            var uniqueArrLesson = array(arrLesson).unique().value();
                            var objLesson = {
                                arrLesson: uniqueArrLesson,
                                idLesson: book.id
                            };
                            arrAllLesson.push(objLesson);
                        }
                    })
                }
            });

            data.forEach(function (item, index) {
                arrTag.push(item.type);
            })
            var array = require("array-extended");
            var uniqueType = array(arrTag).unique().value();
            res.view('japtool/Recommend/LibraRecommend', {
                data: data,
                uniqueType: uniqueType,
                arrAllLesson: arrAllLesson
            })
        })
    },
    _config: {
        locals: {
            layout: 'layout/layout-japtool'
        }
    }
}

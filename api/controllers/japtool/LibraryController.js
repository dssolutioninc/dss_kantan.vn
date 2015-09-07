/**
 * Created by TuyenTV1 on 6/23/2015.
 */
module.exports = {
//This loads index.ejs
    index: function (req, res) {
        res.view();
    },

    getLibrary: function (req, res) {
        BookMaster.find()
            .sort('sort asc')
            .populate('bookDetails', {sort: 'sort ASC'}).exec(function createCB(err, data) {
                var arrTag = [];
                if (data.length == 0) {
                    res.view('japtool/library/notFound');
                } else {
                    data.forEach(function (item, index) {
                        arrTag.push(item.type);
                        if (index == (data.length - 1)) {
                            var array = require("array-extended");
                            var uniqueType = array(arrTag).unique().value();
                            res.view('japtool/library/index', {
                                uniqueType: uniqueType

                            })
                        }
                    })
                }

            })
    },

    fillLibrary: function (req, res) {
        //******************Build condition****************************
        var condition = '';
        var comma = '';
        var groupSearch = req.param('groupSearch');
        if (groupSearch != undefined && groupSearch != 0)
            condition = "\"type\":\"" + groupSearch + "\"";
        var levelSearch = req.param('levelSearch');
        if (levelSearch != undefined && levelSearch != 0) {
            if (condition != '')
                comma = ",";
            condition += comma + "\"level\":\"" + levelSearch + "\"";
        }
        var textSearch = req.param('textSearch');
        if (textSearch != undefined && textSearch != "") {
            if (condition != '')
                comma = ",";
            else
                comma = "";
            condition += comma + "\"name\":\"%" + textSearch + "%\"";
        }
        condition = "{" + condition + "}";
        //******************Ended Build condition***********************
        BookMaster.find({where: JSON.parse(condition)})
            .sort('sort asc')
            .populate('bookDetails', {sort: 'sort ASC'}).exec(function createCB(err, data) {
                var arrTag = [];
                var arrAllLesson = [];
                if (data.length == 0) {
                    res.render('japtool/library/notFound');
                } else {
                    if (err) {
                        return res.serverError(__("Error when get and process BookMaster data"));
                    }
                    else {
                        data.forEach(function (item, index) {
                            arrTag.push(item.type);
                            if (index == (data.length - 1)) {
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
                                var array = require("array-extended");
                                var uniqueType = array(arrTag).unique().value();
                                res.render('japtool/library/libraryContent', {
                                    data: data,
                                    uniqueType: uniqueType,
                                    arrAllLesson: arrAllLesson

                                })
                            }
                        })
                    }
                }

            })
    },

    getAllLibrary: function (req, res) {
        var type = req.param('type');
        BookMaster.find({type: type})
            .sort('sort asc')
            .populate('bookDetails', {sort: 'sort ASC'}).exec(function createCB(err, data) {
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
                res.view('japtool/library/showCategory', {
                    data: data,
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

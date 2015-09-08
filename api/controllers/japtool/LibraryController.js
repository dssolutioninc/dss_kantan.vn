/**
 * Created by TuyenTV1 on 6/23/2015.
 */
module.exports = {
    _config: {
        locals: {
            layout: 'layout/layout-japtool'
        }
    },

    index: function (req, res) {
        var type = req.param('type');
        var level = req.param('level');
        var bookName = req.param('name');

        // get search condition if exist
        if (type) req.session.searchType = type;
        if (level) req.session.searchLevel = level;
        if (bookName != null) req.session.searchBookName = bookName;

        // if search condition is not exist in session or request params, set default
        if (!req.session.searchType) req.session.searchType = 'all';
        if (!req.session.searchLevel) req.session.searchLevel = req.session.User.currentLevel;
        if (!req.session.searchBookName) req.session.searchBookName = '';

        var searchCondition = '';
        if (req.session.searchType != 'all'){
            searchCondition += "\"type\":\"" + req.session.searchType + "\",";
        }
        if (req.session.searchLevel != 'all'){
            searchCondition += "\"level\":\"" + req.session.searchLevel + "\",";
        }
        if (req.session.searchBookName != ''){
            searchCondition += "\"name\":\"%" + req.session.searchBookName + "%\",";
        }

        if (searchCondition != '') {
            // remove the comma in the tail of string
            searchCondition = searchCondition.substring(0, searchCondition.length - 1);
        }

        // make json style
        searchCondition = "{" + searchCondition + "}";
        
        BookMaster.find({where: JSON.parse(searchCondition)})
        .sort('sort asc')
        .exec(function (err, books) {
            if (err) {
                return res.serverError(__("Error when get and process BookMaster data"));
            } else {
                var arrTypes = [];
                if (req.session.searchType == 'all'){
                    arrTypes = ['vocabulary','kanji','speech'];

                    // initial loaded books in session
                    var loadedBookCount = {};
                    loadedBookCount['vocabulary'] = Constants.maxLibOnPage;
                    loadedBookCount['kanji'] = Constants.maxLibOnPage;
                    loadedBookCount['speech'] = Constants.maxLibOnPage;

                    req.session.loadedBookCount = loadedBookCount;

                } else {
                    arrTypes.push(req.session.searchType);

                    // initial loaded books in session
                    var loadedBookCount = {};
                    loadedBookCount[req.session.searchType] = Constants.maxLibOnPage;

                    req.session.loadedBookCount = loadedBookCount;
                }

                res.view('japtool/library/index', {
                    books: books,
                    arrTypes: arrTypes
                })
            }
        })
    },

    loadMore: function (req, res) {
        var type = req.param('type');
        var positionIndex = req.param('positionIndex');

        BookMaster.count({
            where: {type: type}
        }).exec(function (err, count){

            BookMaster.find({
                where: {type: type},
                limit: Constants.maxLibOnPage,
                skip: req.session.loadedBookCount[type],
                sort: {sort: 0}
            }).exec(function (err, books) {
                if (err) {
                    if (err) return res.serverError(err);
                } else {

                    if(books.length == '' || books.length == null){
                        res.ok();
                    }else{
                        req.session.loadedBookCount[type] += books.length;
                        var noMore = (req.session.loadedBookCount[type] == count);

                        res.render('japtool/library/loadMore', {
                            books: books, positionIndex: positionIndex, noMore: noMore
                        });
                    }
                }
            })
        })
    }

    // fillLibrary: function (req, res) {
    //     //******************Build condition****************************
    //     var condition = '';
    //     var comma = '';
    //     var typeSearch = req.param('typeSearch');
    //     if (typeSearch != undefined && typeSearch != 'all')
    //         condition = "\"type\":\"" + typeSearch + "\"";
    //     var levelSearch = req.param('levelSearch');
    //     if (levelSearch != undefined && levelSearch != 'all') {
    //         if (condition != '')
    //             comma = ",";
    //         condition += comma + "\"level\":\"" + levelSearch + "\"";
    //     }
    //     var textSearch = req.param('textSearch');
    //     if (textSearch != undefined && textSearch != "") {
    //         if (condition != '')
    //             comma = ",";
    //         else
    //             comma = "";
    //         condition += comma + "\"name\":\"%" + textSearch + "%\"";
    //     }
    //     condition = "{" + condition + "}";
    //     //******************Ended Build condition***********************
    //     BookMaster.find({where: JSON.parse(condition)})
    //         .sort('sort asc')
    //         .exec(function createCB(err, data) {
    //             var arrTag = [];
    //             var arrAllLesson = [];
    //             if (data.length == 0) {
    //                 res.render('japtool/library/notFound');
    //             } else {
    //                 if (err) {
    //                     return res.serverError(__("Error when get and process BookMaster data"));
    //                 }
    //                 else {
    //                     // data.forEach(function (item, index) {
    //                     //     arrTag.push(item.type);
    //                     //     if (index == (data.length - 1)) {
    //                     //         data.forEach(function (book) {
    //                     //             var arrLesson = [];
    //                     //             if (book.bookDetails.length != 0) {
    //                     //                 book.bookDetails.forEach(function (item, index) {
    //                     //                     arrLesson.push(item.lesson);
    //                     //                     if (index == (book.bookDetails.length - 1)) {
    //                     //                         var array = require("array-extended");
    //                     //                         var uniqueArrLesson = array(arrLesson).unique().value();
    //                     //                         var objLesson = {
    //                     //                             arrLesson: uniqueArrLesson,
    //                     //                             idLesson: book.id
    //                     //                         };
    //                     //                         arrAllLesson.push(objLesson);
    //                     //                     }
    //                     //                 })
    //                     //             }
    //                     //         });
    //                     //         var array = require("array-extended");
    //                     //         var uniqueType = array(arrTag).unique().value();
    //                     //         res.render('japtool/library/libraryContent', {
    //                     //             data: data,
    //                     //             uniqueType: uniqueType,
    //                     //             arrAllLesson: arrAllLesson
    //                     //         })
    //                     //     }
    //                     // })

    //                     arrTag = ['vocabulary','kanji','test','grammar','speech'];

    //                     res.render('japtool/library/libraryContent', {
    //                         data: data,
    //                         uniqueType: arrTag,
    //                         arrAllLesson: arrAllLesson
    //                     })

                        
    //                 }
    //             }

    //         })
    // },

    // getAllLibrary: function (req, res) {
    //     var type = req.param('type');
    //     BookMaster.find({type: type})
    //         .sort('sort asc')
    //         .populate('bookDetails', {sort: 'sort ASC'}).exec(function createCB(err, data) {
    //             var arrAllLesson = [];

    //             data.forEach(function (book) {
    //                 var arrLesson = [];
    //                 if (book.bookDetails.length != 0) {
    //                     book.bookDetails.forEach(function (item, index) {
    //                         arrLesson.push(item.lesson);
    //                         if (index == (book.bookDetails.length - 1)) {
    //                             var array = require("array-extended");
    //                             var uniqueArrLesson = array(arrLesson).unique().value();
    //                             var objLesson = {
    //                                 arrLesson: uniqueArrLesson,
    //                                 idLesson: book.id
    //                             };
    //                             arrAllLesson.push(objLesson);

    //                         }
    //                     })
    //                 }
    //             });
    //             res.view('japtool/library/showCategory', {
    //                 data: data,
    //                 arrAllLesson: arrAllLesson
    //             })
    //         })
    // }
}

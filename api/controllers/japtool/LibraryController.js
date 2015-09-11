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
        if (!req.session.searchLevel) req.session.searchLevel = req.session.user.currentLevel;
        if (!req.session.searchBookName) req.session.searchBookName = '';

        var searchCondition = '';
        if (req.session.searchType != 'all'){
            searchCondition += "\"type\":\"" + req.session.searchType + "\",";
        } 
        // else {
        //     searchCondition += "\"type\":\"['vocabulary','kanji','speech']\",";
        // }
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

                    books.forEach(function (book) {
                        arrTypes.push(book.type);
                    })

                    var array = require("array-extended");
                    arrTypes = array(arrTypes).unique().value();
                    // arrTypes = ['vocabulary','kanji','speech'];

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

        var searchCondition = "\"type\":\"" + type + "\",";
        
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
        

        BookMaster.count({
            where: JSON.parse(searchCondition)
        }).exec(function (err, count){

            BookMaster.find({
                where: JSON.parse(searchCondition),
                limit: Constants.maxLibOnPage,
                skip: req.session.loadedBookCount[type],
                sort: {sort: 1}
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
}

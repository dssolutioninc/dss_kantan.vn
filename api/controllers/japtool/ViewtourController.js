/**
 * Created by Dulv on 8/9/2015.
 */

module.exports = {
    _config: {
        locals: {
            layout: 'layout/layout-japtool'
        }
    },
    
    index: function (req, res) {

        BookMaster.find({name : [
        	'Bộ từ vựng N3 tập 1', 
        	'List Kanji N3']})
        .exec(function (err, books) {
            if (err) {
            	sails.log(err);
                return res.serverError(__("Error when get and process BookMaster data"));
            } else {
                var arrTypes = ['vocabulary','kanji'];

                res.view('japtool/viewtour/index', {
                    books: books,
                    arrTypes: arrTypes
                })
            }
        })
    }
}
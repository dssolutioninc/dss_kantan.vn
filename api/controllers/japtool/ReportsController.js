/**
 * Created by TuyenTV1 on 6/26/2015.
 */
module.exports = {
//This load
    learningReport: function(req, res){
        res.view('japtool/reports/learningReport',{ layout: 'layout/layout-japtool'});
    }

};

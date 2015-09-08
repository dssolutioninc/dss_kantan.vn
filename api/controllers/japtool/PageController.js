/**
 * Created by TuyenTV1 on 7/10/2015.
 */

module.exports = {
    about: function (req, res) {
        res.view();
    },
    guide: function (req, res) {
        res.view();
    },
    contact:function(req,res){
        res.view();
    },
    _config: {
        locals: {
            layout: 'layout/layout-japtool'
        }
    }
}
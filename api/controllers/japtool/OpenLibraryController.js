/**
 * Created by Taitt on 28/09/2015.
 */

module.exports = {

    index: function (req, res) {
        res.view();
    },

    downloadTemplate: function (req, res) {
        var fs = require('fs');
        var path = require('path');

        var type = req.param('type');

        if(type !== 'undefined' && type != null){
            var SkipperDisk = require('skipper-disk');

            var fileName = type + Constants.templateFile;
            var filePath = sails.config.appPath + Constants.templatePath + fileName;
            var fileAdapter = SkipperDisk();
            
            res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
            res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            
            fileAdapter.read(filePath).on('error', function (err) {
                sails.log("Error when download file from server:")
                return res.serverError(err);
            }).pipe(res);
        }else{
            sails.log("Invalid type to download file from server")
            return;
        }
    },

    _config: {
        locals: {
            layout: 'layout/layout-japtool'
        }
    }
}
/**
 * Created by Taitt on 28/09/2015.
 */
var fs = require('fs');
var path = require('path');

module.exports = {

    index: function (req, res) {
        res.view();
    },

    downloadTemplate: function (req, res) {
        var type = req.param('type');

        if(type !== 'undefined' && type != null){
            var SkipperDisk = require('skipper-disk');

            var fileName = type + Constants.templateFile;
            var filePath = sails.config.appPath + Constants.templatePath + fileName;
            var fileAdapter = SkipperDisk();
            
            res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
            res.setHeader('Content-type', Constants.xlsxMimeType);
            
            fileAdapter.read(filePath).on('error', function (err) {
                sails.log("Error when download file from server:")
                return res.serverError(err);
            }).pipe(res);
        }else{
            //sails.log("Invalid type to download file from server")
            return res.serverError("Invalid type to download file from server");
        }
    },

    importTemplate: function (req, res) {
        if(req.method === 'GET'){
            //  Call to /upload via GET is error
            return res.json({'status':'GET not allowed'}); 
        }else if (req.method === 'POST'){
            var XLSX = require('xlsx');
            var uploadFile = req.file('uploadFile');
            var filename = uploadFile._files[0].stream.filename;

            var xlsxMimeType = uploadFile._files[0].stream.headers['content-type'];
            console.log(xlsxMimeType);
            if(xlsxMimeType != Constants.xlsxMimeType){
                //sails.log("Invalid type to download file from server")
                return res.serverError("Invalid file to import");
            }else {
                uploadFile.upload(function (err, uploadedFiles){
                    if (err) return res.send(500, err);
                    var tag = "testTag";
                    
                    var filePath = uploadedFiles[0].fd;
                    var workbook = XLSX.readFile(filePath);
                    var first_sheet_name = workbook.SheetNames[0];
                    var address_of_cell = ['B','C','D','E','F'];
                    /* Get worksheet */
                    var worksheet = workbook.Sheets[first_sheet_name];
                     
                    /* Find desired cell */
                    for (var i = 15; i < 1015; i ++){
                        for(var j = 0; j < 5; j++ ){
                            var desired_cell = worksheet[address_of_cell[j] + i.toString()];
                     
                            /* Get the value */
                            if(desired_cell !== 'undefined' && desired_cell != null){
                                var desired_value = desired_cell.v;
                                console.log(desired_value);
                            }else if()
                        }
                    }
                    /*Delete uploaded file from '.tmp/uploads' directory*/
                    fs.unlinkSync(filePath);
                    return res.send(200, "OK");
                });
            }
        }
                                 
    },

    _config: {
        locals: {
            layout: 'layout/layout-japtool'
        }
    }
}
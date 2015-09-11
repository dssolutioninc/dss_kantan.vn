/**
 * VocabularyController for admin
 *
 * @description :: Server-side logic for managing vocabularies
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	


  /**
   * `VocabularyController.create()`
   */
  create: function (req, res) {

    if(req.method=="POST"&& req.param("item", null)!=null){

      var paras = req.allParams();
      //console.log('all paras: ' + JSON.stringify(paras));
      delete paras.avatar;
      delete paras.id;
      //console.log('paras after delete: ' + JSON.stringify(paras));


      // //Upload file to GridFS
      // req.file('avatar').upload({
      //     // don't allow the total upload size to exceed ~1MB
      //     maxBytes: 1000000,
      //     adapter: require('skipper-gridfs'),
      //     uri: 'mongodb://dulv:dulv@localhost:27017/dulv.fs'
      //   }, function(err, imgfiles){
      //     if (err) return res.negotiate(err);
          
      //     if (imgfiles.length != 0){
      //        console.log('UPLOAD FILE ' + imgfiles[0]);
      //        paras.image = imgfiles[0].fd;
      //        console.log('fd : ' + imgfiles[0].fd);
      //        //console.log('filename : ' + imgfiles[0].filename);
      //     }

      //     Vocabulary.create(paras).exec(function createVoc(err, vocabulary){
      //       res.redirect('admin/vocabulary/view/'+vocabulary.id);
      //     });
      // });
      
      
      //Upload file to File directory
      var uploadPath = process.cwd() + '/assets/images';
      path = require('path');
      
      req.file('avatar').upload({
          maxBytes: sails.config.Constants.upFileMaxBytes,
          dirname: uploadPath
        }, function(err, imgfiles){
          if (err) return res.negotiate(err);
          
          if (imgfiles.length != 0){
             //console.log('UPLOAD FILE ' + imgfiles[0]);
             paras.image = path.basename(imgfiles[0].fd) ;
             console.log(paras.image + ' file upload done.');
          }

          Vocabulary.create(paras).exec(function createVoc(err, vocabulary){
            console.log('the record is inserted : ' + JSON.stringify(vocabulary));

            res.redirect('admin/vocabulary/view/' + vocabulary.id);
          });
      });
 
    }
    else{

      res.view('admin/vocabulary/create', {layout: 'layout'});
    }
  },


  /**
   * `VocabularyController.update()`
   */
  update: function (req, res) {
    var id=req.param("id",null);
    
    if(req.method=="GET" && id!=null){

      Vocabulary.findOne(id).exec(function(err,vocabulary){

        res.view( 'admin/vocabulary/update',{'vocabulary':vocabulary, layout: 'layout'});  
      });
    }
    else if (req.method=="POST" && id!=null){
      
      var paras = req.allParams();
      //console.log('all paras: ' + JSON.stringify(paras));
      delete paras.avatar;
      delete paras.id;

      //Upload file to File directory
      var uploadPath = process.cwd() + '/assets/images/';
      path = require('path');
      
      req.file('avatar').upload({
          maxBytes: sails.config.Constants.upFileMaxBytes,
          dirname: uploadPath
        }, function(err, imgfiles){
          if (err) return res.negotiate(err);
          
          //delete old img file first, then switch image to new file
          Vocabulary.findOne(id).exec(function(err,vocabulary){

            if (imgfiles.length != 0){
              //console.log('UPLOAD FILE ' + imgfiles[0]);
              paras.image = path.basename(imgfiles[0].fd) ;
              console.log(paras.image + ' file upload done.');
           
              var fs = require('fs');

              //delete old img file
              if (vocabulary.image) {
                fs.unlink(uploadPath + vocabulary.image, function (err) {
                  if (err) throw err;
                  console.log('successfully deleted ' + vocabulary.image);
                });
              }
            }
            else{ delete paras.image; }
           
            // update vocabulary data
            Vocabulary.update({id: id}, paras).exec(function(err,updated){
              console.log('the record is updated : ' + JSON.stringify(updated[0]) ); 

              res.redirect('admin/vocabulary/view/' + vocabulary.id);
            });
          });
      });
    }     
  },


  /**
   * `VocabularyController.delete()`
   */
  delete: function (req, res) {
    var id=req.param("id",null);
    
    //delete old img file first
    Vocabulary.findOne(id).exec(function(err,vocabulary){
      if (!vocabulary.image) return;
      var fs = require('fs');
      var uploadPath = process.cwd() + '/assets/images/';

      fs.unlink(uploadPath + vocabulary.image, function (err) {
        if (err) throw err;
        console.log('successfully deleted ' + vocabulary.image);
      });
    });

    //delete vocabulary data
    Vocabulary.destroy({id: id}).exec(function(err){
      console.log('the record is deleted. record id : ' + id ); 
      Vocabulary.find().exec(function findCB(err,vocabularies){
   
        res.view('admin/vocabulary/index',{'vocabularies':vocabularies, layout: 'layout'});   
      });
    });
  },


  /**
   * `VocabularyController.view()`
   */
  view: function (req, res) {

      var id=req.param("id",null);
      // console.log("Constants.upFileMaxBytes: " + Constants.upFileMaxBytes);

      Vocabulary.findOne(id).exec(function(err,vocabulary){
   
        //res.view( 'admin/vocabulary/view',{'vocabulary':vocabulary, layout: 'layout'});   
      });
  },


  /**
   * `VocabularyController.index()`
   */
  index: function (req, res) {

      //var Database = require('../../common/Database');
      //console.log("Constants.upFileMaxBytes: " + Constants.upFileMaxBytes);
      //console.log("Constants.testConst: " + Constants.testConst);

      //console.log('uri: ' + Database.uri());
      //console.log('host: ' + Database.host());
      //console.log('port: ' + Database.port());

      Vocabulary.find().exec(function findCB(err,vocabularies){
   
        //res.view('admin/vocabulary/index',{'vocabularies':vocabularies, layout: 'layout'});   
      });

  },


  // //Use GridFS for store image files
  // img: function (req, res) {
  //   var blobAdapter = require('skipper-gridfs')({
  //       uri: 'mongodb://dulv:dulv@localhost:27017/dulv.fs'
  //   });

  //   var fd = req.param('id'); // value of fd comes here from get request
  //   blobAdapter.read(fd, function(error , file) {
  //       if(error) {
  //           res.json(error);
  //       } else {
  //           //console.log('type of File : ' + JSON.stringify(file));

  //           res.contentType('image/png');
  //           res.send(new Buffer(file));

  //           //res.attachment(new Buffer(file));

  //       }
  //   });
  // },

};


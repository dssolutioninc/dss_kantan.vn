/**
 * Admin/BookController
 *
 * @description :: Server-side logic for managing admin/books
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	_config: {
        locals: {
            layout: 'layout/layout-admin'
        }
    },

    /**
   	* `Admin/BookController.index()`
   	*/
  	index: function (req, res) {

    	BookMaster.find().exec(function findCB(err,books){

   			//console.log('books data : ' + JSON.stringify(books));
        	res.view('admin/book/index',{'books':books});
      	});
  	},

  	/**
	* `Admin/BookController.update()`
	*/
	update: function (req, res) {
	    var id=req.param("id",null);

	    if(req.method=="GET" && id!=null){

	      BookMaster.findOne(id).exec(function(err,book){

	        res.view( 'admin/book/update',{'book':book});
	      });
	    }
	    else if (req.method=="POST" && id!=null){

	      	var paras = req.allParams();
	      	//console.log('all paras: ' + JSON.stringify(paras));
	      	delete paras.image_file;
	      	delete paras.id;
	       	FileAction.upload('image_file', req, function(err, imgUploaded) {
                if (err) return res.negotiate(err);

                //delete old img file first, then switch image to new file
	       		BookMaster.findOne(id).exec(function(err,bookBeforeUpdate){

		            if (imgUploaded.length != 0){
		            	// set image to new file
		              	paras.image = imgUploaded[0].fd;

		             	//delete old img file
		              	if (bookBeforeUpdate.image) {
		              		FileAction.rm(bookBeforeUpdate.image, function (err) {
		              			if (err) {
		              				throw err;
		              			} else {
		              				console.log('successfully deleted ' + bookBeforeUpdate.image);
		              			}
		              		})
		              	}
	            	}
	            	else{ delete paras.image; }

		        	// update book
		            BookMaster.update({id: id}, paras).exec(function(err,updated){
		              //console.log('the record is updated : ' + JSON.stringify(updated[0]) );
		              res.redirect('admin/book/index');
		            });
		        });
			});
		}
	}
};

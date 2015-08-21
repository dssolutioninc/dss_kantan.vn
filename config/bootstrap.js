/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {
//var storeUsers =[];
//  var users =[{username:'demo1',firstname:'demo1',lastname:'demo1',email:'demo1@gmail.com',encryptedPassword:'$2a$10$lG9KPDx8KpmGDr0o0QibjuVL8mi1RQfOOw3ZLZ7Le3im0JPui9QpO',admin:'false',address:'Ha Noi',gender:'1',birthday:'12/12/2012',website:'itplusvn.com'},{username:'demo2',firstname:'demo2',lastname:'demo2',email:'demo2@gmail.com',encryptedPassword:'$2a$10$lG9KPDx8KpmGDr0o0QibjuVL8mi1RQfOOw3ZLZ7Le3im0JPui9QpO',admin:'false',address:'Ha Noi',gender:'1',birthday:'12/12/2012',website:'itplusvn.com'}]
//  var groups =[{groupName:'an choi'},{groupName:'cham chi'}]

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  cb();
};

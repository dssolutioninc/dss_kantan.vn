/**
 * Created by TuanNT22 on 18-06-2015.
 */
var ejs = require('ejs');
var fs = require('fs');
var path = require("path");
module.exports = {
  send: function (mailLayoutFile, user, mailContent) {
    var nodemailer = require('nodemailer');

    var mailer = nodemailer.createTransport(({
      host: Constants.smtpServer,
      port: Constants.smtpPort,
      auth: {
          user: Constants.smtpUser,
          pass: Constants.smtpPass
      }
    }));

    fs.readFile(path.join(__dirname, '../../views/japtool/email/' + mailLayoutFile), 'utf8', function (err, template) {

      var body = ejs.render(template,{
          user: user,
          mailContent: mailContent
      });

      // compose mail content
      var mail = {
        from: Constants.sendFrom,
        to: user.email,
        subject: mailContent.subject,
        html: body
      };
      
      mailer.sendMail(mail, function (error) {
        if (error) {
          console.log(error);
          return;
        }
        mailer.close();
      });
    });
  },

  sendActiveLinkByGmail: function (user, activeLink) {
    var nodemailer = require('nodemailer');
    var hbs = require('nodemailer-express-handlebars');
    //email template setting
    var options = {
      viewEngine: {
        extname: '.hbs',
        layoutsDir: 'views/japtool/email/template',
        defaultLayout: 'template',
        partialsDir: 'views/japtool/email/template/partials/'
      },
      viewPath: 'views/japtool/email/',
      extName: '.hbs'
    };
    var generator = require('xoauth2').createXOAuth2Generator({
      user: Constants.user,
      clientId: Constants.clientId,
      clientSecret: Constants.clientSecret,
      refreshToken: Constants.refreshToken
    });
    var mailer = nodemailer.createTransport(({
      service: 'gmail',
      auth: {
        xoauth2: generator
      }
    }));
    mailer.use('compile', hbs(options));
    //console.log('SMTP Configured');
    // Message object
    var mail = {
      // sender info
      from: 'Japanese Learning Online',
      // Comma separated list of recipients
      to: user.email,
      // Subject of the message
      subject: 'Active Japanese Learning Online Tool Account ✔',
      // setting template for email
      template: 'new',
      //variable pass to template
      context: {
        username: user.username,
        activelink: activeLink
      }
    };
    //console.log('Sending Mail');
    mailer.sendMail(mail, function (error) {
      if (error) {
        console.log('Error occured');
        console.log(error);
        return;
      }
      //console.log('Message sent successfully!');
      // if you don't want to use this transport object anymore, uncomment following line
      mailer.close(); // close the connection pool
    });
  }
}

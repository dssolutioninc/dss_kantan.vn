/**
 * Created by TuyenTV1 on 6/30/2015.
 */
// Constants.js
// defile all Constants of app here
module.exports = {
    // don't allow the total upload size to exceed ~1MB
    upFileMaxBytes: 1000000,
    maxSurveyQuestion: 5,
    maxLibraRs: 30,
    maxLibOnPage: 9,
    passMark: 70,   // 70/100 point is pass
    bookNumOnHome: 3,
    bookNumOnHomeMore: 2,
    templatePath: '/assets/templates/',
    templateFile: 'Template.xlsx',
    xlsxMimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    //Email
    smtpServer: '52.76.88.187',
    smtpPort: 587,
    smtpUser: 'account',
    smtpPass: 'xxxxxxxxxxxxxx',
    sendFrom: 'account@kantan.vn',

    gmailUser: 'yyyyyyyyyyyy',
    gmailPass: 'xxxxxxxx',
    
    user: 'tugigroup@gmail.com',
    clientId: '',
    clientSecret: '',
    refreshToken: ''
    //END EMAIL
};

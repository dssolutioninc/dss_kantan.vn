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
    smtpPass: 'tugi2015',
    sendFrom: 'account@kantan.vn',

    user: 'mrbotno@gmail.com',
    clientId: '109620886904-3i95hnuu084hoc937tnoikl818kd445k.apps.googleusercontent.com',
    clientSecret: 'AG-gp2VZ2Ajgqtx8e3ulUxEA',
    refreshToken: '1/J5mTd_LcpTl01RDN4LNn2TG1H5nchj8iCJK5s8iiVyc'
    //END EMAIL
};

/**
 * Created by DuongTD2 on 7/15/2015.
 */
module.exports = {
    saveResult: function (req, res) {
        var user = req.param('user');
        var bookDetail = req.param('bookDetail');
        var selfLearning = req.param('selfLearning');
        var mark = req.param('mark');
        var finishDate = req.param('finishDate');
        var dataUserTestResult = req.param('dataUserTestResult');
        var jsonDataUserTestResult = JSON.parse(dataUserTestResult);
        // update in userLearnHistory table
        UserLearnHistory.update({
            user: user,
            selfLearning: selfLearning,
            bookDetail: bookDetail
        }, {
            mark: mark,
            finishDate: finishDate
        }).exec(function afterUpdate(err, updated) {
            if (err) {
                return res.send(err);
            }
            //create records userTestResult
        });
        for(var i = 0 ; i < jsonDataUserTestResult.length ; i++){
            UserTestResult.create(
                {
                    user: user,
                    selfLearning: selfLearning,
                    question:jsonDataUserTestResult[i].question,
                    answer:jsonDataUserTestResult[i].answer,
                    result:jsonDataUserTestResult[i].result
                }).exec(function articleCreated(err, resultCreated) {
                    //If there's an error
                    if (err) {
                        req.session.flash = {
                            err: err
                        }
                        return res.send(err);
                    }
                });
        }
    }
};
module.exports = {
    host: sails.config.connections.someMongodbServer.host,
    port: sails.config.connections.someMongodbServer.port,
    name: sails.config.connections.someMongodbServer.database,
    gridfsName: 'media',

    uri: function () {
    	return 'mongodb://' + 
    			(this).host + ':' +
    			(this).port + '/' +
    			(this).name;
    },

    skipperAdapter: function () {
        return require('skipper-gridfs')({
            uri: (this).uri() + '.' + (this).gridfsName
        });
    },

    learningSumary: function(learning, callback) {

        // get lessons list by bookid
        BookDetail.find({where: {bookMaster: learning.bookID}, sort: {sort: 1} }).
        exec(function(err, lessons){

            // console.log('lessons: ' + JSON.stringify(lessons));
            // get learn history of these lessons
            UserLearnHistory.find({where: {user: learning.userID, selfLearning: learning.id}
            }).exec(function(err, learnedLessons){

                // console.log('learnedLessons: ' + JSON.stringify(learnedLessons));
                var lessonList = [];

                lessons.forEach(function(lesson){

                    var learnedInfo = learnedLessons.filter(function(learnedLesson){
                        return learnedLesson.bookDetail == lesson.id;
                    });

                    if (learnedInfo.length > 0){
                        lesson.learnedInfo = learnedInfo[0];
                    }

                    // console.log('lesson.learnedInfo: ' + JSON.stringify(lesson.learnedInfo));

                    lessonList.push(lesson);
                });

                var passedNum = 0;
                var fasledNum = 0;
                var lessonName = "";

                for (var i = 0; i < lessonList.length; ++i){
                    if ( lessonName == lessonList[i].lesson){
                        // console.log('lessonName == lessonList[i].lesson' );

                    } else {
                        // console.log('lessonName != lessonList[i].lesson' );
                        lessonName = lessonList[i].lesson;

                        var subLessons = lessonList.filter(function(les){
                            return les.lesson == lessonName;
                        });

                        // console.log('subLessons.length: ' +  subLessons.length);

                        var allPass = true;
                        var hasHistory = false;
                        subLessons.forEach(function(subLesson){
                            if (!subLesson.learnedInfo){
                                allPass = false;
                            } else {
                                hasHistory = true;

                                // console.log('subLesson.learnedInfo.mark: ' +  subLesson.learnedInfo.mark);
                                if (!subLesson.learnedInfo.mark || subLesson.learnedInfo.mark < Constants.passMark){
                                    allPass = false;
                                }
                            }
                        });

                        if (allPass){
                            passedNum += 1;
                        } else if (hasHistory) {
                            fasledNum += 1;
                        }
                    }
                }

                return callback(err, {passedNum: passedNum, fasledNum:fasledNum});




            });
            
        })

    }   
}
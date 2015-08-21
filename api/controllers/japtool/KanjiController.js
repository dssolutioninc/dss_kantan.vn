/**
 * Created by TuyenTV1 on 7/10/2015.
 */
module.exports = {
    lesson: function (req, res) {
        var extractDataCondition = req.param('condition');
        Kanji.selectByLevel({condition: extractDataCondition}, function (err, kanjis) {
            res.render('japtool/kanji/lesson', {'kanjis': kanjis});
        });
    },

    practice: function (req, res) {
        var extractDataCondition = req.param('condition');
        var CVExtractDataCondition = extractDataCondition.replace('lesson', 'Bài ');
        var arr = CVExtractDataCondition.split(',');
        var lessonn = arr[3];
        sails.log(lessonn);
        Kanji.selectByLevel({condition: extractDataCondition}, function (err, kanjis) {
            if (err) return res.send(err.status);
            var min = 1;
            var max = kanjis.length;
            kanjis.forEach(function (item, index) {
                var randomArr = [];
                for (var i = 0; randomArr.length < 3; i++) {
                    var randomResult = Math.floor(Math.random() * (max - min) + min);
                    if (!(randomArr.indexOf(kanjis[randomResult].hanviet) > -1) && randomResult != index) {
                        randomArr[randomArr.length] = kanjis[randomResult].hanviet;
                    }
                }
                randomArr.push(item.hanviet);
                randomArr.sort();
                //console.log(item.hanviet, randomArr);
                item.randomKanjis = randomArr;
            });
            //Ramdom practice
            kanjis.sort(function () {
                return Math.round(Math.random()) - 0.5;
            });
            res.render('japtool/kanji/practice', {'kanjis': kanjis,'lessonn':lessonn});
        });
    },
    _config: {
        locals: {
            layout: 'layout/layout-japtool'
        }
    }
}

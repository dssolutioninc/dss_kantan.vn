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

        Kanji.selectByLevel({condition: extractDataCondition}, function (err, kanjis) {
            if (err) return res.send(err.status);

            kanjis.forEach(function (kanji, index) {
                var randomIndexes = [];

                // add key index first
                randomIndexes.push(index);

                // add more random index
                while (randomIndexes.length < 4) {
                    var randomIndex = Math.floor( Math.random() * kanjis.length );
                    if ( randomIndexes.indexOf(randomIndex) < 0 && randomIndex != index ) {
                        randomIndexes.push(randomIndex);
                    }
                }

                // change order randomly
                randomIndexes.sort(function () {
                    return Math.round(Math.random()) - 0.5;
                });

                // make options list from random index list
                var options = [], option;
                randomIndexes.forEach(function (i){
                    option = {};
                    option.hanviet = kanjis[i].hanviet;
                    option.description = kanjis[i].description? kanjis[i].description : '';
                    options.push(option);
                })
                // sails.log('options: ' + JSON.stringify(options) );

                kanji.randomKanjis = options;
            });

            // change order randomly
            kanjis.sort(function () {
                return Math.round(Math.random()) - 0.5;
            });

            res.render('japtool/kanji/practice', {'kanjis': kanjis});
        });
    },
    _config: {
        locals: {
            layout: 'layout/layout-japtool'
        }
    }
}

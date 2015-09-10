/**
 * Created by NamMH on 7/29/2015.
 */
module.exports = {

    index: function (req, res) {

        User.count().exec(function (err, userCount) {
            if (err) sails.log(err);
            
            BookMaster.count().exec(function (err, bookCount) {
                if (err) sails.log(err);
                
                Kanji.count().exec(function (err, kanjiCount) {
                    if (err) sails.log(err);
                    
                    Vocabulary.count().exec(function (err, vocabCount) {
                        if (err) sails.log(err);
                         
                        res.view({
                            layout: 'layout/layout-japtool',
                            userCount: userCount,
                            bookCount: bookCount,
                            kanjiCount: kanjiCount,
                            vocabCount: vocabCount
                        });
                    })
                })
            })
        })
    }
}
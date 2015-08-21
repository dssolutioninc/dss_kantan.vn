/**
 * Created by NamMH on 7/29/2015.
 */
module.exports = {
    index: function (req, res) {
        var user;
        var library;
        var group;
        var voca;
        User.count().exec(function (err, u) {
            if (err) {
                user = 0;
            }
            else {
                user = u;
            }
            BookMaster.count().exec(function (err, l) {
                if (err) {
                    library = 0;
                }
                else {
                    library = l
                }
                ChatGroup.count().exec(function (err, g) {
                    if (err) {
                        group = 0;
                    }
                    else {
                        group = g;
                    }
                    Vocabulary.count().exec(function (err, v) {
                        if (err) {
                            voca = 0;
                        }
                        else {
                            voca = v;
                        }
                        res.view({
                            layout: 'layout/layout-japtool',
                            user: user,
                            library: library,
                            group: group,
                            voca: voca
                        });
                    })
                })
            })
        })

    }


}
/**
 * Created by TuyenTV1 on 9/22/2015.
 */
module.exports = {
    index: function (req, res) {
        res.view();
    },
    searchUser: function (req, res, next) {
        var input_info = req.param('input_info');
        User.find({or: [{email: '%' + input_info + '%'}, {username: '%' + input_info + '%'}, {telephone: input_info}]}, function searchUser(err, user) {
            if (err) {
                res.send(400);
            } else {
                res.render('japtool/buddy/list-find-buddy', {
                    userBuddy: user
                });
            }
        });
    },
    addBuddy:function(req,res,next){
        var idUserBuddy = req.param('idUserBuddy');
        var idUser = req.param('idUser');
        sails.log('idUserBuddy',idUserBuddy);
        sails.log('idUser',idUser);
        Buddy.create({user_id:idUserBuddy,buddyOf:idUser}).exec(function(err,user){
            if(err){
                res.send(400);
            }
            res.ok();
        });
    },
    _config: {
        locals: {
            layout: 'layout/layout-japtool'
        }

    }
}

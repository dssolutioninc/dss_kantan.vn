/**
 *
 * * AuthController
 * * @Author: itplusvn
 * * @Created Date: 7/19/2015
 * * @Email: itplusvn@gmail.com
 * * @Skype: stupid_253
 */
module.exports = {
    index:function(req, res){
        res.view();
    },
    _config: {
        locals: {
            layout: 'layout/layout-admin'
        }
    }
};

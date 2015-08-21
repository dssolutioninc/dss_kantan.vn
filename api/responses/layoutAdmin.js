/**
 * Created by TuyenTV1 on 7/1/2015.
 */
module.exports = function(data, options) {
    if(data){
        return this.res.view(data,{layout:'layout/layout-admin'})
    }else{
        return this.res.view(null,{layout:'layout/layout-admin'})
    }

}

/**
 * Created by TuyenTV1 on 7/1/2015.
 */
module.exports = function(data, options) {
    if(data){
        return this.res.view(data,{layout:'layout/layout-japtool'})
    }else{
        return this.res.view(null,{layout:'layout/layout-japtool'})
    }

}

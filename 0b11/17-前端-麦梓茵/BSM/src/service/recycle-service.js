var _ww = require('util/ww.js');

var _recycle = {
    //用户登录
    login : function(userInfo, resolve, reject){
        _ww.request({
            url : _ww.getServerUrl('/admin/login'),
            data : userInfo,
            method : 'POST',
            success : resolve,
            error : reject
        });
    },
    //获取列表
    getInfo : function(resolve, reject){
        _ww.request({
            url : _ww.getServerUrl('/content/showTrashed'),
            method : 'POST',
            success : resolve,
            error : reject
        });
    },
    //删除
    delete : function(contentId, resolve, reject){
        _ww.request({
            url : _ww.getServerUrl('/content/delete'),
            data : {
                contentId:contentId
            },
            method : 'POST',
            success : resolve,
            error : reject
        });
    },
    //恢复
    recycle : function(contentId, resolve, reject){
        _ww.request({
            url : _ww.getServerUrl('/content/restore'),
            data : {
                contentId:contentId
            },
            success : resolve,
            error : reject
        });
    },
}
module.exports = _recycle;
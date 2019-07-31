var _ww = require('util/ww.js');

var _user = {
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
    //检查登录状态
    checkLogin : function(resolve, reject){
        _ww.request({
            url     : _ww.getServerUrl(''),
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    },
    // 登出
    logout : function(resolve, reject){
        _ww.request({
            url     : _ww.getServerUrl('/admin/logout'),
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    },
    info : function(resolve, reject){
        _ww.request({
            url     : _ww.getServerUrl('/admin/info'),
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    }
}
module.exports = _user;
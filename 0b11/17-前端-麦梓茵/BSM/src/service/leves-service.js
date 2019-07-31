var _ww = require('util/ww.js');

var _leve = {
    // 获取列表
    getClassList: function (id, resolve, reject) {
        _ww.request({
            url: _ww.getServerUrl('/group/groupList'),
            data    :  {
                productId: id.productId || '',
                groupId: id.groupId || '',
            },
            success: resolve,
            error: reject
        });
    },
    // 获取产品下一级信息
    getClassDetail: function (productId, resolve, reject) {
        _ww.request({
            url: _ww.getServerUrl(''),
            data: {
                productId: productId
            },
            success: resolve,
            error: reject
        });
    },
    //新建一级分类
    saveClass: function (productInfo, resolve, reject) {
        _ww.request({
            url: _ww.getServerUrl('/group/add'),
            data: productInfo,
            success: resolve,
            error: reject
        });
    },
    //获取分类信息
    getClassInfo: function(Info, resolve, reject){
        _ww.request({
            url: _ww.getServerUrl('/group/show'),
            data: Info,
            success: resolve,
            error: reject
        });
    },
    //删除分类
    deleteClass: function (id, resolve, reject) {
        _ww.request({
            url: _ww.getServerUrl('/group/delete'),
            data: {
                groupId: id
            },
            success: resolve,
            error: reject
        })
    },
    //获取编辑分类信息
    editInfo: function (groupId, resolve, reject) {
        _ww.request({
            url: _ww.getServerUrl('/group/info'),
            data: {
                groupId:groupId
            },
            success: resolve,
            error: reject
        });
    },
    //编辑分类
    update : function(Info, resolve, reject){
        _ww.request({
            url: _ww.getServerUrl('/group/update'),
            data: {
                groupId : Info.groupId,
                groupName : Info.groupName,
                parentId : Info.parentId
            },
            success: resolve,
            error: reject
        });
    }
}
module.exports = _leve;
var _ff = require('util/file.js');
var _ww = require('util/ww.js');

var _content = {
    //上传图片
    uploadimg: function (formData, resolve, reject) {
        _ff.request({
            url: _ff.getServerUrl('/content/sendimg'),
            data: formData,
            success: resolve,
            error: reject
        });
    },
    //获取信息
    getInfo: function (groupId, resolve, reject) {
        _ww.request({
            url: _ww.getServerUrl('/content/getgroupinfo'),
            data: {
                groupId:groupId
            },
            success: resolve,
            error: reject
        });
    },
    //新增文章
    newContent : function(Info, resolve, reject){
        _ww.request({
            url: _ww.getServerUrl('/content/add'),
            data: {
                productId: Info.productId,
                groupId : Info.groupId,
                title : Info.title,
                contentDetail : Info.contentDetail
            },
            method : 'post',
            success: resolve,
            error: reject
        });
    },
    //删除文章
    delect : function(id,resolve, reject){
        _ww.request({
            url: _ww.getServerUrl('/content/softDelete'),
            data: {
                contentId : id
            },
            method : 'post',
            success: resolve,
            error: reject
        });
    },
    //查看文章
    showContent : function(id,resolve, reject){
        _ww.request({
            url: _ww.getServerUrl('/content/contentInfo'),
            data: {
                contentId : id
            },
            success: resolve,
            error: reject
        });
    },
    //更新文章
    updata : function(Info,resolve, reject){
        _ww.request({
            url: _ww.getServerUrl('/content/update'),
            data: {
                contentId: Info.contentId,
                productId: Info.productId,
                groupId : Info.groupId,
                title : Info.title,
                contentDetail : Info.contentDetail
            },
            method : 'post',
            success: resolve,
            error: reject
        });
    },
}
module.exports = _content;
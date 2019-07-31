var _ww = require('util/ww.js');
var _ff = require('util/file.js');

var _product = {
    // 获取产品列表
    getProductList: function (/*listParam,*/ resolve, reject) {
        _ww.request({
            url: _ww.getServerUrl('/product/productList'),
            // data    : listParam,
            success: resolve,
            error: reject
        });
    },
    // 获取产品下一级信息
    getProductDetail: function (productId, resolve, reject) {
        _ww.request({
            url: _ww.getServerUrl(''),
            data: {
                productId: productId
            },
            success: resolve,
            error: reject
        });
    },
    //新建产品
    save: function (formData, resolve, reject) {
        _ff.request({
            url: _ff.getServerUrl('/product/add'),
            data: formData,
            // method : 'POST',
            // enctype: 'multipart/form-data',
            // contentType: false,
            // processData: false,
            success: resolve,
            error: reject
        });
    },
    //删除产品
    deleteProduct: function (productId, resolve, reject) {
        _ww.request({
            url: _ww.getServerUrl('/product/delete'),
            data: {
                productId: productId
            },
            success: resolve,
            error: reject
        })
    },
    //编辑产品
    update: function (productInfo, resolve, reject) {
        _ww.request({
            url: _ww.getServerUrl('/product/update'),
            data: productInfo,
            success: resolve,
            error: reject
        });
    }
}
module.exports = _product;
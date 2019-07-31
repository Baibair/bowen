var _ww = require('util/ww.js');
var _leve = require('service/leves-service.js');
var templateAddressModal = require('./fleve-modal.string');

var fleveModal = {
    show: function (option) {
        // option的绑定
        this.option = option;
        this.option.data = option.data || {};
        this.option.productId = option.productId || 0;
        this.$modalWrap = $('.modal-wrap');
        // 渲染页面
        this.loadModal();
        // 绑定事件
        this.bindEvent();
        // var ii = $(this).parents('.main-table').data('productId');
        // console.log(ii);
    },
    bindEvent: function () {
        var _this = this;
        //提交
        this.$modalWrap.find('.btn-true').click(function () {
            var productInfo = _this.getProductInfo();
            var isUpdate = _this.option.isUpdate;
            //通过验证
            if (productInfo.status && !isUpdate) {
                //上传数据
                productInfo.data.productId = _this.option.productId;
                _leve.saveClass(productInfo.data, function (res) {
                    _ww.successTips('分类添加成功');
                    _this.hide();
                    typeof _this.option.onSuccess === 'function'
                        && _this.option.onSuccess(res);
                }, function (errMsg) {
                    _ww.errorTips(errMsg);
                })
            } else if (isUpdate && productInfo.status) {
                // productInfo.data.productId = _this.option.productId;
                // productInfo.data.productId = _this.option.data.productId;
                productInfo.data.groupId = _this.option.data.groupId;
                _leve.update(productInfo.data, function (res) {
                    _ww.successTips('分类修改成功');
                    _this.hide();
                    typeof _this.option.onSuccess === 'function'
                        && _this.option.onSuccess(res);
                }, function (errMsg) {
                    _ww.errorTips(errMsg);
                })
            } else {
                _ww.errorTips(productInfo.errMsg || '抱歉，出错了！');
            }

        });
        // 保证点击modal内容区的时候，不关闭弹窗
        this.$modalWrap.find('.modal-container').click(function (e) {
            e.stopPropagation();
        });
        // 点击叉号或者蒙版区域，关闭弹窗
        this.$modalWrap.find('.close').click(function (e) {
            _this.hide();
        });
        this.$modalWrap.find('.btn-false').click(function (e) {
            _this.hide();
        });
    },
    loadModal: function () {
        var productModalHtml = _ww.renderHtml(templateAddressModal, {
            isUpdate: this.option.isUpdate,
            data: this.option.data
        });
        this.$modalWrap.html(productModalHtml);
    },
    //获取表单信息，做表单验证
    getProductInfo: function () {
        var productInfo = {},
            result = {
                status: false
            };
        productInfo.groupName = $.trim(this.$modalWrap.find('#fleveName').val());
        if (!productInfo.groupName) {
            result.errMsg = '请输入产品名称';
        }
        else {
            result.status = true;
            if(this.option.isUpdate){
                productInfo.parentId = this.option.productId;
            }
            result.data = productInfo;
        }

        return result;
    },
    hide: function () {
        this.$modalWrap.empty();
    }
};
module.exports = fleveModal;
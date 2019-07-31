var _ww = require('util/ww.js');
var _ff = require('util/file.js');
var _product = require('service/product-service.js');
var templateAddressModal = require('./proadd-modal.string');

var proaddModal = {
    show: function (option) {
        // option的绑定
        this.option = option;
        this.option.data = option.data || {};
        this.$modalWrap = $('.modal-wrap');
        // 渲染页面
        this.loadModal();
        // 绑定事件
        this.bindEvent();
    },
    bindEvent: function () {
        var _this = this;
        //提交
        this.$modalWrap.find('.btn-true').click(function () {
            var productInfo = _this.getProductInfo();
            var isUpdate = _this.option.isUpdate;
            //通过验证
            if (productInfo.status && !isUpdate) {
                var resultFile = document.getElementById("pic").files[0];
                // productInfo.data.productIcon = resultFile;
                var formData = new FormData();
                formData.append("productIcon", resultFile);
                formData.append("productName", productInfo.data.productName);
                formData.append("productInstr", productInfo.data.productInstr);//$( '#uploadForm').serialize()
                //上传数据
                _product.save(/*productInfo.data*/formData, function (res) {
                    _ff.successTips('产品添加成功');
                    _this.hide();
                    typeof _this.option.onSuccess === 'function'
                        && _this.option.onSuccess(res);
                }, function (errMsg) {
                    _ff.errorTips(errMsg);
                })
            } else if (isUpdate && productInfo.status) {
                productInfo.data.productId = _this.option.data.productId;
                _product.update(productInfo.data, function (res) {
                    _ff.successTips('产品修改成功');
                    _this.hide();
                    typeof _this.option.onSuccess === 'function'
                        && _this.option.onSuccess(res);
                }, function (errMsg) {
                    _ff.errorTips(errMsg);
                })
            } else {
                _ff.errorTips(productInfo.errMsg || '抱歉，出错了！');
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
        productInfo.productName = $.trim(this.$modalWrap.find('#productName').val());
        productInfo.productInstr = $.trim(this.$modalWrap.find('#productDes').val());
        var productIcon = $.trim(this.$modalWrap.find('#productIcon').val());
        //  productInfo.productIcon = document.getElementById("pic").files[0];
        if (!productInfo.productName) {
            result.errMsg = '请输入产品名称';
        }
        else if (!productInfo.productInstr) {
            result.errMsg = '请输入产品描述';
        }
        else if (!productIcon) {
            result.errMsg = '请上传产品ICON';
        }
        else {
            result.status = true;
            result.data = productInfo;
            // var formData = new FormData();
            // formData.append("productIcon", '');
            // formData.append("productName", productInfo.productName);
            // formData.append("productInstr", productInfo.productInstr);
            // result.status = true;
            // result.data = formData;
        }

        return result;
    },
    hide: function () {
        this.$modalWrap.empty();
    }
};
module.exports = proaddModal;
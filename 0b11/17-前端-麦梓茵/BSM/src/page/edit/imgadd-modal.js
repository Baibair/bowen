var templateAddressModal = require('./imgadd-modal.string');
var _ww = require('util/ww.js');
var _content = require('service/content-service.js');

var imgaddModal = {
    show: function (option) {
        // option的绑定
        this.option = option;
        this.$modalWrap = $('.modal-wrap');
        // 渲染页面
        this.loadModal();
        // 绑定事件
        this.bindEvent();
    },
    bindEvent: function () {
        var _this = this;
        $(document).on('change', '#pic', function (e) {
            var resultFile = document.getElementById("pic").files[0];
            // console.log(resultFile);

        });
        //提交
        this.$modalWrap.find('.btn-true').click(function () {
            var resultFile = document.getElementById("pic").files[0];
            // productInfo.data.productIcon = resultFile;
            var formData = new FormData();
            formData.append("contentimg", resultFile);
            //上传数据
            _content.uploadimg(formData, function (res) {
                _this.hide();
                typeof _this.option.onSuccess === 'function'
                    && _this.option.onSuccess(res);
            }, function (errMsg) {
                _ff.errorTips(errMsg);
            })

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
        var ModalHtml = _ww.renderHtml(templateAddressModal, {
            data: ''
        });
        this.$modalWrap.html(ModalHtml);
    },
    //获取表单信息，做表单验证
    getInfo: function () {


    },
    hide: function () {
        this.$modalWrap.empty();
    }
};
module.exports = imgaddModal;
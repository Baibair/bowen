var templateAddressModal = require('./view-modal.string');
var _ww = require('util/ww.js');

var viewModal = {
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
            data: this.option
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
module.exports = viewModal;
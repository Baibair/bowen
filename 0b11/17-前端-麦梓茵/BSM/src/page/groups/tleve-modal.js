var _ww = require('util/ww.js');
var _leve = require('service/leves-service.js');
var templateAddressModal = require('./tleve-modal.string');

var tleveModal = {
    show: function (option) {
        // option的绑定
        this.option = option;
        this.option.data = option.data || {};
        this.option.productId = option.productId || 0;
        this.option.Info = option.getInfo;
        this.$modalWrap = $('.modal-wrap');
        // 渲染页面
        this.loadModal();
        // 绑定事件
        this.bindEvent();
    },
    bindEvent: function () {
        var _this = this;
        // 一级分类和二级分类的二级联动
        this.$modalWrap.find('#fgroupName').change(function () {
            var selectedF = $("#fgroupName").find("option:selected").attr("data-id");
            // _this.loadCities(selectedProvince);
            // console.log(selectedF);
            _this.getSecondClass(selectedF);
        });
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
        // if(this.option.isUpdate){
        //     var $fgroupName = this.$modalWrap.find('#fgroupName');
        //     $fgroupName.val(this.option.data.groupName1);
        //     console.log(this.option.data.groupName1);
        // }
        this.getFirstClass();
    },
    //获取表单信息，做表单验证
    getProductInfo: function () {
        var productInfo = {},
            result = {
                status: false
            };
        var FName = $.trim(this.$modalWrap.find('#fgroupName').val());
        var SName = $.trim(this.$modalWrap.find('#sgroupName').val());
        var TName = $.trim(this.$modalWrap.find('#tgroupName').val());
        if (!FName) {
            result.errMsg = '请选择一级分类';
        }
        else if(!SName) {
            result.errMsg = '请选择二级分类';
        }
        else if(!TName) {
            result.errMsg = '请输入三级分类名称';
        }
        else {
            result.status = true;
            var selectedS = $("#sgroupName").find("option:selected").attr("data-id");
            // if(SName == this.option.data.groupName2){
            //     selectedS = this.option.data.groupId2;
            // }
            productInfo.parentId = selectedS;
            productInfo.groupName = TName;
            result.data = productInfo;
        }

        return result;
    },
    hide: function () {
        this.$modalWrap.empty();
    },
    //获取一级分类信息
    getFirstClass: function () {
        _this = this;
        var List1 = [];
        for (var i = 0, length = _this.option.Info.groupList1.length; i < length; i++) {
            var obj = {};
            obj.groupId = _this.option.Info.groupList1[i].groupId;
            obj.groupName = _this.option.Info.groupList1[i].groupName;
            List1.push(obj);
        }
        var $fgroupName = _this.$modalWrap.find('#fgroupName');
        $fgroupName.html(_this.getSelectOption(List1));
        
    },
    //获取二级分类信息
    getSecondClass: function (selectedF) {
        _this = this;
        var List2 = [];
        for (var i = 0, length = _this.option.Info.groupList2.length; i < length; i++) {
            if (selectedF == _this.option.Info.groupList2[i].parentId) {
                var obj = {};
                obj.groupId = _this.option.Info.groupList2[i].groupId;
                obj.groupName = _this.option.Info.groupList2[i].groupName;
                List2.push(obj);
            }
        }
        var $sgroupName = _this.$modalWrap.find('#sgroupName');
        $sgroupName.html(_this.getSelectOption2(List2));
        
    },
    // 获取select框的选项，输入:array，输出: HTML
    getSelectOption: function (optionArray) {
        // var html = '<option value="">请选择</option>';
        // var html = '';
        // if(!this.option.isUpdate){
        //     html = '<option value="请选择"></option>';
        // }
        // for (var i = 0, length = optionArray.length; i < length; i++) {
        //     html += '<option class="opt" value="' + optionArray[i].groupName + '" data-id=' + optionArray[i].groupId + '>' + optionArray[i].groupName + '</option>';
        // }
        // return html;
        var html = '';
        if(!this.option.isUpdate){
            html = '<option value="">请选择</option>';
        }else{
            // html = '<option value="">'+ this.option.data.groupName1 +'</option>';
            html = '<option class="opt" value="' + this.option.data.groupName1 + '" data-id=' + this.option.data.groupId1 + '>' + this.option.data.groupName1 + '</option>';
        }
        for (var i = 0, length = optionArray.length; i < length; i++) {
            if(optionArray[i].groupId != this.option.data.groupId1){
                html += '<option class="opt" value="' + optionArray[i].groupName + '" data-id=' + optionArray[i].groupId + '>' + optionArray[i].groupName + '</option>';
            }
        }
        return html;
    },
    getSelectOption2: function (optionArray) {
        // var html = '<option value="">请选择</option>';
        var html = '';
        if(!this.option.isUpdate){
            html = '<option value="">请选择</option>';
            for (var i = 0, length = optionArray.length; i < length; i++){
                html += '<option class="opt" value="' + optionArray[i].groupName + '" data-id=' + optionArray[i].groupId + '>' + optionArray[i].groupName + '</option>';
            }
        }else{
            // html = '<option value="">'+ this.option.data.groupName1 +'</option>';
            // html = '<option class="opt" value="' + this.option.data.groupName2 + '" data-id=' + this.option.data.groupId2 + '>' + this.option.data.groupName2 + '</option>';
            var html = '<option value="">请选择</option>';
            for (var i = 0, length = optionArray.length; i < length; i++) {
                if(optionArray[i].groupId != this.option.data.groupId2){
                    html += '<option class="opt" value="' + optionArray[i].groupName + '" data-id=' + optionArray[i].groupId + '>' + optionArray[i].groupName + '</option>';
                }
            }
        }
        
        return html;
    },
};
module.exports = tleveModal;
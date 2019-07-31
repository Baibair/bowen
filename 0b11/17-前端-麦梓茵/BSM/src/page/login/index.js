require('./index.css');
var _user = require('service/user-service.js');
var _ww = require('util/ww.js');

// 表单里的错误提示
var formError = {
    show : function(errMsg){
        $('.error-item').show().find('.err-msg').text(errMsg);
    },
    hide : function(){
        $('.error-item').hide().find('.err-msg').text('');
    }
};
var page = {
    init: function () {
        this.bindEvent();
    },
    bindEvent: function () {
        var _this = this;
        // 登录按钮的点击
        $('#submit').click(function () {
            _this.submit();
        });
        // 如果按下回车，也进行提交
        $('.form-control').keyup(function (e) {
            // keyCode == 13 表示回车键
            if (e.keyCode === 13) {
                _this.submit();
            }
        });
    },
    submit: function () {
        var formData = {
            adminName: $.trim($('#username').val()),
            password: $.trim($('#password').val())
        },
            // 表单验证结果
            validateResult = this.formValidate(formData);
        // 验证成功
        if (validateResult.status) {
            _user.login(formData, function (res) {
                console.log('return');
                window.location.href = _ww.getUrlParam('redirect') || './index.html';
            }, function (errMsg) {
                formError.show('用户名或密码错误');
            });
        }
        // 验证失败
        else {
            // 错误提示
            formError.show(validateResult.msg);
        }
    },
    // 表单字段的验证
    formValidate: function (formData) {
        var result = {
            status: false,
            msg: ''
        };
        if (!_ww.validate(formData.adminName, 'require')) {
            result.msg = '用户名不能为空';
            return result;
        }
        if (!_ww.validate(formData.password, 'require')) {
            result.msg = '密码不能为空';
            return result;
        }
        // 通过验证，返回正确提示
        result.status = true;
        result.msg = '验证通过';
        return result;
    }
};
$(function(){
    page.init();
});
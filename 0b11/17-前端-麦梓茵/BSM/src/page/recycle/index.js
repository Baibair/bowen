require('../common/nav/index.js');
require('../common/nav-side/index.js');
require('./index.css');

var _ww = require('util/ww.js');
var _recycle = require('service/recycle-service.js');
var _user = require('service/user-service.js');
var templateIndex = require('./index.string');


var page = {
    data: {
        listParam: {

        },
        userInfo: {}
    },
    init: function () {

        this.onLoad();
        this.bindEvent();
        this.getUserInfo();
    },
    onLoad: function () {
        this.loadList();
    },
    bindEvent: function () {
        var _this = this;
        //删除
        $(document).on('click', '.delete', function () {
            var id = $(this).parents('.main-table').data('id');
            if (window.confirm('确认要永久删除吗？')) {
                _recycle.delete(id,function (res) {
                    _ww.successTips(res.msg);
                }, function (errMsg) {
                    _ww.errorTips(errMsg);
                });
                location.reload();
            }
        });
        //恢复
        $(document).on('click', '.rec', function () {
            var id = $(this).parents('.main-table').data('id');
            if (window.confirm('确认要恢复吗？')) {
                _recycle.recycle(id,function (res) {
                    _ww.successTips(res.msg);
                }, function (errMsg) {
                    _ww.errorTips(errMsg);
                });
                location.reload();
            }
        });
        //退出登录
        $(document).on('click', '#logout', function () {
            if (window.confirm('确认要退出登录吗？')) {
                _user.logout(function (res) {

                }, function (errMsg) {
                    _ww.errorTips(errMsg);
                });
                window.location.href = './login.html';
            }
        })
    },
    //加载产品列表
    loadList: function () {
        var listHtml = '';
        var $pList = $('.main-list');
        _recycle.getInfo(function (res) {
            console.log(res);
            List = res.deletedList;
            listHtml = _ww.renderHtml(templateIndex,{
                list :  List
            });
            $pList.html(listHtml);
        }, function (errMsg) {
            _ww.errorTips(errMsg);
        });
    },
    getUserInfo: function () {
        var _this = this;
        _user.info(function (res) {
            console.log(res);
            _this.data.userInfo.adminName = res.admin.adminName;
            _this.data.userInfo.adminId = res.admin.adminId;
            $('#js-login').css('display', 'none');
            $('.username').text(_this.data.userInfo.adminName);;
            $('.login').css('display', 'inline-block');
        }, function (errMsg) {
            _ww.errorTips(errMsg);
            window.location.href = './login.html';
        });
    },
};
$(function () {
    page.init();
})
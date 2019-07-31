require('../common/nav/index.js');
require('../common/nav-side/index.js');
require('./index.css');
var templateIndex = require('./index.string');
var _ww = require('util/ww.js');
var _product = require('service/product-service.js');
var _user = require('service/user-service.js');
var proaddModal = require('./proadd-modal.js');

var page = {
    data : {
        listParam:{

        },
        userInfo : {}
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

        //产品添加
        $(document).on('click','#pleve',function(){
            proaddModal.show({
                isUpdate : false,
                onSuccess : function(){
                    _this.loadList();
                }
            })
        });
        //产品ICON
        $(document).on('change','#pic',function(e){
            var resultFile = document.getElementById("pic").files[0];
            $('#productIcon').val(resultFile.name);
            
        });
        //删除产品
        $(document).on('click','.delete',function(e){
            var id = $(this).parents('.main-table').data('id');
            if(window.confirm('确认要删除该产品？')){
                _product.deleteProduct(id, function(res){
                    _this.loadList();
                }, function(errMsg){
                    _ww.errorTips(errMsg);
                });
            }
        });
        //编辑产品
        $(document).on('click','.edit',function(e){
            var des = $(this).parents('.main-table').data('des');
            var id = $(this).parents('.main-table').data('id');
            var icon = $(this).parents('.main-table').data('icon');
            var pname = $(this).parents('.main-table').data('pn');
            // console.log(des+id+icon+name);
            var productInfoOld = {
                productInstr : des,
                productId : id,
                productIcon :icon,
                productName : pname
            };
            // console.log(productInfoOld);
            proaddModal.show({
                isUpdate : true,
                data : productInfoOld,
                onSuccess : function(){
                    _this.loadList();
                }
            })
        });
        //查看下一级
        $(document).on('click','.cell-product',function(e){
            var id = $(this).parents('.main-table').data('id');
            window.location.href = './groups.html?productId='+id;
        });
        //退出登录
        $(document).on('click','#logout',function(){
            if(window.confirm('确认要退出登录吗？')){
                _user.logout(function(res){
                     
                },function(errMsg){
                    _ww.errorTips(errMsg);
                });
                window.location.href = './login.html';
            }
        })
    },
    //加载产品列表
    loadList: function () {
        var _this = this;
        var listHtml = '';
        var $pList = $('.main-list');
        // List = _productL.getProducts();
        // listHtml = _ww.renderHtml(templateIndex,{
        //     list :  List
        // });
        // $pList.html(listHtml);
        // 请求接口
        _product.getProductList(function(res){
            List = res.productList;
            // console.log(List);
            listHtml = _ww.renderHtml(templateIndex,{
                list :  List
            });
            $pList.html(listHtml);
        },function(errMsg){
            _ww.errorTips(errMsg);
        });
    },
    getUserInfo : function(){
        var _this = this;
        _user.info(function(res){
            // console.log(res);
            _this.data.userInfo.adminName = res.admin.adminName;
            _this.data.userInfo.adminId = res.admin.adminId;
            $('#js-login').css('display', 'none');
            $('.username').text(_this.data.userInfo.adminName);;
            $('.login').css('display', 'inline-block');
        },function(errMsg){
            _ww.errorTips(errMsg);
            window.location.href = './login.html';
        });
    },
};
$(function () {
    page.init();
})
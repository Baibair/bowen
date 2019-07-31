require('../common/nav/index.js');
require('../common/nav-side/index.js');
require('./index.css');
var _ww = require('util/ww.js');
var _leves = require('service/leves-service.js');
var _content = require('service/content-service.js');
var _user = require('service/user-service.js');
var templateIndex = require('./index.string');
var fleveModal = require('./fleve-modal.js');
var sleveModal = require('./sleve-modal.js');
var tleveModal = require('./tleve-modal.js');
var viewModal = require('../edit/view-modal.js');
var markdown = require('markdown').markdown;

var page = {
    data: {
        productId: _ww.getUrlParam('productId') || '',
        depth: '',
        pId: '',
        parId: '',
        groId: '',
        userInfo : {}
    },
    init: function () {
        this.onLoad();
        this.bindEvent();
        this.getUserInfo();
    },
    onLoad: function () {
        var id = {};
        id.productId = this.data.productId;
        this.loadList(id);
    },
    bindEvent: function () {
        var _this = this;
        //点击进入下一层次
        $(document).on('click', '.cell-product', function (e) {
            var id = {};
            id.groupId = $(this).parents('.main-table').data('id');
            var contentId = $(this).parents('.main-table').data('cid');
            if (contentId) {
                _content.showContent(contentId, function (res) {
                    console.log(res);
                    var view = $('.exp');
                    _this.editor(res.contentInfo.contentDetail, view);
                    var data = {};
                    data.title = res.contentInfo.title;
                    data.html = view.html();
                    viewModal.show(data, function (res) { }, function (errMsg) { });
                }, function (errMsg) {
                    _ww.errorTips(errMsg);
                })
            }
            else {
                // console.log('id.groupId');
                _this.loadList(id);
            }
        });
        //返回上一级
        $(document).on('click', '.return', function (e) {
            // var pid = $(this).parents('.main-table').data('parentId');
            var pid = {};
            if (_this.data.depth == 1) {

                // pid.productId = $(this).parents('.main-table').data('parentId');
                pid.productId = _this.data.pId;
                _this.loadList(pid);
            }
            else if (_this.data.depth == 2) {
                // pid.groupId = $(this).parents('.main-table').data('parentId');
                pid.groupId = _this.data.parId;
                pid.productId = _this.data.pId;
                _this.loadList(pid);
            }
            else if (_this.data.depth == 3) {
                // pid.groupId = $(this).parents('.main-table').data('parentId');
                pid.groupId = _this.data.parId;
                pid.productId = _this.data.pId;
                _this.loadList(pid);
            }
            else {
                window.location.href = './index.html';
            }
            // _this.loadList(pid);
        });
        //新增一级分类
        $(document).on('click', '.fleve', function (e) {
            fleveModal.show({
                isUpdate: false,
                productId: _this.data.pId,
                onSuccess: function () {
                    var pid = {};
                    pid.groupId = _this.data.groId;
                    pid.productId = _this.data.pId;
                    _this.loadList(pid);
                }
            })
        });
        //新建二级分类
        $(document).on('click', '.sleve', function (e) {
            //获取信息
            var Info = {};
            Info.depth = 2;
            Info.productId = _this.data.productId;

            _leves.getClassInfo(Info, function (res) {
                sleveModal.show({
                    isUpdate: false,
                    productId: _this.data.pId,
                    getInfo: res,
                    onSuccess: function () {
                        var pid = {};
                        pid.groupId = _this.data.groId;
                        pid.productId = _this.data.pId;
                        _this.loadList(pid);
                    }
                })
            }, function (errMsg) {
                _ww.errorTips(errMsg);
            })
        });
        //新增三级分类
        $(document).on('click', '.tleve', function (e) {
            //获取信息
            var Info = {};
            Info.depth = 3;
            Info.productId = _this.data.productId;

            _leves.getClassInfo(Info, function (res) {
                tleveModal.show({
                    isUpdate: false,
                    productId: _this.data.pId,
                    getInfo: res,
                    onSuccess: function () {
                        var pid = {};
                        pid.groupId = _this.data.groId;
                        pid.productId = _this.data.pId;
                        _this.loadList(pid);
                    }
                })
            }, function (errMsg) {
                _ww.errorTips(errMsg);
            })
        });
        //新增教程
        $(document).on('click', '.ncont', function (e) {
            var id = _this.data.groId || _this.data.pId;
            //跳转页面
            window.location.href = './edit.html?groupId=' + id;
        });
        //删除
        $(document).on('click', '.delete', function (e) {
            var id = $(this).parents('.main-table').data('id');
            var contentId = $(this).parents('.main-table').data('cid');
            if (contentId) {
                if (window.confirm('确认要删除该教程？')) {
                    _content.delect(contentId, function (res) {
                        var pid = {};
                        pid.groupId = _this.data.groId;
                        pid.productId = _this.data.pId;
                        _this.loadList(pid);
                    }, function (errMsg) {
                        _ww.errorTips(errMsg);
                    });
                }
            } else if (id) {
                if (window.confirm('确认要删除该分类？')) {
                    _leves.deleteClass(id, function (res) {
                        var pid = {};
                        pid.groupId = _this.data.groId;
                        pid.productId = _this.data.pId;
                        _this.loadList(pid);
                    }, function (errMsg) {
                        _ww.errorTips(errMsg);
                    });
                }
            }

        });
        //编辑产品
        $(document).on('click', '.edit', function (e) {
            var id = $(this).parents('.main-table').data('id');
            var contentId = $(this).parents('.main-table').data('cid');
            // console.log(id);
            if (contentId) {
                //跳转页面
                window.location.href = './edit.html?contentId=' + contentId + '&groupId=' + id;
            }
            else if (id) {
                _leves.editInfo(id, function (res) {
                    // console.log(res);
                    var groupIfo = res.groupIfo;
                    //编辑二级分类
                    if (groupIfo.depth == 2) {
                        var groupList = {};
                        groupList.groupList1 = res.groupList1;
                        sleveModal.show({
                            isUpdate: true,
                            // productId: _this.data.pId,
                            data: groupIfo,
                            getInfo: groupList,
                            onSuccess: function () {
                                var pid = {};
                                pid.groupId = _this.data.groId;
                                pid.productId = _this.data.pId;
                                _this.loadList(pid);
                            }
                        })
                    } else if (groupIfo.depth == 3) {
                        var groupList = {};
                        groupList.groupList1 = res.groupList1;
                        groupList.groupList2 = res.groupList2;
                        tleveModal.show({
                            isUpdate: true,
                            // productId: _this.data.pId,
                            data: groupIfo,
                            getInfo: groupList,
                            onSuccess: function () {
                                var pid = {};
                                pid.groupId = _this.data.groId;
                                pid.productId = _this.data.pId;
                                _this.loadList(pid);
                            }
                        })
                    } else if (groupIfo.depth == 1) {
                        var groupList = {};
                        // groupList.groupList1 = res.groupList1;
                        fleveModal.show({
                            isUpdate: true,
                            // productId: _this.data.pId,
                            data: groupIfo,
                            // getInfo: groupList,
                            onSuccess: function () {
                                var pid = {};
                                pid.groupId = _this.data.groId;
                                pid.productId = _this.data.pId;
                                _this.loadList(pid);
                            }
                        })
                    }
                }, function (errMsg) {
                    _ww.errMsg(errMsg);
                });
            }
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
    loadList: function (id) {
        var _this = this;
        var listHtml = '';
        var listHtmlc = '';
        var $pList = $('.main-list-g');
        var $cList = $('.main-list-c');
        // var id = this.data.productId;
        // 请求接口
        _leves.getClassList(id, function (res) {
            // console.log(res.groupIfo.childGroupList);

            _this.data.depth = res.groupIfo.depth;
            _this.data.pId = res.groupIfo.productId;
            _this.data.parId = res.groupIfo.parentId;
            _this.data.groId = res.groupIfo.groupId;
            // console.log(res);
            // console.log(res.groupIfo.depth);
            // console.log(res.groupIfo.source);
            //修改索引和新增键
            if (res.groupIfo.depth > 0) {
                $('.index-text').text(res.groupIfo.source);
                if (res.groupIfo.depth == 1) {
                    $('.sleve').css('display', 'inline-block');
                    $('.fleve').css('display', 'none');
                    $('.tleve').css('display', 'none');
                } else if (res.groupIfo.depth == 2) {
                    $('.tleve').css('display', 'inline-block');
                    $('.fleve').css('display', 'none');
                    $('.sleve').css('display', 'none');
                }
                else if (res.groupIfo.depth == 3) {
                    $('.tleve').css('display', 'none');
                    $('.fleve').css('display', 'none');
                    $('.sleve').css('display', 'none');
                }
            } else {
                $('.index-text').text(res.groupIfo.source.productName);
                $('.fleve').css('display', 'inline-block');
                $('.sleve').css('display', 'none');
                $('.tleve').css('display', 'none');
            }
            List = res.groupIfo.childGroupList;
            listHtml = _ww.renderHtml(templateIndex, {
                list: List
            });
            $pList.html(listHtml);

            Listc = res.groupIfo.contentList;
            listHtmlc = _ww.renderHtml(templateIndex, {
                list: Listc
            });
            $cList.html(listHtmlc);

        }, function (errMsg) {
            _ww.errorTips(errMsg);
        });
        // console.log(this.data.productId);
    },
    editor: function (input, preview) {
        // converter = new showdown.Converter();
        // preview.html(converter.makeHtml(input.val()));
        preview.html(markdown.toHTML(input));
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
        });
    }
};
$(function () {
    page.init();
})
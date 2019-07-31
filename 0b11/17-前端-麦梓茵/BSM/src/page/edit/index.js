require('../common/nav/index.js');
require('../common/nav-side/index.js');
require('./index.css');
var _ww = require('util/ww.js');
var _content = require('service/content-service.js');
var _user = require('service/user-service.js');
var imgaddModal = require('./imgadd-modal.js');
var viewModal = require('./view-modal.js');
// var showdown = require('showdown');
var markdown = require('markdown').markdown;


var page = {
    data: {
        groupId: _ww.getUrlParam('groupId') || '',
        contentId: _ww.getUrlParam('contentId') || '',
        groupIfo: {},
        listIfo: [],
        userInfo : {}
    },
    init: function () {
        this.onLoad();
        this.bindEvent();
        this.getUserInfo();
    },
    onLoad: function () {
        _this = this;
        _content.getInfo(this.data.groupId, function (res) {
            console.log(res);
            _this.data.groupIfo = res.groupIfo;
            _this.data.listIfo = res.listIfo;
            var $chose = $('.edit-class-chose');
            $chose.html(_this.getSelectOption(_this.data.listIfo));
        }, function (errMsg) {
            _ww.errorTips(errMsg);
        });
        if (_this.data.contentId) {
            _content.showContent(_this.data.contentId, function (res) {
                // console.log(res);
                _this.putContent(res.contentInfo.title, res.contentInfo.contentDetail);
            }, function (errMsg) {
                _ww.errorTips(errMsg);
            })
        }
    },
    bindEvent: function () {
        var _this = this;
        var $text = $('.text');
        //保存按钮的点击
        $('#save').click(function () {
            _this.submit();
        });
        // 如果按下回车，也进行提交
        // $('.form-control').keyup(function (e) {
        //     // keyCode == 13 表示回车键
        //     if (e.keyCode === 13) {
        //         _this.submit();
        //     }
        // });
        $text.keyup(function (e) {
            var text = $('.text'),
                view = $('.view');
            _this.editor(text, view);
        });
        $text.focus(function (e) {
            var text = $('.text'),
                view = $('.view');
            _this.editor(text, view);
        });
        //工具栏
        $(document).on('click', '#undo', function (e) {
            var aa = document.execCommand("undo", false, null);
            console.log(aa);//若log输出true说明点击按钮后按钮生效；
        });
        $(document).on('click', '#redo', function (e) {
            var aa = document.execCommand("redo", false, null);
            console.log(aa);//若log输出true说明点击按钮后按钮生效；
        });
        $(document).on('click', '#bold', function (e) {
            _this.insertAtCursor(document.getElementById('text-input'), '****', 2);
        });
        $(document).on('click', '#chain', function (e) {
            _this.insertAtCursor(document.getElementById('text-input'), '[超链接名](超链接地址)', 1);
        });
        $(document).on('click', '#italic', function (e) {
            _this.insertAtCursor(document.getElementById('text-input'), '**', 1);
        });
        $(document).on('click', '#underline', function (e) {
            _this.insertAtCursor(document.getElementById('text-input'), '<u></u>', 4);
        });
        $(document).on('click', '#h1', function (e) {
            _this.insertAtCursor(document.getElementById('text-input'), '# ', 0);
        });
        $(document).on('click', '#h2', function (e) {
            _this.insertAtCursor(document.getElementById('text-input'), '## ', 0);
        });
        $(document).on('click', '#h3', function (e) {
            _this.insertAtCursor(document.getElementById('text-input'), '### ', 0);
        });
        $(document).on('click', '#h4', function (e) {
            _this.insertAtCursor(document.getElementById('text-input'), '#### ', 0);
        });
        $(document).on('click', '#tab', function (e) {
            _this.insertAtCursor(document.getElementById('text-input'), '    ', 0);
        });
        $(document).on('click', '#image', function (e) {

            imgaddModal.show({
                onSuccess: function (res) {
                    // console.log(res.imgSource);
                    var imgurl;
                    imgurl = res.imgSource;
                    var url = '![图片alt](http://192.168.43.80/eohelp/public/' + imgurl + ')';
                    _this.insertAtCursor(document.getElementById('text-input'), url, 0);
                }
            });

        });
        //返回教程列表
        $(document).on('click', '.returnCourse', function () {
            var _this = this;
            var contentTiele = $.trim($('.edit-title-content').val());
            var contentValue = $.trim($('#text-input').val());
            if (contentTiele || contentValue) {
                if (window.confirm('尚未保存，是否离开？')) {
                    window.location.href = './index.html';
                }
            }else{
                window.location.href = './index.html';
            }
            
        });
        //浏览
        $(document).on('click', '.fa-expand', function () {
            var data = {};
            data.title = $('.edit-title-content').val();
            data.html = $('#preview').html();
            viewModal.show(data, function (res) { }, function (errMsg) { });
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
    submit: function () {
        var contentTiele = $.trim($('.edit-title-content').val());
        var contentValue = $.trim($('#text-input').val());
        var selectedS = $(".edit-class-chose").find("option:selected").attr("data-id");
        var productId = this.data.groupIfo.productId;
        // console.log(selectedS);
        if (!contentTiele) {
            _ww.errorTips('请输入标题');
        }
        else if (!contentValue) {
            _ww.errorTips('请输入正文内容');
        }
        else if (!selectedS) {
            _ww.errorTips('请选择分类');
        }
        else {
            var Info = {};
            Info.productId = productId;
            Info.groupId = selectedS;
            Info.title = contentTiele;
            Info.contentDetail = contentValue;
            if(_this.data.contentId){
                Info.contentId = _this.data.contentId
                if (window.confirm('是否保存操作？')) {
                    _content.updata(Info, function (res) {
                        _ww.successTips(res.msg);
                    }, function (errMsg) {
                        _ww.errorTips(errMsg.msg);
                    })
                    window.location.href = './index.html';
                }
               
            }else{
                if (window.confirm('是否保存操作？')) {
                    _content.newContent(Info, function (res) {
                        _ww.successTips(res.msg);
                    }, function (errMsg) {
                        _ww.errorTips(errMsg.msg);
                    })
                    window.location.href = './index.html';
                }
                
            }  
        }
    },
    editor: function (input, preview) {
        // converter = new showdown.Converter();
        // preview.html(converter.makeHtml(input.val()));
        preview.html(markdown.toHTML(input.val()));
    },
    //插入,markdown语法
    insertAtCursor: function (myField, myValue, num) {
        //IE 浏览器
        if (document.selection) {
            myField.focus();
            sel = document.selection.createRange();
            sel.text = myValue;
            sel.moveEnd('**', 2);
            sel.select();
        }

        //FireFox、Chrome等
        else if (myField.selectionStart || myField.selectionStart == '0') {
            var startPos = myField.selectionStart;
            var endPos = myField.selectionEnd;

            // 保存滚动条
            var restoreTop = myField.scrollTop;
            myField.value = myField.value.substring(0, startPos) + myValue + myField.value.substring(endPos, myField.value.length);

            if (restoreTop > 0) {
                myField.scrollTop = restoreTop;
            }

            myField.focus();
            myField.selectionStart = startPos + myValue.length - num;
            myField.selectionEnd = startPos + myValue.length - num;
        } else {
            myField.value += myValue;
            myField.focus();
        }
    },
    // 获取select框的选项，输入:array，输出: HTML
    getSelectOption: function (optionArray) {
        var html = '';

        // html = '<option value="">'+ this.option.data.groupName1 +'</option>';
        html = '<option class="opt" value="' + this.data.groupIfo.groupName + '" data-id=' + this.data.groupIfo.groupId + '>' + this.data.groupIfo.groupName + '</option>';
        for (var i = 0, length = optionArray.length; i < length; i++) {
            if (optionArray[i].groupId != this.data.groupIfo.groupId) {
                html += '<option class="opt" value="' + optionArray[i].groupName + '" data-id=' + optionArray[i].groupId + '>' + optionArray[i].groupName + '</option>';
            }
        }
        return html;
    },
    //回填md数据
    putContent: function (title, content) {
        $('.edit-title-content').val(title);
        $('#text-input').val(content);
    },
    getUserInfo : function(){
        var _this = this;
        _user.info(function(res){
            console.log(res);
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
});
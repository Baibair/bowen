require('./index.css');

var navSide = {
    init : function(){
        this.bindEvent();
        this.loadUserInfo();
        return this;
    },
    bindEvent : function(){
        $(document).on('click', '.trash', function (e) {
            //跳转页面
            window.location.href = './recycle.html';
        });
        $(document).on('click', '.list', function (e) {
            //跳转页面
            window.location.href = './index.html';
        });
    },
    loadUserInfo : function(){

    },
};
$(function(){
    navSide.bindEvent();
})
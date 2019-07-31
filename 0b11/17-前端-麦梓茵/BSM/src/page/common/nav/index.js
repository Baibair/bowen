require('./index.css');

var nav = {
    init : function(){
        this.bindEvent();
        this.loadUserInfo();
        return this;
    },
    bindEvent : function(){
        $('#shrink-btn').click(function(){
            if($('#sidebar').css('display')=='none'){
                $('#sidebar').show();
                $('#logo').show();
                $('.space-name').text('收缩');
                $('.move').css({'left':'280px'});
            }
            else{
                $('#logo').hide();
                $('#sidebar').hide();
                $('.space-name').text('展开');
                $('.move').css({'left':'150px'});
                
            }
        });
    },
    loadUserInfo : function(){

    },
};
$(function(){
    nav.bindEvent();
})
// module.exports = nav.init();

var Hogan = require('hogan.js');
var conf = {
    serverHost : ''
};
var _ww = {
     // 网络请求
    request : function(param){
        var _this = this;
        $.ajax({
            type        : param.method  || 'get',
            url         : param.url     || '',
            dataType    : param.type    || 'json',
            data        : param.data    || '',
            // processData : param.processData || true,
            // contentType : param.contentType  || 'application/x-www-form-urlencoded; charset=UTF-8',
            success     : function(res){
                // 请求成功
                if('0000' === res.statusCode){
                    console.log('ok');
                    typeof param.success === 'function'&& param.success(res.data, res.msg);
                }
                // 没有登录状态，需要强制登录
                else if(10 === res.statusCode){
                    _this.doLogin();
                }
                // 请求数据错误
                else if("0002" === res.statusCode){
                    console.log('no');
                    typeof param.error === 'function' && param.error(res.msg);
                }
                //数据已存在
                else if("0004" === res.statusCode){
                    console.log('no');
                    typeof param.error === 'function' && param.error("数据已存在");
                }
                //系统错误
                else if("0001" === res.statusCode){
                    typeof param.error === 'function' && param.error(res.msg);
                }
            },
            error       : function(err){
                console.log('err');
                typeof param.error === 'function' && param.error(err.statusText);
            }
        });
    },
    // 获取服务器地址
    getServerUrl : function(path){
        return conf.serverHost + path;
    },
    // 获取url参数
    getUrlParam : function(name){
        var reg     = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
        var result  = window.location.search.substr(1).match(reg);
        return result ? decodeURIComponent(result[2]) : null;
    },
    // 渲染html模板
    renderHtml : function(htmlTemplate, data){
        var template    = Hogan.compile(htmlTemplate),
            result      = template.render(data);
        return result;
    },
    // 成功提示
    successTips : function(msg){
        alert(msg || '操作成功！');
    },
    // 错误提示
    errorTips : function(msg){
        alert(msg || '操作失败！');
    },
    // 字段的验证
    validate : function(value, type){
        var value = $.trim(value);
        // 非空验证
        if('require' === type){
            return !!value;
        }
    },
    // 统一登录处理
    doLogin : function(){
        window.location.href = './login.html?redirect=' + encodeURIComponent(window.location.href);
    },
    goHome : function(){
        window.location.href = './index.html';
    }
};
module.exports = _ww;
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');

//环境变量配置，dev / online
var WEBPACK_ENV = process.env.WEBPACK_ENV || 'dev';
console.log(WEBPACK_ENV);

//获取html-webpack-plugin参数的方法
var getHtmlConfig = function(name,title){
    return {
        template : './src/view/'+ name +'.html',
        filename : 'view/'+ name +'.html',
        title    : title,
        inject   : true,
        hash     : true,
        chunks   : ['common',name]
    }
}

var config = {
    entry:{
        'common':['./src/page/common/index.js'],
        'index':['./src/page/index/index.js'],
        'groups':['./src/page/groups/index.js'],
        'login':['./src/page/login/index.js'],
        'edit':['./src/page/edit/index.js'],
        'recycle':['./src/page/recycle/index.js'],
    },
    output:{
        path:__dirname +'./dist',
        publicPath : '/dist',
        filename:'js/[name].js'
    },
    externals:{
        'jquery':'window.jQuery'
    },
    module : {
        loaders:[
            {test: /\.css$/,loader: ExtractTextPlugin.extract("style-loader","css-loader")},
            {test: /\.(gif|png|jpg|woff|svg|eot|ttf)\??.*$/,loader: 'url-loader?limit=100&name=resource/[name].[ext]'},
            {test: /\.string$/,loader: 'html-loader'}
        ]
    },
    resolve : {
        alias : {
            util : __dirname + '/src/util',
            node_modules : __dirname + '/node_modules',
            page : __dirname + '/src/page',
            image: __dirname + '/src/image',
            service:__dirname + '/src/service',
        }
    },
    devServer: {
        port: 8088,
        inline: true,
        proxy : {
            '**/*' : {
                target: 'http://192.168.43.80/eohelp/public',
                changeOrigin : true
            }
        }
    },
    plugins : [
        //独立通用模块到js/base.js
        new webpack.optimize.CommonsChunkPlugin({
            name : 'common',
            filename : 'js/base.js'
        }),
        //把css单独打包到文件里
        new ExtractTextPlugin("css/[name].css"),
        //html模块的处理
        new HtmlWebpackPlugin(getHtmlConfig('index','产品页')),
        new HtmlWebpackPlugin(getHtmlConfig('login','登录')),
        new HtmlWebpackPlugin(getHtmlConfig('groups','分类页')),
        new HtmlWebpackPlugin(getHtmlConfig('edit','编辑')),
        new HtmlWebpackPlugin(getHtmlConfig('groups','分类页')),
        new HtmlWebpackPlugin(getHtmlConfig('recycle','回收站')),
    ]
};
if('dev'==WEBPACK_ENV){
    config.entry.common.push('webpack-dev-server/client?http://localhost:8088/');
}
module.exports = config;
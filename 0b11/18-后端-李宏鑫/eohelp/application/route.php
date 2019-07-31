<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006~2018 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: liu21st <liu21st@gmail.com>
// +----------------------------------------------------------------------
use think\Route;

Route::rule('admin/login','admin/admin/login');
Route::rule('admin/register','admin/admin/register');
Route::rule('admin/logout','admin/admin/logout');
Route::rule('admin/info','admin/admin/adminIfo');

Route::rule('product/add','admin/product/addProduct');
Route::rule('product/delete','admin/product/deleteProduct');
Route::rule('product/productList','index/product/productList');
Route::rule('product/update','admin/product/updateProduct');

Route::rule('group/groupList','admin/product/getGroupIfo');
Route::rule('group/add','admin/product/addGroup');

Route::rule('group/update','admin/product/updateGroup');
Route::rule('group/show','admin/product/getGroupListByDepth');
Route::rule('group/update','admin/product/updateGroup');
Route::rule('group/delete','admin/product/deleteGroup');
Route::rule('group/info','admin/product/updateIfo');

Route::rule('content/byProduct','index/content/getProductIfo');
Route::rule('content/sendimg','admin/content/getContentImg');
Route::rule('content/getGroupInfo','admin/content/addContetnIfo');
Route::rule('content/add','admin/content/addContent');
Route::rule('content/hotQuestion','index/content/getHotQuestion');
Route::rule('content/softDelete','admin/content/softDelete');
Route::rule('content/contentInfo','admin/content/contentInfo');
Route::rule('content/showTrashed','admin/content/showTrashed');
Route::rule('content/delete','admin/content/delete');
Route::rule('content/restore','admin/content/restore');
Route::rule('content/update','admin/content/updateContent');
return [

    '__pattern__' => [
        'name' => '\w+',
    ],
    '[hello]'     => [
        ':id'   => ['index/hello', ['method' => 'get'], ['id' => '\d+']],
        ':name' => ['index/hello', ['method' => 'post']],
    ],

];

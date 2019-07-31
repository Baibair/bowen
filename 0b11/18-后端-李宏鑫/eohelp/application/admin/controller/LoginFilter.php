<?php
/**
 * Created by PhpStorm.
 * User: 86159
 * Date: 2019/7/17
 * Time: 16:23
 */

namespace app\admin\controller;

use think\Controller;
use think\Session;

/*
 * 有关管理员操作的过滤器
 * 额外有检测管理员是否登录的功能
 */
class LoginFilter extends Controller
{
    protected function _initialize() {
        Session::start();

        header('Access-Control-Allow-Origin:*');
        if(!Session::get('admin'))
        exit (json_encode(['statusCode'=>'0002']));
    }
}
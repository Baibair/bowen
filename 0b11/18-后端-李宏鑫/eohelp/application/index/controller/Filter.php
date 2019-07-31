<?php
/**
 * Created by PhpStorm.
 * User: 86159
 * Date: 2019/7/17
 * Time: 17:41
 */

namespace app\index\controller;
use think\Controller;
use think\Session;
class Filter extends controller
{
    protected function _initialize() {
        

        header('Access-Control-Allow-Origin:*');

    }
}
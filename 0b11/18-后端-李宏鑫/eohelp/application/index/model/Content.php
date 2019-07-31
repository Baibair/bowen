<?php
/**
 * Created by PhpStorm.
 * User: 86159
 * Date: 2019/7/13
 * Time: 15:41
 */

namespace app\index\model;
use think\Model;
use traits\model\SoftDelete;
class content extends Model
{
    //使用软删除，可以恢复文章
    use SoftDelete;
    protected $deleteTime = 'deleteTime';
}
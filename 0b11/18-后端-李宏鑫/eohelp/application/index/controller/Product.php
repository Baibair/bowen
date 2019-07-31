<?php
/**
 * Created by PhpStorm.
 * User: 86159
 * Date: 2019/7/15
 * Time: 15:12
 */

namespace app\index\controller;
use app\index\model\Product as ProductModel;
use think\Exception;
use think\Request;
use app\index\controller\Filter;
use think\Db;

class Product extends Filter
{

    /*
     * 返回产品列表
     */
    public function productList(){
        try{
            $product = new ProductModel();
            $list = $product->select();
            foreach ($list as &$product){
                $product['productIcon'] = '/static/productIcon/'.$product['productIcon'];//数据库中的图片名转为路径
            }

            echo json_encode(['data'=>['productList'=>$list,'msg'=>'获取成功'],'statusCode'=>'0000']);
        }catch(Exception $e){
            exit(json_encode(['statusCode'=>'0001','data'=>['msg'=>'系统错误']]));
        }
    }



}
<?php
/**
 * Created by PhpStorm.
 * User: 86159
 * Date: 2019/7/13
 * Time: 15:52
 */

namespace app\index\controller;
use app\index\model\Content as ContentModel;
use think\Exception;
use think\Request;
use think\Db;
use app\extra\util;
use think\response\Json;
use think\Session;
use app\index\controller\Filter;

class Content extends Filter
{


    public function show(){
        $content = new ContentModel;
        $list = $content->select();
        dump($list);
    }
    /*
     * 软删除、将文章隐藏起来
     * 输入 id（必须）
     * 输出 是否操作成功
     */
    public function softDelete(){
        try{
            $request = Request::instance();
            $id = $_REQUEST['id'];
            $content = new ContentModel();
            $res = ContentModel::destroy((int)$id);
            echo $res;
        }catch (Exception $e){
            exit(json_encode(['statusCode'=>'0001']));
        }

    }

    public function showTrashed(){
        $res = ContentModel::onlyTrashed()->select();
        echo(json_encode(['statusCode'=>'0000','deletedList'=>$res]));
    }

    public function likeContent(){
        try{
            $content = new ContentModel();
            $id = $_REQUEST['id'];
            $res = $content->where('contentId',(int)$id)->setInc('like');
            return $res;
        }catch (Exception $e){
            exit(json_encode(['statusCode'=>'0001']));
        }

    }

    public function dislikeContent(){
        try{
            $content = new ContentModel();
            $id = $_REQUEST['id'];
            $res = $content->where('contentId',(int)$id)->setInc('dislike');
            return $res;
        }catch (Exception $e){
            exit(json_encode(['statusCode'=>'0001']));
        }

    }


    public function contentDetail(Request $request){
        try{
            $groupid = (int)$request->get('groupId');
            $info = util::groupInfo($groupid);
            echo json_encode(['statusCode'=>'0000','data'=>$info]);
        }catch (Exception $exception){
            exit(json_encode(['statusCode'=>'0001','data'=>['msg'=>'系统错误']]));
        }
    }
    /*
     * 通过产品获取文章列表
     * 输入产品id
     * 输出相关文章基本信息以及层级引导
     */
//    public function contentListByProduct(){
//
//        try {
//            $productId = (int)$_REQUEST['productId'];
//            $currentPage = (int)$_REQUEST['currentPage'];
//            if ($currentPage <= 0) {
//                exit('页码错误');
//            }
//            if (!isset($_REQUEST['pageSize'])) {
//                $pageSize = 5;
//            } else {
//                $pageSize = (int)$_REQUEST['pageSize'];
//            }
//            $sql = '';
//            $list = Db::name('content t1')->join('eo_product t2', 't2.productId = t1.productId')
//                ->field("t1.productId,t1.groupId,t1.setupTime,t1.updateTime,t2.productName,t1.`like`,t1.dislike,t1.title,left(t1.contentDetail,10) as partDetail,
//                            concat_ws('>',t2.productName,concat('>',getpath(groupId),title)) as source")
//                ->where('t1.productId', $productId)
//                ->page($currentPage, $pageSize)
//                ->select();
//            $count = Db::name('content')->count('contentId');
//            //   foreach($list as &$row){
//
//            //       $productName = Db::name('product')->where('product_id',$row['productId'])->field('product_name as productName')->find();
//            //            $presource = Db::query('select ');
//            //            $row['source'] = $path = $productName['productName'].'>'.$presource[0]['source'].$row['title'];
//
//            //  }
//            // echo $list[0]['source'];
//            // echo $list[1]['source'];
//            $contentResult['totalPage'] = (int)ceil($count / $pageSize);
//            $contentResult['contentList'] = $list;
//            $contentResult['statusCode'] = 0000;
//            //dump($contentResult);
//            echo json_encode($contentResult);
//        }catch (Exception $e){
//            echo json_encode(['statusCode'=>'0001']);
//        }
//
//    }

/*
 * 传入 产品id
 * 输出 产品直接关联的文章，以及该产品下的分类。
 */
    public function getProductIfo(Request $request){
        try{
            $proid = $request->get('productId');
            $productIfo['contentList'] =  util::getContentByProductId($proid);
            $groupList = util::getGroupByProductId($proid);
            foreach ($groupList as &$group){
                $contentList = util::getContentByGroupId($group['groupId']);
                $group['contentList'] = $contentList;
            }
            $productIfo['groupList'] = $groupList;
            $productIfo['statusCode'] = '0000';
            echo json_encode($productIfo);
            // dump($productIfo);
        }catch (Exception $e){
            echo json_encode(['statusCode'=>'0001']);
        }
    }

//    public function getContentByKey(Request $request){
//      //  try{
//            $key = $_REQUEST['key'];
//            if(!isset($_REQUEST['currentPage'])){
//                $currentPage = 1;
//            }else {
//                $currentPage = (int)$_REQUEST['currentPage'];
//            }
//           // $currentPage = (int)$_REQUEST['currentPage'];
//            if($currentPage <=0){
//                exit(json_encode(['statusCode'=>'0003']));
//            }
//            if(!isset($_REQUEST['pageSize'])){
//                $pageSize = 5;
//            }else {
//                $pageSize = (int)$_REQUEST['pageSize'];
//            }
//
//            $result = util::contentListByKey($key,$currentPage,$pageSize);
//            echo json_encode($result);
////        }catch (Exception $e){
////            exit(json_encode(['statusCode'=>'0001']));
////        }
//
//    }
    /*
     * 通过关键词搜索文章
     */
    public function getContentListbyKey(){
        try{
            $request = Request::instance();
            $key = $request->get('keyword');

            if(!$currentPage =$request->get('currentPage')){
                $currentPage = 1;
            }
            if(!$pageSize =$request->get('pageSize')){
                $pageSize = 10;
            }
            if($key!=null){//因为没有办法用数据库函数排序，所以只能写了原生sql语句
                $contentList = Db::query("select t1.productId,t1.groupId,t1.setupTime,t1.updateTime,
                t2.productName,t1.`like`,t1.dislike,t1.title,t1.view,
                left(t1.contentDetail,15) as partDetail,
                concat_ws('>',t2.productName,concat(getpath(t1.groupId),title)) as source 
                from eo_content t1 left join eo_product t2 on t1.productId = t2.productId
                where contentDetail like '%".$key."%' or title like '%".$key."%' and isnull(t1.deleteTime) order by reg_count('".$key."', t1.contentId) desc
                 limit ".($currentPage-1)*$pageSize.",".$pageSize);
                util::contentUtil($contentList);//用工具处理文章列表
                $productList = util::productListByKey($contentList);//同时获取带有关键词数量的产品列表
                //  dump($contentList);
                echo json_encode(['statusCode'=>'0000','data'=>['contentList'=>$contentList,'productListWithCount'=>$productList]]);
            }
        }catch (Exception $e){
            exit(json_encode(['statusCode'=>'0001']));
        }


    }
    /*
     * 前6的
     */
    public function getHotQuestion(){
        try{
            $hotlist = Db::name('content')->field('contentId,title')->order('view')
                ->where('type',1)->limit(6)->select();
            echo json_encode(['statusCode'=>'0000','data'=>['hotQuestion'=>$hotlist]]);
        }catch (Exception $e){
            exit(json_encode(['statusCode'=>'0001']));
        }
    }




}
<?php
/**
 * Created by PhpStorm.
 * User: 86159
 * Date: 2019/7/13
 * Time: 15:52
 */

namespace app\admin\controller;
use app\index\model\Content as ContentModel;
use think\Exception;
use think\Request;
use think\Db;
use app\extra\util;
use  app\admin\controller\LoginFilter;
class Content extends LoginFilter
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
    public function softDelete(Request $request){
        try{
            $id = $request->post('contentId');
            $content = new ContentModel();
            $res = ContentModel::destroy((int)$id);
            if($request){
                echo json_encode(['statusCode'=>'0000','data'=>['msg'=>'删除成功']]);
            }else{
                echo json_encode(['statusCode'=>'0005','data'=>['msg'=>'删除失败']]);
            }
        }catch (Exception $e){
            exit(json_encode(['statusCode'=>'0001','data'=>['msg'=>'系统错误']]));
        }
    }


    /*
     * 正式删除
     *
     */
    public function delete(Request $request){
        try{
            $id = $request->post('contentId');
            $content = new ContentModel();
            $res = ContentModel::destroy((int)$id,true);
            if($request){
                echo json_encode(['statusCode'=>'0000','data'=>['msg'=>'删除成功']]);
            }else{
                echo json_encode(['statusCode'=>'0005','data'=>['msg'=>'删除失败']]);
            }
        }catch (Exception $e){
            exit(json_encode(['statusCode'=>'0001','data'=>['msg'=>'系统错误']]));
        }
    }
    /*
     * 回收站
     */
    public function showTrashed(){
        try{
            $res = ContentModel::onlyTrashed()->field('contentId,title')->select();
            echo(json_encode(['statusCode'=>'0000','data'=>['deletedList'=>$res,'msg'=>'']]));
        }catch (Exception $e){
            exit(json_encode(['statusCode'=>'0001','data'=>['msg'=>'系统错误']]));
        }
    }

    public function restore(Request $request){
        try{
            $contentId = (int)$request->get('contentId');
            if((new ContentModel())->restore(['contentId'=>$contentId])){
                echo json_encode(['statusCode'=>'0000','data'=>['msg'=>'操作成功']]);
            }else{
                echo json_encode(['statusCode'=>'0005','data'=>['msg'=>'操作失败']]);
            }
        }catch (Exception $e){
            exit(json_encode(['statusCode'=>'0001','data'=>['msg'=>'系统错误']]));
        }
    }
    /*
     * 通过产品获取文章列表
     * 输入产品id
     * 输出相关文章基本信息以及层级引导
     */
    public function contentListByProduct(){
        try {
            $productId = (int)$_REQUEST['productId'];
            $currentPage = (int)$_REQUEST['currentPage'];
            if ($currentPage <= 0) {
                exit('页码错误');
            }
            if (!isset($_REQUEST['pageSize'])) {
                $pageSize = 5;
            } else {
                $pageSize = (int)$_REQUEST['pageSize'];
            }
            $sql = '';
            $list = Db::name('content t1')->join('eo_product t2', 't2.productId = t1.productId')
                ->field("t1.productId,t1.groupId,t1.setupTime,t1.updateTime,t2.productName,t1.`like`,t1.dislike,t1.title,left(t1.contentDetail,10) as partDetail,
                            concat_ws('>',t2.productName,concat('>',getpath(groupId),title)) as source")
                ->where('t1.productId', $productId)
                ->page($currentPage, $pageSize)
                ->select();
            $count = Db::name('content')->count('contentId');
            //   foreach($list as &$row){

            //       $productName = Db::name('product')->where('product_id',$row['productId'])->field('product_name as productName')->find();
        //            $presource = Db::query('select ');
        //            $row['source'] = $path = $productName['productName'].'>'.$presource[0]['source'].$row['title'];

            //  }
            // echo $list[0]['source'];
            // echo $list[1]['source'];
            $contentResult['totalPage'] = (int)ceil($count / $pageSize);
            $contentResult['contentList'] = $list;
            $contentResult['statusCode'] = 0000;
            //dump($contentResult);
            echo json_encode($contentResult);
        }catch (Exception $e){
            echo json_encode(['statusCode'=>'0001']);
        }
    }



    public function getContentByKey(){
        $key = $_REQUEST['key'];
        if(!isset($_REQUEST['currentPage'])){
            $currentPage = 1;
        }else {
            $currentPage = $_REQUEST['currentPage'];
        }
        $currentPage = (int)$_REQUEST['currentPage'];
        if($currentPage <=0){
            exit('页码错误');
        }
        if(!isset($_REQUEST['pageSize'])){
            $pageSize = 5;
        }else {
            $pageSize = (int)$_REQUEST['pageSize'];
        }

        $result = util::contentListByKey($key,$currentPage,$pageSize);
        echo json_encode($result);
    }
    /*
     * 新增图片时需要先将图片发送到后端
     */
    public function getContentImg(Request $request){
        $img = $_FILES['contentimg'];
        $src = $img['tmp_name'];
        $arr = pathinfo($img['name']);

        $newName = date('YmdGis').'.'.$arr['extension'];
        $destination = ROOT_PATH.'public/static/contentImg/'.$newName;
        move_uploaded_file($src,$destination);
        echo json_encode(['statusCode'=>'0000','data'=>['imgSource'=>'static/contentImg/'.$newName]]);

    }

    public function addContetnIfo(Request $request){
        try{
            $groupid = (int)$request->get('groupId');
            $info = util::groupInfo($groupid);
            echo json_encode(['statusCode'=>'0000','data'=>$info]);
        }catch (Exception $exception){
            exit(json_encode(['statusCode'=>'0001','data'=>['msg'=>'系统错误']]));
        }
    }


    public function addContent(Request $request){
        try{
            $content = new ContentModel();
            $groupId = (int)$request->post('groupId');
            $productId = (int)$request->post('productId');
            $title = $request->post('title');
            $text = $request->post('contentDetail');
            $type = (int)$request->post('type');
            $content->groupId = $groupId;
            $content->productId = $productId;
            $content->title = $title;
            $content->contentDetail = $text;
            $content->type = $type;
            $content->save();
            echo json_encode(['statusCode'=>'0000','data'=>['msg'=>'新增成功']]);
        }catch (Exception $exception){
            exit(json_encode(['statusCode'=>'0001','data'=>['msg'=>'系统错误']]));
        }

    }
    /*
     * 展示所选文章
     */
    public function contentInfo(Request $request){
        try{
            $contentId = (int)$request->get('contentId');
            $content = ContentModel::get($contentId);
            echo json_encode(['statusCode'=>'0000','data'=>['contentInfo'=>$content]]);
        }catch (Exception $exception){
            exit(json_encode(['statusCode'=>'0001','data'=>['msg'=>'系统错误']]));
        }
    }

    public function updateContent(Request $request){
        try{
            $contentId = (int)$request->post('contentId');
            $content = ContentModel::get($contentId);
            $groupId = (int)$request->post('groupId');
            $productId = (int)$request->post('productId');
            $title = $request->post('title');
            $text = $request->post('contentDetail');
            $type = (int)$request->post('type');
            $content->groupId = $groupId;
            $content->productId = $productId;
            $content->title = $title;
            $content->contentDetail = $text;
            $content->type = $type;

            if($content->save()){
                echo json_encode(['statusCode'=>'0000','data'=>['msg'=>'更改成功']]);
            }else{
                echo json_encode(['statusCode'=>'0005','data'=>['msg'=>'更改失败']]);
            }

        }catch (Exception $exception){
            exit(json_encode(['statusCode'=>'0001','data'=>['msg'=>'系统错误']]));
        }

    }
}
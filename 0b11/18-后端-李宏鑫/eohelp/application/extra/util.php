<?php
/**
 * Created by PhpStorm.
 * User: 86159
 * Date: 2019/7/13
 * Time: 17:34
 */

namespace app\extra;
use think\Db;
use think\Exception;

class util
{
//    public function getPath($groupId){
//        $result = Db::table('group')->where('id',$groupId)->select();
//
//        $path[] = $result[0]['name'];
//        while($result[0]['parent_id']>0){
//            $result = Db::table('group')->where('id',$result[0]['parent_id'])->select();
//            $path[] = $result[0]['name'];
//        }
//        $path = array_reverse($path);
//        $path = implode('>',$path);
//        echo json_encode($path);
//    }

   static public function getContentByProductId($proid){
        $result = Db::name('content')->field('contentId,title')->where('ProductId',$proid)
            ->select();
        return $result;
    }
   static public function getContentByGroupId($groupid){
        $result = Db::name('content')->field('contentId,title')->where('groupId',$groupid)
            ->select();
        return $result;
    }

   static public function getGroupByProductId($proid){
        $result = Db::name('group')->field('updateTime',true)->where('productId',$proid)
            ->select();
        return $result;
    }

//    static public function contentListByKey($productId,$currentPage,$pageSize){
//
//
//        $list = Db::name('content t1')->join('eo_product t2','t1.productId = t2.productId')
//            ->field("t1.productId,groupId,t1.setupTime,t1.updateTime,productName,`like`,dislike,title,left(contentDetail,10) as partDetail,
//                    concat_ws('>',productName,concat(getpath(groupId),title)) as source")
//
//            ->whereLike('')
//            ->where('t1.productId',$productId)
//            ->page($currentPage,$pageSize)
//            ->select();
//        $count = Db::name('content')->count('contentId');
//        //   foreach($list as &$row){
//
//        //       $productName = Db::name('product')->where('product_id',$row['productId'])->field('product_name as productName')->find();
////            $presource = Db::query('select ');
////            $row['source'] = $path = $productName['productName'].'>'.$presource[0]['source'].$row['title'];
//
//        //  }
//        // echo $list[0]['source'];
//        // echo $list[1]['source'];
//        $contentResult['totalPage'] = (int)ceil($count/$pageSize);
//        $contentResult['contentList'] = $list;
//        $contentResult['statusCode'] = '0000';
//        return $contentResult;
//
//    }

    /*
     * 文章内容处理工具，除掉标签以及，将关键词标记
     */
    static public function contentUtil($contentList){
        if($contentList==null)
            return;
        foreach ($contentList as &$content){
            $content['partDetail'] = preg_filter('/[\\\`\*\_\[\]\#\+\-\!\>]/','',$content['partDetail']);//去除markdown标签
        }
    }
    //删除一个分类时，递归实现删除它下面的分类和文章
    static public function deleteGroup($id){
        try{
            $list = Db::name('group')->where('parentId',$id)->select();
            if($list){
                foreach ($list as $item) {
                    self::deleteGroup($item['groupId']);
                }
            }
            if(Db::name('group')->where('groupId',$id)->delete())
            return 1;
            else
                return 0;
        }catch (Exception $e){
            return 0;
        }

    }

    static public function groupInfo($id){
        $group = Db::name('group')->where('groupId',$id)->find();
        if($pid = $group['parentId']){
            $list = Db::name('group')->field('groupId,groupName ')->where(['parentId'=>$pid])->select();
        }else{
            $list = Db::name('group')->field('groupId,groupName ')->where(['productId'=>$group['productId'],'parentId'=>0])->select();
        }
        $info = ['groupIfo'=>$group,'listIfo'=>$list];
        return $info;
    }
    /*
     * 同时获取带有关键词数量的产品列表
     * 输入文章列表
     */
    static public function productListByKey($contentList){
        $productList = Db::name('product')->select();
        foreach ($productList as &$product){
            $product['keyCount'] = 0;//数量初始化为0
            foreach ($contentList as $content) {//通过引用传值
                if($content['productId']==$product['productId'])
                    $product['keyCount']++;
            }
        }
        return $productList;
    }
}
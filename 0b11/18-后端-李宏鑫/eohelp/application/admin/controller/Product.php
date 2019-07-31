<?php
/**
 * Created by PhpStorm.
 * User: 86159
 * Date: 2019/7/15
 * Time: 15:12
 */

namespace app\admin\controller;
use app\index\model\Product as ProductModel;
use app\index\model\Content as ContentModel;
use think\Exception;
use think\Request;
use think\Db;
use app\extra\util;
use app\admin\controller\LoginFilter;
class Product extends LoginFilter
{
    public function addProduct(Request $request){
        try{
            $proname = $request->post('productName');
            $instr = $request->post('productInstr');
            $product = new ProductModel;
            $producticon = $_FILES['productIcon']['tmp_name'];
            $arr = pathinfo($_FILES['productIcon']['name']);
            $filename =date('YmdGis').'.'.$arr['extension'];
            $destination = ROOT_PATH.'public/static/productIcon/'.$filename;
            move_uploaded_file($producticon,$destination);
            $product->productName = $proname;
            $product->productInstr = $instr;
          $product->productIcon = $filename;
            if($product->save())
                echo json_encode(['statusCode'=>'0000','data'=>['msg'=>'增加成功']]);
            else
                echo json_encode(['statusCode'=>'0005','data'=>['msg'=>'增加失败']]);
//            dump($_REQUEST);
//            dump($_FILES);
        }catch (Exception $e){
            exit(json_encode(['statusCode'=>'0001','data'=>['msg'=>'增加失败']]));
        }

    }

    /*
     * 输入id删除产品
     *
     */
    public function deleteProduct(Request $request){
        try{
            $proid = (int)$request->get('productId');
            $product = ProductModel::get('productId',$proid);//先删除该产品下的所有分类
            if($product){
                $list = Db::name('group')->where('productId',$product['productId'])->select();
                foreach ($list as $group){
                    Db::name('group')->where('groupId')->delete();
                }
            }

            if(ProductModel::destroy($proid))
                echo json_encode(['statusCode'=>'0000','data'=>['msg'=>'删除成功']]);
            else
                echo json_encode(['statusCode'=>'0005','data'=>['msg'=>'删除失败']]);
        }catch (Exception $e){
            exit(json_encode(['statusCode'=>'0001','data'=>['msg'=>'系统错误']]));
        }

    }


    /*
     *
     * 传入groupId，输出对应的文章和下一级分类（后台使用）
     */
    public function getGroupIfo(Request $request){
        try{
            $productid = (int)$request->get('productId');
            $groupid = (int)$request->get('groupId');

            if($groupid==0){  //如果未传入分类id，即传入产品id，那么找一级分类。
                $childGroupList = Db::name('group')->where('productId',$productid)->where('depth',1)->select();//下级分类
                $contentList = ContentModel::where('productId',$productid)->where('groupId',0)->select();//文章列表
                $groupIfo['source'] = Db::name('product')->where('productId',$productid)->find();//source就是产品名
                $groupIfo{'productId'} = $productid;
//                $groupIfo = Db::name('group t1')->join('product t2','t1.productId = t2.productId','left')
//                    ->field("*,concat_ws('>',t2.productName,concat(getpath(t1.parentId),t1.groupName)) as source")->where('t1.productId',$productid)
//                    ->where('depth',1)->find();
            }else {//传入分类id
                $childGroupList = Db::name('group')->where('parentId',$groupid)->select();
                $contentList = ContentModel::where('groupId',$groupid)->select();
                $groupIfo = Db::name('group t1')->join('product t2','t1.productId = t2.productId','left')
                    ->field("*,concat_ws('>',t2.productName,concat(getpath(t1.parentId),t1.groupName)) as source")->where('groupId',$groupid)->find();
            }


//            if($groupIfo['depth']==1){
//                $groupIfo['parentId'] = null;
//            }else {
//                $groupIfo['productId'] = null;
//            }
            $groupIfo['contentList'] = $contentList;
            $groupIfo['childGroupList'] = $childGroupList;

            echo json_encode(['data'=>['groupIfo'=>$groupIfo,'msg'=>'成功'],'statusCode'=>'0000']);
            //echo json_encode($groupIfo);
        }catch (Exception $e){
            exit(json_encode(['statusCode'=>'0001','data'=>['msg'=>'系统错误']]));
        }

    }

    /*
     * 更新产品信息
     */
    public function updateProduct(Request $request){
        try{
            $proid = (int)$request->get('productId');

            $proname = $request->get('productName');
            $instr = $request->get('productInstr');
            $product = ProductModel::get($proid);
            $producticon = $_FILES['productIcon']['tmp_name'];
            $arr = pathinfo($_FILES['productIcon']['name']);
            $filename =date('YmdGis').'.'.$arr['extension'];
            $destination = ROOT_PATH.'public/static/productIcon/'.$filename;
            move_uploaded_file($producticon,$destination);
            $product->productName = $proname;
            $product->productInstr = $instr;
            $product->productIcon = $filename;
            $product->save();


            echo json_encode(['statusCode'=>'0000']);
        }catch (Exception $e){
            exit(json_encode(['statusCode'=>'0001','data'=>['msg'=>系统错误]]));
        }

    }

    /*
     *产品下单文章和一级分类
     *
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
            //dump($productIfo);
        }catch (Exception $e){
            exit(json_encode(['statusCode'=>'0001']));
        }

    }
    /*
     * 新建分类
     * parentId:新建分类的上级分类
     *
     */
    public function addGroup(Request $request){
        try{
            $pid = (int)$request->get('parentId');
            $proid = (int)$request->get('productId');
            $name = $request->get('groupName');

            if(Db::name('group')->where('groupName',$name)->select()){
                exit (json_encode(['statusCode'=>'0004','data'=>['msg'=>'已存在']]));
            }
            if(Db::name('group')->insert(['parentId'=>$pid,'groupName'=>$name,'productId'=>$proid])){
                echo json_encode(['statusCode'=>'0000','data'=>['msg'=>'操作成功']]);
            }else{
                echo json_encode(['statusCode'=>'0001','data'=>['msg'=>'操作失败']]);
            }
//            dump($pid); dump($proid); dump($name);
        }catch (Exception $e){
            exit(json_encode(['statusCode'=>'0001','data'=>['msg'=>'系统错误']]));
        }

    }

    /*
     * 新建分类时需要的信息
     * depth：新建几级分类
     * productId：所属产品id
     * 返回该产品下的所有级数低于新建分类的分类，用于级联
     */
    public function getGroupListByDepth(Request $request){
        try{
            $productId = (int)$request->get('productId');
            $depth = (int)$request->get('depth');
            while(--$depth){
                $list = Db::name('group')->where('productId',$productId)->where('depth',$depth)->select();
                $data['groupList'.$depth] = $list;
            }
            $data['msg'] = '查找成功';
            echo json_encode(['data'=>$data,'statusCode'=>'0000']);
           // dump($data);

        }catch (Exception $e){
            exit(json_encode(['statusCode'=>'0001','data'=>['msg'=>'系统错误']]));
        }
    }

    /*
     *保存更改分类后的信息
     */
    public function updateGroup(Request $request){
        try{
           $groupId = (int)$request->get('groupId');
           $groupName = $request->get('groupName');
           $parentId = (int)$request->get('parentId');
            if(Db::name('group')->where('groupId',$groupId)->update(['groupName'=>$groupName,'parentId'=>$parentId])){
                echo json_encode(['statusCode'=>'0000','data'=>['msg'=>'操作成功']]);
            }else{
                echo json_encode(['statusCode'=>'0001','data'=>['msg'=>'操作失败']]);
            }
//            dump($pid); dump($proid); dump($name);
        }catch (Exception $e){
            exit(json_encode(['statusCode'=>'0001','data'=>['msg'=>'系统错误']]));
        }
    }

    /*
     * 删除groupId的分类
     *
     */
    public function deleteGroup(Request $request){
        $groupId = (int)$request->get('groupId');
        if(util::deleteGroup($groupId)){
            echo json_encode(['statusCode'=>'0000','data'=>['msg'=>'操作成功']]);
        }else{
            echo json_encode(['statusCode'=>'0001','data'=>['msg'=>'操作失败']]);
        }
        try{

//            dump($pid); dump($proid); dump($name);
        }catch (Exception $e){
            exit(json_encode(['statusCode'=>'0001','data'=>['msg'=>'系统错误']]));
        }
    }

    /*
     * 更新分类是需要回填的信息
     *返回原分类的上级分类信息（或以及再上级）和产品信息
     * 返回该级分类上的所有分类，分开不同的容器
     */
    public function updateIfo(Request $request){
        try{
            $groupId = (int)$request->get('groupId');
            $info = Db::name('group t1')->join('eo_product t2','t1.productId = t2.productId')
                ->where('groupId',$groupId)->field('t2.productName,t2.productId,t1.groupName,t1.depth,t1.parentId,t1.groupId')->find();
            $depth = $info['depth'];
            $productId = $info['productId'];
            $id = $info['parentId'];
            $i = $depth-1;
            while($id>0){//获取该分类的直接上级
                $arr = Db::name('group')->field('groupName,parentId')->where('groupId',$id)->find();
                $info['groupId'.$i] = $id;
                $info['groupName'.$i] = $arr['groupName'];
                $id = $arr['parentId'];
                $i--;
            }
            while(--$depth){//获取每一级的分类
                $list = Db::name('group')->where('productId',$productId)->where('depth',$depth)->select();
                $data['groupList'.$depth] = $list;
            }
            $data['groupIfo'] = $info;
            echo json_encode(['data'=>$data,'statusCode'=>'0000']);
        }catch (Exception $e){
            exit(json_encode(['statusCode'=>'0001','data'=>['msg'=>'系统错误']]));
        }


    }
}
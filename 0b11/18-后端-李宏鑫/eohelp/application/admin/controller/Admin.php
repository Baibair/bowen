<?php
/**
 * Created by PhpStorm.
 * User: 86159
 * Date: 2019/7/13
 * Time: 15:48
 */

namespace app\admin\controller;
use app\admin\model\Admin as AdminModel;
use app\index\controller\Filter;
use think\Db;
use think\Cookie;
use think\Exception;
use think\Request;
use think\Session;

class Admin extends Filter
{
    public function show(Request $req){
        $par = $req->get('par');
        echo $par;
        //Cookie::set('admin','asd');
        dump($_COOKIE);
    }

    /*
     * 注册
     * 传入用户名和密码，密码MD5加密，邮箱正则验证
     * 输出是否操作成功
     */
    public function register(){
        try{
            $name = $_REQUEST['adminName'];

            if($user = AdminModel::get(['adminName'=>$name])){

                exit(json_encode(['statusCode'=>'0003','data'=>['msg'=>'已存在']]));
            }

            $pwd = $_REQUEST['password'];
            $email = $_REQUEST['email'];
            $admin = new AdminModel();
            $admin->adminName = $name;
            $admin->adminPwd = md5($pwd);//md5 加密
            $admin->adminEmail = $email;
            if(preg_match("/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+$/",$email)){
                exit(json_encode(['statusCode'=>'0006','data'=>['msg'=>'数据格式错误']]));
            }

            if($admin->save()){
                return json_encode(['statusCode'=>'0000','data'=>['msg'=>'成功']]);
            }else{
                return json_encode(['statusCode'=>'0005','data'=>['msg'=>'注册失败']]);
            }
        }catch (Exception $e){
            exit(json_encode(['statusCode'=>'0001','data'=>['msg'=>'系统错误']]));
        }

    }
    /*
     * @李宏鑫
     * 登录
     * 输入用户名，密码，若成功则将admin对象放入session
     * 输出是否成功，信息。
     */
    public function login(){
        try{
            Session::start();
            $request = Request::instance();
            $name = $request->post('adminName');
            $pwd = $request->post('password');

            $admin = Db::name('admin')->where(['adminName'=>$name,'adminPwd'=>md5($pwd)])->find();
            if($admin){

                Session::set('admin',$admin);
                Cookie::set('admin',json_encode($admin));
                echo json_encode(['statusCode'=>'0000','msg'=>'登录成功']);
            }else {
                echo json_encode(['statusCode'=>'0002','msg'=>'登录失败']);
            }
        }catch (Exception $e){
            exit(json_encode(['statusCode'=>'0001','msg'=>'系统错误']));
        }


    }
    /*
     * @李宏鑫
     * 注销，把admin从session移除
     */
    public function logout(){
        Session::start();

        if(!isset($_SESSION['admin'])){
            echo json_encode(['statusCode'=>'0002','data'=>['msg'=>'未登录']]);
        }else {
            Session::delete('admin');
            echo json_encode(['statusCode'=>'0000]','data'=>['msg'=>'注销成功']]);
        }
    }

    /*
     * 管理员信息
     */
    public function adminIfo(){
        try{
            Session::start();

            if($admin = Session::get('admin')){
//                $user['adminName'] = $admin->adminName;
//                $user['adminId'] = $admin->adminId;
//                $user['adminEmail'] = $admin->adminEmail;
                $admin['adminPwd'] = '';
                echo json_encode(['statusCode'=>'0000','data'=>['admin'=>$admin]]);
            }else{
                echo json_encode(['statusCode'=>'0002','data'=>['msg'=>'未登录']]);
            }
        }catch (Exception $e){
            exit(json_encode(['statusCode'=>'0001','msg'=>'系统错误']));
        }


    }

}
<?php
namespace app\index\controller;
use think\Db;
use think\Request;

class Index
{
    public function index()
    {
        return '<style type="text/css">*{ padding: 0; margin: 0; } .think_default_text{ padding: 4px 48px;} a{color:#2E5CD5;cursor: pointer;text-decoration: none} a:hover{text-decoration:underline; } body{ background: #fff; font-family: "Century Gothic","Microsoft yahei"; color: #333;font-size:18px} h1{ font-size: 100px; font-weight: normal; margin-bottom: 12px; } p{ line-height: 1.6em; font-size: 42px }</style><div style="padding: 24px 48px;"> <h1>:)</h1><p> ThinkPHP V5<br/><span style="font-size:30px">十年磨一剑 - 为API开发设计的高性能框架</span></p><span style="font-size:22px;">[ V5.0 版本由 <a href="http://www.qiniu.com" target="qiniu">七牛云</a> 独家赞助发布 ]</span></div><script type="text/javascript" src="https://tajs.qq.com/stats?sId=9347272" charset="UTF-8"></script><script type="text/javascript" src="https://e.topthink.com/Public/static/client.js"></script><think id="ad_bd568ce7058a1091"></think>';
    }

    public function te(){
        $result  = Db::name("content")->select();
        dump($result);
    }

    public function mdFilter(Request $request){
        $text = $request->post('text');
        $newText = preg_filter('/[\\\`\*\_\[\]\#\+\-\!\>]/','',$text);
        echo $newText;
    }

    public function sendMail(){
        include ROOT_PATH.'vendor/phpmailer/class.smtp.php';
        include ROOT_PATH.'vendor/phpmailer/class.phpmailer.php';
//            echo'引入成功';
//        }else {
//            echo '引入失败';
//        }


        $mail = new \PHPMailer();

        $mail->isSMTP(); // 启用SMTP
////$mail->SMTPDebug=1; //开启调试模式
////$mail->SMTPSecure = "ssl";
        $mail->CharSet='utf-8'; //设置邮件编码格式
        $mail->Host="smtp.qq.com;"; //smtp服务器的名称（这里以126邮箱为例）
        $mail->SMTPAuth = true; //启用smtp认证

        $mail->Username = "1224435689@qq.com"; //你的邮箱名可以不写@后缀，也可以写
        $mail->Password = "yvsubbqdzvpuhehb" ; //邮箱密码，现在开启邮箱SMTP后叫做安全码
        $mail->Port=465; //SMTP端口号
////$mail->Port = 994;
        //  $mail->setFrom("1224435689@qqcom","eolinker"); //发件人地址（也就是你的邮箱地址）和发件人名称

        $mail->From = "1224435689@qq.com";
        $mail->FromName = 'eolinker';
        $mail->AddAddress("1224435689@qq.com","123"); //接收人地址和名称

        $mail->WordWrap = 100; //设置每行字符长度
        $mail->isHTML(true); // 是否HTML格式邮件
        $mail->Subject ="你好这是测试的"; //邮件主题
        $mail->Body = "给你发送个信息"; //邮件内容
        dump($mail);
        $mail->Send();


        if(!$mail->Send()) {
            echo "发送失败: " . $mail->ErrorInfo;
        }else{

            // $res = $obj->data($data)->add();
            echo '发送成功';
        }

    }
}

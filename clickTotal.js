/**
 * @author 香港代购 & 程序开发  https://github.com/qqxuanlv QQ 834337625
 *  
 * 页面
 *  
 * 前置需要引入jquery 需要ajax
 * 
 * clgt随便起
 *
 * <div clgt data-id="132667199" data-spu="红色|七夕|美妆" data-title="美妆护肤神器" data-price="4000"> 
 *    <img src="./img/d506e622fb78c807.jpg.webp">
 * </div>
 *
 *
 * <script src="clickTotal.js"></script>
 * 
 * 
 * 
 * 需要在引用script后定义如下
 *   <script>
 *      clickTotal.config.url="http://www.baidu.com/";
 * 
 *      clickTotal.config.token="n21312"
 * 
 *      传输方式 get ,post 默认是post
 *      clickeTotal.config.type="post"
 * 
 *      传输格式  默认是application/json
 *      clickTotal.config.contentType="application/json"
 * 
 *      需要初始化的值 对应data-spu data-title,...
 *      clickTotal.init("clgt",["spu","title","price","id"]); 
 * 
 * </script>
 */

let checkClick = true;
let count = 0;
var clickTotal = {

    /**
     * 
     * @param {*} keywords  待处理的关键字
     * @param {*} modelArray  需要装载的数据 data-* ,ps:以spu举例子 ：["id","title","price","..."]
     * @param {*} time      多少秒内禁止多次点击 单位秒 默认3秒
     */

    init: function (keywords, modelArray, time) {

        if(time !=null){
            clickTotal .time=time;
        }
        $("[" + keywords + "]").unbind("dbclick", null);

        $("[" + keywords + "]").on("click", function (event) {


            if (checkClick) {
                /**
                 * 点击通过  发送数据处理
                 */
                clickTotal.operate(modelArray);

                //标记已点击
                checkClick = false;
                return false;
            }

            /**
             * 多次点击 用count标记  这里不使用clearTimeout因为每次点击都会产生一个setTimeout不方便统计id
             */
            count++;
            if (count == 1) {
                setTimeout(function () {
                    //重置值 使点击生效
                    checkClick = true;
                    count = 0;
                }, 
                //间隔时间
                clickTotal.time * 1000)
            }

            return true;
        })
    },
    config: {

        //服务器API请求地址
        url: null,

        //服务器请求类型
        type: "post",
        
        //发送数据格式
        contentType: "application/json",
        /**
         * 会在前端header中产生一个"clickTotalToken"
         */
        token: null,

    },
    operate: function (modelArray) {
        
        //最终生成(向服务器发送)的model
        let tmp = {}

        /**
         * 装载数据 转换成json
         */
        for (let i in modelArray) {
            tmp[modelArray[i]] = $(this).data(modelArray[i]);
        }

        //console.log("封装完成");
       
        let conf =  clickTotal.config;

        /**
         * 传输接口
         */
        if (conf.url == null) {
            throw "接口地址未配置";
        }


        let ajaxDom = {
            url: conf.url,
            type: conf.type,
            contentType: conf.contentType,
            data: tmp,
            xhrFields: {
                withCredentials: true
            },
            beforeSend: function (request) {
                if(clickTotal.config.token !=null){
                   request.setRequestHeader("clickTotalToken", conf.token)
                }
            },
            error: function (e) {
                //todo
                console.log(e);
            }
        };

        //打印发送的格式 使用时注释掉
        console.log(ajaxDom)
        $.ajax(ajaxDom);

    },
    //用来接收取值的字段名
    modelArray: [],
    //间隔时间
    time: 3,

}
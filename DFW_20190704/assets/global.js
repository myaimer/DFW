const post = "http://192.168.2.92:3000";

cc.vv = cc.vv || {};
// 集成协议模块
cc.vv.protocol = require("./protocol").protocol;
// 集成通讯模块
cc.vv.socketController = require("./socketController").socketController(post);
//集成本地监听模块
cc.vv.listener = require("./eventListener");

//定义桌子的容器
cc.vv.deskList = [];
//定义当前登录的ID
cc.vv.myAccountID = null;
//定义当前选择的房间号
cc.vv.myRoomID = null;
//定义当前选择的座位号
cc.vv.mySeatIndex = null;
//定义当前选定英雄
cc.vv.myHeroType = null;
//定义当前登录的昵称
cc.vv.myNickName = null;
//定义当前金币数量
cc.vv.myGoldCount = null;

cc.vv.res = {
    //图片类
    "test" :{url:"zhizi", type :cc.SpriteFrame},
    "head" :{url:"head",  type :cc.SpriteFrame},
    //英雄类型
    "1"    :{url:"hero/1",  type :cc.SpriteFrame},
    "2"    :{url:"hero/2",  type :cc.SpriteFrame},
    "3"    :{url:"hero/3",  type :cc.SpriteFrame},
    "4"    :{url:"hero/4",  type :cc.SpriteFrame},
    "5"    :{url:"hero/5",  type :cc.SpriteFrame},
    //方块放置的道具
    "ATK"        :{url:"mapRect/ATK",  type :cc.SpriteFrame},
    "blood"      :{url:"mapRect/blood",  type :cc.SpriteFrame},
    "defense"    :{url:"mapRect/defense",  type :cc.SpriteFrame},
    "gold"       :{url:"mapRect/gold",  type :cc.SpriteFrame},
    "PK"         :{url:"mapRect/pk",  type :cc.SpriteFrame},
    "skill"      :{url:"mapRect/skill",  type :cc.SpriteFrame},
    "start"      :{url:"mapRect/start",  type :cc.SpriteFrame},
    //预制件类
    "warning":{url:"warning",     type:cc.Prefab},
    "desk":   {url:"desk",        type:cc.Prefab},
    "leftSeat":   {url:"leftSeat",        type:cc.Prefab},
    "rightSeat":  {url:"rightSeat",       type:cc.Prefab},
    "rect":   {url:"rect",       type:cc.Prefab},
    "msgPre":   {url:"msgLabel",       type:cc.Prefab},
};

cc.vv.GAME_HINT = {
    informationLoss:"信息输入不完整，请重新输入",   
    password:"两次密码输不相同",     
    formalError:"格式错误。请确认输入的内容中不包含敏感字符",   
};

// 敏感字符
cc.vv.REG_ILLEGAL_CHAR = /[\\\(\)\{\}\/\,\|\*\+\-\.\?\^\n\r\t\v\0\b]|装逼|草泥马|特么的|撕逼|玛拉戈壁|爆菊|JB|呆逼|本屌|齐B短裙|法克鱿|丢你老母|达菲鸡|装13|逼格|蛋疼|傻逼|绿茶婊|你妈的|表砸|屌爆了|买了个婊|已撸|吉跋猫|妈蛋|逗比|我靠|碧莲|碧池|然并卵|日了狗|屁民|吃翔|XX狗|淫家|你妹|浮尸国|滚粗/g;

// 创建提示框
cc.vv.showHint = function(info){
    let hint = cc.instantiate(cc.vv.res["warning"])
    hint.getChildByName("WarningLabel").getComponent(cc.Label).string = info;
    cc.find("Canvas").addChild(hint);
    setTimeout(() =>{
        hint.destroy();
    },1000);
};

//输入框内容检测
cc.vv.checkInput  =  function(parNode){
    // 初始化验证结果
    let errInfo = "";
    // 获取传入的父节点的所有子节点
    let children = parNode.children;
    for (let i = 0; i < children.length; i++) {
        let n = children[i];
        //筛选出所有的输入框
        if(n.name.indexOf("Box") >-1){
            let type = n.name.split("输入")[0];
            let str = n.getComponent(cc.EditBox).string;
            // 校验完整度
            if(!str){
                errInfo = cc.vv.GAME_HINT["informationLoss"];
                break;
            }
            if(str.match(cc.vv.REG_ILLEGAL_CHAR)){
                errInfo = cc.vv.GAME_HINT["formalError"];
                break;
            }
            if(n.name.indexOf("Box2") > -1){
                // cc.log(parNode.getChildrenByName())
                let password1 =  parNode.getChildByName("passwordInputBox").getComponent(cc.EditBox).string;
                let password2 =  parNode.getChildByName("passwordInputBox2").getComponent(cc.EditBox).string;
                if(password1 != password2){
                    errInfo = cc.vv.GAME_HINT["password"];
                    break;
                }
            }       
        } 
    }
    return errInfo;
}
const listener = require("./eventListener")

exports.socketController = function (url) {
    let that = {};
    // 与指定端口建立连接
    let socket = io(url);
    // 回调函数列表
    let callbackMap = {};
    let callbackIndex = 1;
    socket.on("S->C",function (packet) {
        let msg = JSON.parse(packet);
        let type = msg.type;
        let data = msg.data;
        let callbackIndex = msg.callbackIndex;
        if(callbackIndex){
            let callback = callbackMap[callbackIndex];
            if(data.err){
                callback(data.err)
            }else{
                callback(null,data.res)
            }
        }else{
            listener.emit(type,data)
        }
      });

    //   客户端的离岸港口 
    let sentMsg = function(packet){
        socket.emit("C->S",JSON.stringify(packet))
    };

    // 序列化回调函数
    let serialize = function(type,res,callback){
        callbackMap[callbackIndex] = callback;
        sentMsg({type:type,data:res,callbackIndex:callbackIndex});
        callback++;
    };


    /*********************************************************请求类********************************************************************/

    //登录请求
    that.requestLogin = function(data,callback){
        serialize(cc.vv.protocol.REQUEST_LOGIN,data,callback)
    };

    //注册请求
    that.requestRegister = function(data,callback){
        serialize(cc.vv.protocol.REQUEST_REGISTER,data,callback)
    };

    //进入大厅请求
    that.requestEnterHall = function(data,callback){
        serialize(cc.vv.protocol.REQUEST_ENTER_HALL,data,callback)
    };

    //加入房间请求
    that.requestJoinRoom = function(data,callback){
        serialize(cc.vv.protocol.REQUEST_JOIN_ROOM,data,callback)
    };

    //进入房间请求
    that.requestEnterRoom = function(data,callback){
        serialize(cc.vv.protocol.REQUEST_ENTER_ROOM,data,callback)
    };

    //离开房间请求
    that.requestLeaveRoom = function(data,callback){
        serialize(cc.vv.protocol.REQUEST_LEAVE_ROOM,data,callback)
    };

    //开始准备请求
    that.requestIsReady = function(data,callback){
        serialize(cc.vv.protocol.REQUEST_IS_READY,data,callback)
    };

    //聊天请求
    that.requestChat = function(data,callback){
        serialize(cc.vv.protocol.REQUEST_CHAT,data,callback)
    };

    //更换英雄皮肤请求
    that.requestChangeHeroType = function(data,callback){
        serialize(cc.vv.protocol.REQUEST_CHANGE_HERO_TYPE,data,callback)
    };

    //开始游戏请求
    that.requestStartGame = function(data,callback){
        serialize(cc.vv.protocol.REQUEST_START_GAME,data,callback)
    };

    //掷骰子请求
    that.requestThrowDice = function(data,callback){
        serialize(cc.vv.protocol.REQUEST_THROW_DICE,data,callback)
    };

    //结束回合请求
    that.requestBoutOver = function(data,callback){
        serialize(cc.vv.protocol.REQUEST_BOUT_OVER,data,callback)
    };

    //战斗请求
    that.requestFight = function(data,callback){
        serialize(cc.vv.protocol.REQUEST_FIGHT,data,callback)
    };

    //释放技能请求
    that.requestUseSkill = function(data,callback){
        serialize(cc.vv.protocol.REQUEST_USE_SKILL,data,callback)
    };

    //战斗结束请求
    that.requestFightOver = function(data,callback){
        serialize(cc.vv.protocol.REQUEST_FIGHT_OVER,data,callback)
    };

    //伤害玩家请求
    that.requestHurtPLayer = function(data,callback){
        serialize(cc.vv.protocol.REQUEST_HURT_PLAYER,data,callback)
    };

    //发出自己造成的真实伤害请求
    that.requestBeHurt = function(data,callback){
        serialize(cc.vv.protocol.REQUEST_BE_HURT,data,callback)
    };

    //请求传送自己英雄信息
    that.requestSentHeroInfo = function(data,callback){
        serialize(cc.vv.protocol.REQUEST_SENT_HERO_INFO,data,callback)
    };


    /*********************************************************监听类********************************************************************/
    //监听玩家加入房间(大厅视角)
    that.onPlayerJoinRoom = function(cb){
        cc.vv.listener.on(cc.vv.protocol.ON_PLAYER_JOIN_ROOM,cb);
    };

    //监听玩家离开房间(大厅视角)
    that.onPlayerLeaveRoom = function(cb){
        cc.vv.listener.on(cc.vv.protocol.ON_PLAYER_LEAVE_ROOM,cb);
    };

    that.onHeroData = function(cb){
        cc.vv.listener.on(cc.vv.protocol.ON_HERO_DATA,cb);
    };

    //监听玩家是否准备
    that.onPlayerIsReady = function(cb){
        cc.vv.listener.on(cc.vv.protocol.ON_PLAYER_IS_READY,cb);
    };

    //监听玩家聊天
    that.onPlayerChat = function(cb){
        cc.vv.listener.on(cc.vv.protocol.ON_PLAYER_CHAT,cb);
    };

    //监听游戏开始
    that.onGameStart = function(cb){
        cc.vv.listener.on(cc.vv.protocol.ON_GAME_START,cb);
    };
      
    //监听玩家掷骰子
    that.onThrowDice = function(cb){
        cc.vv.listener.on(cc.vv.protocol.ON_THROW_DICE,cb);
    };

    //监听回合结束
    that.onBoutOver = function(cb){
        cc.vv.listener.on(cc.vv.protocol.ON_BOUT_OVER,cb);
    };

    //监听战斗
    that.onFight = function(cb){
        cc.vv.listener.on(cc.vv.protocol.ON_FIGHT,cb);
    };

    //监听使用技能
    that.onUseSkill = function(cb){
        cc.vv.listener.on(cc.vv.protocol.ON_USE_SKILL,cb);
    };

    //监听战斗结束
    that.onFightOver = function(cb){
        cc.vv.listener.on(cc.vv.protocol.ON_FIGHT_OVER,cb);
    };

    //监听伤害玩家
    that.onHurtPlayer = function(cb){
        cc.vv.listener.on(cc.vv.protocol.ON_HURT_PLAYER,cb);
    };

    //监听其他玩家被自己造成的真实伤害
    that.onBeHurt = function(cb){
        cc.vv.listener.on(cc.vv.protocol.ON_BE_HURT,cb);
    };

    //监听其他玩家的英雄信息
    that.onHeroInfo = function(cb){
        cc.vv.listener.on(cc.vv.protocol.ON_HERO_INFO,cb);
    };

    return that
  }
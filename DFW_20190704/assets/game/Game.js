
cc.Class({
    extends: cc.Component,

    properties: {
        way:cc.Node,
        rectPre:cc.Prefab,
        chatMsg:cc.EditBox,
        cont:cc.Node,
        showChatBtn:cc.Node,
        closeChatBtn:cc.Node,
        chatBg:cc.Node,
    },


    // onLoad () {},

    start () {
        //定义地图块放置的位置列表
        this.posList = [[-490.8,-252.6],[-400,-200],[-400,-95],[-400,10],[-400,115],[-400,220],[-309.7,272],[-219.8,221.5],
                    [-310,-252.3],[-219,-202.4],[-130,-254],[-42,-203],[-40.7,-99.2],[-38,5.3],[51.6,58],[140.1,7.9],
                    [230.7,-43.8],[231,-146],[320,-200],[410.3,-252.5],[500.7,-198.9],[501.8,-94.4],[503,9],[504.3,113.8],
                    [502,219.6],[413,269],[323,218],[230.8,269],[143.1,215],[54.6,268.2],[-36.1,219.4],[-126.1,270.4]];
        //定义方块上放置的道具图片数组
        this.propPicList = [cc.vv.res.ATK,cc.vv.res.blood,cc.vv.res.defense,cc.vv.res.gold,cc.vv.res.PK,cc.vv.res.skill];
        this.onGameStart();
        this.startGame();
        // this.creatWay();
        this.onChat();
    },

    //请求开始游戏
    startGame(){
        let data = {};
        data.mapLength = this.posList.length;
        data.propLength = this.propPicList.length;
        cc.vv.socketController.requestStartGame(data,function(err,res){
            if(err){
                console.log(err);
            }else{
                console.log(res);
            }
        })
    },

    //监听游戏开始
    onGameStart(){
        let self = this;
        cc.vv.socketController.onGameStart(function(data){
            console.log(data)
            // self.creatWay(data);
        })
    },

    //生成路径
    creatWay(ranList){
        for(let i = 0;i < this.posList.length;i++){
            let rect = cc.instantiate(cc.vv.res.rect);
            rect.x = this.posList[i][0];
            rect.y = this.posList[i][1];
            this.way.addChild(rect);
            if(i === 0){
                rect.getChildByName("pic").getComponent(cc.Sprite).spriteFrame = cc.vv.res.start;
            }else{
                rect.getChildByName("pic").getComponent(cc.Sprite).spriteFrame = this.propPicList[ranList[i]];
            }           
        }
    },

    //是否显示聊天信息板
    showChat(event,num){
        this.chatBg.scaleX = num;
    },

    //聊天
    chat(){
        this.data = {};
        this.data.accountID = cc.vv.myAccountID;
        this.data.msg = this.chatMsg.string;
        let self = this;
        cc.vv.socketController.requestChat(self.data,function(err,res){
            if(err){
                console.log(err);
            }else{
                // console.log(res);
            }
        })
    },

    //监听聊天信息
    onChat(){
        let self = this;
        cc.vv.socketController.onPlayerChat(function(data){
            self.chatMsgShow(data.accountID,data.nickName,data.msg);                     
        })
    },

    //聊天信息显示
    chatMsgShow(accountID,nickName,msg){
        let chatMsg = cc.instantiate(cc.vv.res.msgPre);
        chatMsg.getComponent(cc.Label).string = "【" + nickName +"】：" + msg;
        if(accountID === cc.vv.myAccountID){
            chatMsg.color = cc.Color.YELLOW;
        }
        if(accountID == "系统消息"){
            chatMsg.color = cc.Color.RED;
        }
        this.cont.addChild(chatMsg);
        this.chatMsg.string = "";
    },

    
    // update (dt) {},
});

  
  
  

  
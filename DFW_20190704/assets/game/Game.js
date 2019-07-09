
cc.Class({
    extends: cc.Component,

    properties: {
        way:cc.Node,
        chatMsg:cc.EditBox,
        cont:cc.Node,
        showChatBtn:cc.Node,
        closeChatBtn:cc.Node,
        chatBg:cc.Node,
        diceBtn:cc.Node,
        diceSpr:cc.Node,
        player1:cc.Node,
        player2:cc.Node,
        boutBtn:cc.Node,
    },


    // onLoad () {},

    start () {
        //定义方块上放置的道具图片数组
        this.propPicList = [cc.vv.res.ATK,cc.vv.res.blood,cc.vv.res.defense,cc.vv.res.gold,cc.vv.res.PK,cc.vv.res.skill];
        this.startGame();
        this.onGameStart();       
        this.onChat();
        this.onThrowDice(); 
        this.onBoutOver();
    },

    //请求开始游戏
    startGame(){
        let data = {};
        data.mapLength = cc.vv.MAP.m_1.length;
        data.propLength = this.propPicList.length;
        cc.vv.socketController.requestStartGame(data,function(err,res){
            if(err){
                console.log(err);
            }else{
                // console.log("是否同意" + res);
            }
        })
    },

    //监听游戏开始
    onGameStart(){
        let self = this;
        cc.vv.socketController.onGameStart(function(data){
            self.creatWay(data.mapList);
            cc.vv.propList = data.mapList;
            if(cc.vv.mySeatIndex == 1){
                self.diceBtn.active = true;
                self.player1.getComponent(cc.Sprite).spriteFrame = cc.vv.res[cc.vv.myHeroType];
                self.player2.getComponent(cc.Sprite).spriteFrame = cc.vv.res[data.heroType];
            }else{
                self.player1.getComponent(cc.Sprite).spriteFrame = cc.vv.res[data.heroType];
                self.player2.getComponent(cc.Sprite).spriteFrame = cc.vv.res[cc.vv.myHeroType];
            }
            self.player1.x = cc.vv.MAP.m_1[0][0] - 30;
            self.player1.y = cc.vv.MAP.m_1[0][1];
            self.player2.x = cc.vv.MAP.m_1[0][0] + 30;
            self.player2.y = cc.vv.MAP.m_1[0][1];
            
        })
    },

    //生成路径
    creatWay(ranList){
        for(let i = 0;i < cc.vv.MAP.m_1.length;i++){
            let rect = cc.instantiate(cc.vv.res.rect);
            rect.x = cc.vv.MAP.m_1[i][0];
            rect.y = cc.vv.MAP.m_1[i][1];            
            rect.getComponent("Rect").init(i,ranList[i],this.propPicList);
            this.way.addChild(rect);
                      
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

    //按钮的回调事件
    onButtonclick(event,customData){
        this[customData]();
    },

    //掷骰子
    throwDice(){
        // cc.vv.isMyGameTime = true; 
        let data = {};
        data.accountID = cc.vv.myAccountID;  
        data.seatIndex = cc.vv.mySeatIndex;
        let self = this;      
        cc.vv.socketController.requestThrowDice(data,function(err,res){
            if(err){
                console.log(err);
            }else{
                self.diceBtn.active = !res;     
            }
        })
    },

    //监听掷骰子
    onThrowDice(){
        let self = this;
        cc.vv.socketController.onThrowDice(function(data){
            self.diceSpr.getComponent("Dice").init(data);
            self.diceSpr.active = true;
            self.diceSpr.getComponent(cc.Animation).play();            
            self.heroWalk(data.num,data.seatIndex);
    
        })
    },

    //英雄的行走函数
    heroWalk(count,m){
        this.player = this["player" + m];
        let repeat = count;
        let timer = setInterval(function(){
            if(repeat == 0){
                this.checkProp(cc.vv.myHeroCurrentIndex);
                if(m == cc.vv.mySeatIndex){
                    this.boutBtn.active = true;
                }
                clearInterval(timer);
            }else{
                repeat -= 1;             
                if(m == 1){
                    cc.vv.myHeroCurrentIndex += 1;
                    if(cc.vv.myHeroCurrentIndex > cc.vv.MAP.m_1.length - 1){
                        cc.vv.myHeroCurrentIndex = 1;
                    }
                    this.player.runAction(
                        cc.moveTo(1,cc.v2(cc.vv.MAP.m_1[cc.vv.myHeroCurrentIndex][0],cc.vv.MAP.m_1[cc.vv.myHeroCurrentIndex][1])),
                    )
                }
                if(m == 2){
                    cc.vv.otherHeroCurrentIndex += 1;
                    if(cc.vv.otherHeroCurrentIndex > cc.vv.MAP.m_1.length - 1){
                        cc.vv.otherHeroCurrentIndex = 1;
                    }
                    this.player.runAction(
                        cc.moveTo(1,cc.v2(cc.vv.MAP.m_1[cc.vv.otherHeroCurrentIndex][0],cc.vv.MAP.m_1[cc.vv.otherHeroCurrentIndex][1])),
                    )
                }
            }
        }.bind(this),2000)
    },

    //检查所在下标的道具
    checkProp(index){
        let propIndex = cc.vv.propList[index];
        if(propIndex == 4){
            
        }
    },

    //回合结束按钮回调函数
    boutOver(){
        this.boutBtn.active = false;
        let data = {};
        data.seatIndex = cc.vv.mySeatIndex;
        cc.vv.socketController.requestBoutOver(data,function(err,res){
            if(err){
                console.log(err);
            }else{
                // console.log(res);
            }
        })
    },

    //监听回合结束
    onBoutOver(){
        let self = this;
        cc.vv.socketController.onBoutOver(function(data){
           if(cc.vv.mySeatIndex !== data){
                self.diceBtn.active = true; 
           }
        })
    }
});

  
  
  

  
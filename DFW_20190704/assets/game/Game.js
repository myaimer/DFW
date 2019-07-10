cc.Class({
    extends: cc.Component,

    properties: {
        gameBg:cc.Node,
        fightBg:cc.Node,
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
        skillPackge:cc.Node,
        myHeroInfo:cc.Node,
        otherHeroInfo:cc.Node,
        fightBoutOverBtn:cc.Node,
    },


    onLoad () {
        this.currentHP = cc.vv.myHeroHP;
        this.currentATK = cc.vv.myHeroATk;
        this.currentDefense = cc.vv.myHeroDefense;
        this.currentSkillHurt = cc.vv.myHeroSkillHurt;
    },

    start () {
        //定义方块上放置的道具图片数组
        this.propPicList = [cc.vv.res.ATK,cc.vv.res.blood,cc.vv.res.defense,cc.vv.res.gold,cc.vv.res.PK,cc.vv.res.skill];
        this.startGame();
        this.onGameStart();       
        this.onChat();
        this.onThrowDice(); 
        this.onBoutOver();
        this.onFight();
        this.onUseSkill();
        this.onFightOver();
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
        if(propIndex == 0){
            console.log("获得攻击力加成")
        }
        if(propIndex == 1){
            console.log("获得血量加成")
        }
        if(propIndex == 2){
            console.log("获得防御加成")
        }
        if(propIndex == 3){
            console.log("获得金币加成")
        }
        if(propIndex == 4){
            console.log("进入战斗场景")
            // this.fight();
        }
        if(propIndex == 5){
            console.log("获得技能伤害加成")
        }
        this.fight();
    },

    //请求战斗
    fight(){        
        let data = {};
        data.accountID = cc.vv.myAccountID;
        let self = this;
        cc.vv.socketController.requestFight(data,function(err,res){
            if(err){
                console.log(err);
            }else{
                // cc.vv.isMyGameTime = res; 
            }
        })
    },

    //监听战斗
    onFight(){
        let self = this;
        cc.vv.socketController.onFight(function(data){
            if(data.isFight){
                self.gameBg.active = false;
                self.fightBg.active = true; 
                if(data.seatIndex == cc.vv.mySeatIndex){
                    self.fightBoutOverBtn.active = true;
                    self.skillPackge.active = true;
                }else{
                    self.skillPackge.active = false;
                }              
                self.showFightInfo(data.res[0],data.nickName);
            }
            
        })
    },

    //展示战斗信息
    showFightInfo(info,nickName){
        let heroInfo = null;
        if(info.accountID == cc.vv.myAccountID){
            heroInfo = this.myHeroInfo;
            cc.vv.myHeroHP = info.heroHP;
            this.skillPackge.getChildByName("box3").getChildByName("skillPic").getComponent(cc.Sprite).spriteFrame = cc.vv.res["skill_" + info.herotype];
        }else{
            heroInfo = this.otherHeroInfo;
            cc.vv.otherHeroHP = info.heroHP;
        }
        heroInfo.getChildByName("hero").getComponent(cc.Sprite).spriteFrame = cc.vv.res[info.herotype];
        heroInfo.getChildByName("HP").getChildByName("label").getComponent(cc.Label).string = info.heroHP;
        heroInfo.getChildByName("nickName").getComponent(cc.Label).string = nickName;
        this.skillPackge.getChildByName("box1").getChildByName("skillPic").getComponent(cc.Sprite).spriteFrame = cc.vv.res.skill_ATK;
        this.skillPackge.getChildByName("box2").getChildByName("skillPic").getComponent(cc.Sprite).spriteFrame = cc.vv.res.skill_defense;       
    },

    //释放技能请求
    useSkill(event,customData){
        let data = {};
        data.accountID = cc.vv.myAccountID;
        data.useSkillType = customData;
        data.ATK = this.currentATK;
        cc.vv.socketController.requestUseSkill(data,function(err,res){
            if(err){
                console.log(err);
            }else{
                // console.log(res);
            }
        })
    },

    //监听释放技能
    onUseSkill(){
        let self = this;
        cc.vv.socketController.onUseSkill(function(data){
            console.log(data);
            if(data.accountID == cc.vv.myAccountID){
                //todo 播放自己的释放技能的动画
                self.myHeroInfo.runAction(
                    cc.sequence(
                        cc.moveTo(1,cc.v2(self.otherHeroInfo.x+800,self.otherHeroInfo.y-400)),
                        cc.callFunc(function(){
                            self.release(data.useSkillType,self.otherHeroInfo,data.heroType,data.accountID);
                        }),
                        cc.moveTo(1,cc.v2(self.myHeroInfo.x,self.myHeroInfo.y)),
                    )                    
                )                
            }else{
                //todo 播放别人释放技能的动画，并计算伤害
                self.otherHeroInfo.runAction(
                    cc.sequence(
                        cc.moveTo(1,cc.v2(self.myHeroInfo.x - 800,self.myHeroInfo.y + 400)),
                        cc.callFunc(function(){
                            self.release(data.useSkillType,self.myHeroInfo,data.heroType,data.accountID);
                        }),
                        cc.moveTo(1,cc.v2(self.otherHeroInfo.x,self.otherHeroInfo.y)),
                    )
                )                

            }
        })
    },

    //释放对应技能
    release(type,pos,heroType,accountID){
        if(type == "ATK"){
            let skill = cc.instantiate(cc.vv.res.ATKSkill);
            pos.getChildByName("hero").addChild(skill);
            skill.getComponent(cc.Animation).play();
            setTimeout(function(){
                skill.destroy();
            }.bind(this),500)
        }
        if(type == "defense"){
            let skill = cc.instantiate(cc.vv.res.defenseSkill);
            if(accountID == cc.vv.myAccountID){
                this.myHeroInfo.getChildByName("hero").addChild(skill);
            }else{
                this.otherHeroInfo.getChildByName("hero").addChild(skill);
            }           
            skill.getComponent(cc.Animation).play();
            setTimeout(function(){
                skill.destroy();
            }.bind(this),500)
        }
        if(type == "skill"){
            if(heroType == 1){
                let skill = cc.instantiate(cc.vv.res.fireSkill);
                pos.getChildByName("hero").addChild(skill);
                skill.getComponent(cc.Animation).play();
                setTimeout(function(){
                    skill.destroy();
                }.bind(this),500)
            }
            if(heroType == 2){
                let skill = cc.instantiate(cc.vv.res.swordSkill);
                pos.getChildByName("hero").addChild(skill);
                skill.getComponent(cc.Animation).play();
                setTimeout(function(){
                    skill.destroy();
                }.bind(this),500)
            }
        }
    },

    //请求结束战斗
    fightOver(){
        let data = {};
        data.accountID = cc.vv.myAccountID;
        cc.vv.socketController.requestFightOver(data,function(err,res){
            if(err){
                console.log(err);
            }else{
                // console.log(res);
            }
        })
    },

    //监听战斗结束
    onFightOver(){
        let self = this;
        cc.vv.socketController.onFightOver(function(data){
            console.log(data);
            if(data == cc.vv.mySeatIndex){
                self.skillPackge.active = false;
                self.fightBoutOverBtn.active = false;
            }else{
                self.skillPackge.active = true;
                self.fightBoutOverBtn.active = true;
            }
        })
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

  
  
  

  
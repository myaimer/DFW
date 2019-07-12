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
        gameEnd:cc.Node,
        diceSpr:cc.Node,
        player1:cc.Node,
        player2:cc.Node,
        boutBtn:cc.Node,
        propMsg:cc.Node,
        skillPackge:cc.Node,
        myHeroInfo:cc.Node,
        otherHeroInfo:cc.Node,
        fightBoutOverBtn:cc.Node,
        myHeroHP:cc.ProgressBar,
        otherHeroHP:cc.ProgressBar,
    },


    onLoad () {
        this.onGameStart(); 
        this.onChat();
        this.onThrowDice(); 
        this.onBoutOver();
        this.onFight();
        this.onUseSkill();
        this.onFightOver();
        this.onHurtPlayer();
        this.onBeHurt();
        this.onOtherHeroInfo();
    },

    start () {
        //定义方块上放置的道具图片数组
        this.propPicList = [cc.vv.res.ATK,cc.vv.res.blood,cc.vv.res.defense,cc.vv.res.gold,cc.vv.res.PK,cc.vv.res.skill];
        //定义当前属性
        this.currentHP = cc.vv.myHeroHP;
        this.currentTotalHP = cc.vv.myHeroHP;
        this.currentATK = cc.vv.myHeroATk;
        this.currentDefense = cc.vv.myHeroDefense;
        this.currentSkillHurt = cc.vv.myHeroSkillHurt;
        this.currentGold = 0;
        this.fightCount = 6;
        this.otherCurrentHeroHP = null;
        this.otherCurrentHeroTotalHP = null;
        this.fightBg.active = false;
        this.gameEnd.active = false;
        this.startGame();
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

    //逃跑
    flee(){
        this.fightBg.getChildByName("fleeMsg").active = true;
        setTimeout(function(){
            this.fightBg.getChildByName("fleeMsg").active = false;
        }.bind(this),3000)
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
            setTimeout(function(){
                self.heroWalk(data.num,data.seatIndex);
            }.bind(this),2000)           
            
        })
    },

    //英雄的行走函数
    heroWalk(count,m){
        this.player = this["player" + m];
        let repeat = count;
        let timer = setInterval(function(){
            if(repeat == 0){               
                if(m == cc.vv.mySeatIndex){
                    this.checkProp(cc.vv.myHeroCurrentIndex);
                    this.boutBtn.active = true;
                }
                clearInterval(timer);
            }else{
                repeat -= 1;             
                if(m == cc.vv.mySeatIndex){
                    cc.vv.myHeroCurrentIndex += 1;
                    if(cc.vv.myHeroCurrentIndex > cc.vv.MAP.m_1.length - 1){
                        cc.vv.myHeroCurrentIndex = 1;
                    }
                    this.player.runAction(
                        cc.moveTo(0.5,cc.v2(cc.vv.MAP.m_1[cc.vv.myHeroCurrentIndex][0],cc.vv.MAP.m_1[cc.vv.myHeroCurrentIndex][1])),
                    )
                }else{
                    cc.vv.otherHeroCurrentIndex += 1;
                    if(cc.vv.otherHeroCurrentIndex > cc.vv.MAP.m_1.length - 1){
                        cc.vv.otherHeroCurrentIndex = 1;
                    }
                    this.player.runAction(
                        cc.moveTo(0.5,cc.v2(cc.vv.MAP.m_1[cc.vv.otherHeroCurrentIndex][0],cc.vv.MAP.m_1[cc.vv.otherHeroCurrentIndex][1])),
                    )
                }
            }
        }.bind(this),1000)
    },

    //检查所在下标的道具
    checkProp(index){
        let propIndex = cc.vv.propList[index];
        if(propIndex !== 4){
            this.propMsg.active = true;
            setTimeout(function(){
                this.propMsg.active = false;
            }.bind(this),3000);
        }        
        if(propIndex == 0){         
            let ran = (Math.random() * 15 + 5) | 0 ;
            this.propMsg.getChildByName("pic").getComponent(cc.Sprite).spriteFrame = cc.vv.res.iconATK;
            this.propMsg.getChildByName("label").getComponent(cc.Label).string = "攻击力提升" + ran + "点";
            this.currentATK += ran;           
        }
        if(propIndex == 1){
            let ran = (Math.random() * 150 + 50) | 0;
            this.propMsg.getChildByName("pic").getComponent(cc.Sprite).spriteFrame = cc.vv.res.iconHP;
            this.propMsg.getChildByName("label").getComponent(cc.Label).string = "血量提升" + ran + "点";
            this.currentHP += ran;
            this.currentTotalHP += ran;
        }
        if(propIndex == 2){
            let ran = (Math.random() * 40 + 10) | 0;
            this.propMsg.getChildByName("pic").getComponent(cc.Sprite).spriteFrame = cc.vv.res.iconDenfense;
            this.propMsg.getChildByName("label").getComponent(cc.Label).string = "防御提升" + ran + "点";
            this.currentDefense += ran;
        }
        if(propIndex == 3){
            let ran = (Math.random() * 80 + 20) | 0;
            this.propMsg.getChildByName("pic").getComponent(cc.Sprite).spriteFrame = cc.vv.res.iconGold;
            this.propMsg.getChildByName("label").getComponent(cc.Label).string = "获得金币" + ran + "个";
            this.currentGold += ran;
        }
        if(propIndex == 4){
            this.fight();
        }
        if(propIndex == 5){
            let ran = (Math.random() * 40 + 10) | 0 ;
            this.propMsg.getChildByName("pic").getComponent(cc.Sprite).spriteFrame = cc.vv.res.iconSkill;
            this.propMsg.getChildByName("label").getComponent(cc.Label).string = "技能伤害提升" + ran + "点";
            this.currentSkillHurt += ran;
        }   

        // this.fight();       
    },

    
    //请求战斗
    fight(){      
        let data = {};
        data.accountID = cc.vv.myAccountID;
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
            self.gameBg.active = false;
            self.fightBg.active = true; 
            if(data.seatIndex == cc.vv.mySeatIndex){                
                self.fightBoutOverBtn.active = true;
                self.skillPackge.active = true;
            }else{
                self.skillPackge.active = false;
            }              
            self.showFightInfo(data.res[0],data.nickName);
        })
    },

    //请求传送自己的英雄信息
    sentHeroInfo(){
        let data = {};
        data.accountID = cc.vv.myAccountID;
        data.currentTotalHP = this.currentTotalHP;
        data.currentHP = this.currentHP;
        cc.vv.socketController.requestSentHeroInfo(data,function(err,res){
            if(err){
                console.log(err);
            }else{

            }
        })
    },

    //监听其他玩家的英雄属性
    onOtherHeroInfo(){
        let self = this;
        cc.vv.socketController.onHeroInfo(function(data){
            console.log(data);
            self.otherCurrentHeroHP = data.currentHP;
            self.otherCurrentHeroTotalHP = data.currentTotalHP;
        })
    },

    
    //展示战斗信息
    showFightInfo(info,nickName){
        let heroInfo = null;
        if(info.accountID == cc.vv.myAccountID){           
            heroInfo = this.myHeroInfo;
            this.showHP(heroInfo,this.currentHP,this.currentTotalHP);
            this.skillPackge.getChildByName("box3").getChildByName("skillPic").getComponent(cc.Sprite).spriteFrame = cc.vv.res["skill_" + info.herotype];
        }else{
            this.sentHeroInfo();
            heroInfo = this.otherHeroInfo;
            setTimeout(function(){
                this.showHP(heroInfo,this.otherCurrentHeroHP,this.otherCurrentHeroTotalHP);
            }.bind(this),500)
            
        }
        heroInfo.getChildByName("hero").getComponent(cc.Sprite).spriteFrame = cc.vv.res[info.herotype];
        heroInfo.getChildByName("nickName").getComponent(cc.Label).string = nickName;
        this.skillPackge.getChildByName("box1").getChildByName("skillPic").getComponent(cc.Sprite).spriteFrame = cc.vv.res.skill_ATK;
        this.skillPackge.getChildByName("box2").getChildByName("skillPic").getComponent(cc.Sprite).spriteFrame = cc.vv.res.skill_defense;       
    },

    //展示战斗时的血量
    showHP(heroInfo,currentHP,currentTotalHP){
        heroInfo.getChildByName("HP").getChildByName("label").getComponent(cc.Label).string = currentHP + "/" + currentTotalHP;
        heroInfo.getChildByName("HP").getComponent(cc.ProgressBar).progress = currentHP/currentTotalHP;
    },

    //释放技能请求
    useSkill(event,customData){
        let data = {};
        data.accountID = cc.vv.myAccountID;
        data.useSkillType = customData;
        data.ATK = this.currentATK;
        let self = this;
        cc.vv.socketController.requestUseSkill(data,function(err,res){
            if(err){
                console.log(err);
            }else{
                self.skillPackge.active = !res;
            }
        })
    },

    //监听释放技能
    onUseSkill(){
        let self = this;
        cc.vv.socketController.onUseSkill(function(data){
            if(data.accountID == cc.vv.myAccountID){
                //播放自己的释放技能的动画
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
                //播放别人释放技能的动画，并计算伤害
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
                if(accountID == cc.vv.myAccountID){
                    this.hurtPLayer(this.currentATK);
                }
                skill.destroy();
            }.bind(this),600)
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
                this.currentDefense += 100;
                skill.destroy();
            }.bind(this),600)
        }
        if(type == "skill"){
            if(heroType == 1){
                let skill = cc.instantiate(cc.vv.res.fireSkill);  
                pos.getChildByName("hero").addChild(skill);
                skill.getComponent(cc.Animation).play();
                setTimeout(function(){
                    if(accountID == cc.vv.myAccountID){
                        this.hurtPLayer(this.currentSkillHurt);
                    }
                    skill.destroy();
                }.bind(this),600)              
            }
            if(heroType == 2){
                let skill = cc.instantiate(cc.vv.res.swordSkill);  
                pos.getChildByName("hero").addChild(skill);
                skill.getComponent(cc.Animation).play();
                setTimeout(function(){
                    if(accountID == cc.vv.myAccountID){
                        this.hurtPLayer(this.currentSkillHurt);
                    }
                    skill.destroy();
                }.bind(this),600)             
            }
        }
    },

    // 造成伤害
    hurtPLayer(hurtNum){
        let data = {};
        data.seatIndex = cc.vv.mySeatIndex;
        data.hurtNum = hurtNum;
        cc.vv.socketController.requestHurtPLayer(data,function(err,res){
            if(err){
                console.log(err);
            }else{
                
            }
        })
    },

    // 接收造成的伤害
    onHurtPlayer(){
        let self = this;
        cc.vv.socketController.onHurtPlayer(function(data){
            // 用data计算自己受到的伤害，并返回     
            console.log(data)   
            let realHurtNum = data.hurtNum - self.currentDefense;
            if(realHurtNum > 0){
                self.currentHP = self.currentHP - realHurtNum;
            }else{
                realHurtNum = 1;
            }           
            let ratio = self.currentHP / self.currentTotalHP;
            self.myHeroHP.progress = ratio;   
            self.myHeroInfo.getChildByName("HP").getChildByName("label").getComponent(cc.Label).string = self.currentHP + "/" + self.currentTotalHP; 
            self.sentBeHurt(realHurtNum);
            self.showGameOver();
        })
    },

    // 发出自己造成的真实伤害
    sentBeHurt(realHurtNum){
        let data = {};
        data.realHurtNum = realHurtNum;
        cc.vv.socketController.requestBeHurt(data,function(err,res){
            if(err){
                console.log(err)
            }else{

            }
        })
    },

    //监听其他玩家被自己造成的真实伤害
    onBeHurt(){
        let self = this;
        cc.vv.socketController.onBeHurt(function(data){
            console.log(data)
            //todo 真实的扣除对方的血量并显示
            self.otherCurrentHeroHP -= data.realHurtNum;
            self.otherHeroInfo.getChildByName("HP").getChildByName("label").getComponent(cc.Label).string = self.otherCurrentHeroHP + "/" + self.otherCurrentHeroTotalHP;
            self.otherHeroHP.progress = self.otherCurrentHeroHP/self.otherCurrentHeroTotalHP;
            self.showGameOver();
        })
        
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
            let boutNum = null;
            switch(self.fightCount){
                case 6:boutNum = 1;break;
                case 5:boutNum = 2;break;
                case 4:boutNum = 2;break;
                case 3:boutNum = 3;break;
                case 2:boutNum = 3;break;
                case 1:boutNum = 1;break;
            }
            self.fightBg.getChildByName("boutLabel").getComponent(cc.Label).string = "第 " + boutNum + " 回合";
            self.fightCount --;
            if(self.fightCount <= 0){
                self.fightCount = 6;
                self.fightBoutOverBtn.active = false;
                self.gameBg.active = true;
                self.fightBg.active = false;
                return;
            }
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
    },

    //游戏结束的结算
    showGameOver () {
        if(this.otherCurrentHeroHP <= 0 || this.currentHP <= 0){
            this.gameEnd.active = true;
            if(this.otherCurrentHeroHP <= 0){
                this.gameEnd.getChildByName("endPic").getComponent(cc.Sprite).spriteFrame = cc.vv.res.endWin;
                this.gameEnd.getChildByName("endPic").getChildByName("gameWon").getComponent(cc.Label).string = cc.vv.myGameWon + 1;
                this.gameEnd.getChildByName("endPic").getChildByName("gameLost").getComponent(cc.Label).string = cc.vv.myGameLost;
            }
            if(this.currentHP <= 0){
                this.gameEnd.getChildByName("endPic").getComponent(cc.Sprite).spriteFrame = cc.vv.res.endLost;
                this.gameEnd.getChildByName("endPic").getChildByName("gameWon").getComponent(cc.Label).string = cc.vv.myGameWon;
            this.gameEnd.getChildByName("endPic").getChildByName("gameLost").getComponent(cc.Label).string = cc.vv.myGameLost + 1;
            }
            this.gameEnd.getChildByName("endPic").getChildByName("nickName").getComponent(cc.Label).string = cc.vv.myNickName;
            this.gameEnd.getChildByName("endPic").getChildByName("gold").getComponent(cc.Label).string = this.currentGold;
            setTimeout(function(){
                cc.vv.listener.removeAllListener();
                cc.director.loadScene("room");
            }.bind(this),5000)
            
        }
    },
});

  
  
  

  
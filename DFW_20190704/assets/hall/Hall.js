

cc.Class({
    extends: cc.Component,

    properties: {
        content:cc.Node,
        nickNameLabel:cc.Label,
        gameCountLabel:cc.Label,
        goldLabel:cc.Label,
        heroType:cc.Sprite,
        heroName:cc.Label,
    },



    // onLoad () {},

    start () {
        //生成桌子
        this.creatDesk(cc.vv.res.desk);
        // 告知服务器进入大厅
        this.sentMsg();
        //监听
        this.lostConnection();
        this.onHeroData();
    },

    //生成桌子
    creatDesk(deskPrefab){
        cc.vv.deskList = [];
        for(let i = 1;i <= 30;i++){
            let desk = cc.instantiate(deskPrefab);
            desk.getComponent("Desk").init(i);
            this.content.addChild(desk);
            cc.vv.deskList.push(desk);
        }
    },

    //获取英雄属性的监听
    onHeroData(){
        cc.vv.socketController.onHeroData(function(data){
            cc.vv.myHeroATk = data.heroATK;
            cc.vv.myHeroDefense = data.defense;
            cc.vv.myHeroSkillHurt = data.skill;
            cc.vv.myHeroHP = data.heroHP;
        })
    },

    //加入、离开房间，掉线行为
    lostConnection(){
        cc.vv.socketController.onPlayerJoinRoom(function(data){
            cc.vv.deskList[data.roomID - 1].getComponent("Desk").draw(data);
        });
        cc.vv.socketController.onPlayerLeaveRoom(function(data){
            cc.vv.deskList[data.roomID - 1].getComponent("Desk").remove(data);       
        });
    },

    //给服务器发送进入大厅通知
    sentMsg(){
        this.data = {};
        this.data.accountID = cc.vv.myAccountID;
        let self = this;
        cc.vv.socketController.requestEnterHall(self.data,function(err,res){
            if(err){
                console.log(err);
            }else{
                for(let key in res){
                    if(!res[key].roomID){
                        self.loadMyInfo(res[key]);
                    }else{
                        cc.vv.deskList[res[key].roomID - 1].getComponent("Desk").draw(res[key]);
                    }
                }

            }
        })
    },

    //加载信息
    loadMyInfo(info){
        //数据保存本地       
        cc.vv.myHeroType = info.heroType;
        cc.vv.myNickName = info.nickName;
        cc.vv.myGoldCount = info.gold;
        this.nickNameLabel.string = info.nickName;
        this.goldLabel.string = info.gold;
        this.gameCountLabel.string = "胜：" + info.gameWon + " 负：" + info.gameLost;        
        this.heroType.spriteFrame = cc.vv.res[info.heroType];
        let str = null;
        switch(info.heroType){
            case 1:str = "火焰手";break;
            case 2:str = "死神";break;
            case 3:str = "海豹皇";break;
            case 4:str = "机械狗头人";break;
            case 5:str = "银狐战士";break; 
        }
        this.heroName.string = str;
    },

    //按钮的回调事件
    onButtonclick(event,customData){
        this[customData]();
    },

    //跳转英雄选择场景
    choose(){
        cc.director.loadScene("choose");
    }

    // update (dt) {},
});


cc.Class({
    extends: cc.Component,

    properties: {
        isFight:cc.Node,
        content:cc.Node,
        heroInfoPar:cc.Node,
        chooseBtn:cc.Node,

        nickName:cc.Label,
        goldCount:cc.Label,
    },



    // onLoad () {},

    start () {       
        this.posList = [106,299,518,770,992];
        this.idx = 0;
        this.heroInfoList = this.heroInfoPar.children;
        this.showMyInfo(); 
    },

    showMyInfo(){
        this.nickName.string = cc.vv.myNickName;
        this.goldCount.stirng = cc.vv.myGoldCount;
        let number = Number(cc.vv.myHeroType);
        this.content.x = -this.posList[number - 1];
    },

    //按钮的回调事件
    onButtonclick(event,customData){
        this[customData]();
    },

    //返回大厅
    returnHall(){
        cc.director.loadScene("hall");
    },

    //选择出战英雄
    chooseHero(){
        this.isFight.active = true;
        this.isFight.getComponent(cc.Animation).play();     
        let data = {
            accountID:"accountID",
            heroType:"heroType",
            heroTypeValue:this.idx+1,
            accountIDValue:cc.vv.myAccountID,  
        };
        cc.vv.socketController.requestChangeHeroType(data,function(err,res){
            if(err){
                console.log(err);
            }else{
                cc.vv.myHeroType = res;
            }
        })
    },

    //强化
    intensify(){
        //todo 让英雄的属性提升
        console.log("提升英雄属性")
    },

    //开启英雄
    open(){
        //todo 开启新英雄
        console.log("开启英雄")
    },

    //下一个
    down(){
        //左边英雄信息   
        this.idx += 1;    
        if(this.idx >= this.posList.length){
            this.idx = this.posList.length - 1;
        }
        this.content.x = -this.posList[this.idx];
        //右边英雄属性板
        this.showInfo(this.idx);
    },

    //上一个
    up(){
        //左边英雄信息 
        this.idx -= 1;
        if(this.idx < 0){
            this.idx = 0;
        }
        this.content.x = -this.posList[this.idx];
        //右边英雄属性板
        this.showInfo(this.idx);        
    },

    //更新信息显示
    showInfo(num){
        this.isFight.active = false;
        this.heroInfoPar.getComponent(cc.Animation).play();       
        if(num >= 2){
            this.chooseBtn.getComponent(cc.Button).interactable = false;
            this.chooseBtn.children[0].getComponent(cc.Label).string = "待开启";
        }else{
            this.chooseBtn.getComponent(cc.Button).interactable = true;
            this.chooseBtn.children[0].getComponent(cc.Label).string = "出战";
        }
        for(let i = 0;i < this.heroInfoList.length;i++){
            if(i === num){
                this.heroInfoList[i].active = true;
            }else{
                this.heroInfoList[i].active = false;
            }
        }
    },

    // update (dt) {},
});

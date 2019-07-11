
cc.Class({
    extends: cc.Component,

    properties: {
        roomIdLabel:cc.Label,
        readyBtnLabel:cc.Label,
        leftInfo:cc.Node,
        rightInfo:cc.Node,
        vs:cc.Node,
        timeNum:cc.Node,
    },



    // onLoad () {},

    start () {
        this.onRoom();
        this.enterRoom();
    },

    //监听房间内玩家的进入和离开,是否准备
    onRoom(){
        let self = this;
        //监听玩家加入房间
        cc.vv.socketController.onPlayerJoinRoom(function(data){
            self.loadInfo(data,1);
            self.vsShow(); 
        });
        //监听玩家离开房间
        cc.vv.socketController.onPlayerLeaveRoom(function(data){
            if(self.rightInfo.children[0]){
                self.rightInfo.children[0].destroy();
            }            
            self.timeNum.active = false;
            self.vs.active = false;
        });
        //监听玩家是否准备
        cc.vv.socketController.onPlayerIsReady(function(data){
            if(data.accountID !== cc.vv.myAccountID){
                self.rightInfo.children[0].getComponent("Seat").showReady(data);
            } 
            self.vsShow();                 
        });      
    },

    //进入房间
    enterRoom(){
        this.roomIdLabel.string = cc.vv.myRoomID;
        this.data = {};
        this.data.accountID = cc.vv.myAccountID;
        this.data.isReady = false;
        let self = this;
        cc.vv.socketController.requestEnterRoom(self.data,function(err,res){
            if(err){
                console.log(err);
            }else{   
                // console.log(res);
                res.forEach(p => {
                    if(p.accountID === cc.vv.myAccountID){
                        self.loadInfo(p,-1);
                        self.leftInfo.children[0].getComponent("Seat").showReady(res);
                    }else{
                        self.loadInfo(p,1);                        
                    }
                })
                self.vsShow();
            }
        })
    },

    //是否准备
    isReady(){
        let isReady = false;
        if(this.readyBtnLabel.string == "准备"){
            this.readyBtnLabel.string = "取消准备";
            isReady = true;
        }else{
            this.readyBtnLabel.string = "准备";
            isReady = false;
        }
        this.data = {};
        this.data.isReady = isReady;
        this.data.accountID = cc.vv.myAccountID;
        let self = this;
        cc.vv.socketController.requestIsReady(self.data,function(err,res){
            if(err){
                console.log(err);
            }else{
                self.leftInfo.children[0].getComponent("Seat").showReady(res);               
                self.vsShow();
            }
        })
    },

    //VS显示
    vsShow(){
        if(this.rightInfo.children[0]){
            if(this.rightInfo.children[0].getComponent("Seat").readyNode.active || this.leftInfo.children[0].getComponent("Seat").readyNode.active){
                // 数字计时器，数字跳转完成后显示比拼，游戏开始
                if(this.rightInfo.children[0].getComponent("Seat").readyNode.active && this.leftInfo.children[0].getComponent("Seat").readyNode.active){
                    this.vs.active = true;
                    this.timeNum.active = false; 
                    //todo 显示游戏开始动画，并跳转场景
                    cc.director.loadScene("game");
                }else{
                    this.timeNum.active = true; 
                    this.timeNum.getComponent(cc.Animation).play(); 
                }                                      
            }else{
                this.timeNum.active = false;
            }
        }
    },

    //其他玩家加入房间，加载信息
    loadInfo(data,m){              
        if(m === 1){
            let seat = cc.instantiate(cc.vv.res.rightSeat);
            this.rightInfo.addChild(seat);
            seat.getComponent("Seat").init(data);
        }
        if(m === -1){
            let seat = cc.instantiate(cc.vv.res.leftSeat);
            this.leftInfo.addChild(seat);
            seat.getComponent("Seat").init(data);
        }        
    },

    //按钮的回调事件
    onButtonclick(event,customData){
        this[customData]();
    },

    //离开房间
    leaveRoom(){
        this.data = {};
        //组包 房间号，座位号
        this.data.roomID = cc.vv.myRoomID;
        this.data.seatIndex = cc.vv.mySeatIndex;

        let self = this;
        cc.vv.socketController.requestLeaveRoom(self.data,function(err,res){
            if(err){
                console.log(err);
            }else{
                // console.log(res);
            }
        })
        cc.vv.listener.removeAllListener();
        cc.director.loadScene("hall");
    },

   
});

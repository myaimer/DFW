

cc.Class({
    extends: cc.Component,

    properties: {
        numLabel:cc.Label,
        player1:cc.Node,
        player2:cc.Node,
    },


    init(index){
        this.roomID = index;
        this.numLabel.string = this.roomID;
    },

    start () {

    },

    //根据传入的信息在对应桌子绘制
    draw(p){
        if(p.roomID != this.roomID) return;
        let index = p.seatIndex;
        this.player = this["player" + index];
        this.player.getChildByName("label").getComponent(cc.Label).string = p.nickName;
        this.player.getChildByName("kuang").getComponent(cc.Button).interactable = false;
        this.player.getChildByName("p").getComponent(cc.Sprite).spriteFrame = cc.vv.res.head;

    },

    //根据传入的消息清除对应桌子上的玩家
    remove(p){
        if(p.roomID != this.roomID) return;
        let index = p.seatIndex;
        let player = this["player" + index];
        player.getChildByName("label").getComponent(cc.Label).string = "";
        player.getChildByName("kuang").getComponent(cc.Button).interactable = true;
        player.getChildByName("p").getComponent(cc.Sprite).spriteFrame = null;
    },

    onButtonClick(event,customData){
        this.seatIndex = customData;   
        this.sentJoinRoomMsg();
    },

    //加入房间
    sentJoinRoomMsg(){
        this.data = {};
        this.data.roomID = this.roomID;
        this.data.seatIndex = this.seatIndex;
        let self = this;
        cc.vv.socketController.requestJoinRoom(self.data,function(err,res){
            if(err){
                console.log(err);
            }else{
                cc.vv.myRoomID = res.roomID;
                cc.vv.mySeatIndex = res.seatIndex; 
                cc.vv.listener.removeAllListener();              
                cc.director.loadScene("room");
            }
        })
    },


});

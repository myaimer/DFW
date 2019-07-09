

cc.Class({
    extends: cc.Component,

    properties: {
  
    },


    // onLoad () {},

    init(data){
        this.ran = data.num;
        this.accountID = data.accountID;
        this.seatIndex = data.seatIndex;
    },

    start () {

    },

    //动画播放完成后的回调函数
    animCallback(){
        let dice = "dice_" + this.ran ;
        this.node.getComponent(cc.Sprite).spriteFrame = cc.vv.res[dice];       
        setTimeout(function(){          
            this.node.active = false;
        }.bind(this),2000)
        

    }
    // update (dt) {},
});

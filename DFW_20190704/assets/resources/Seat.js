

cc.Class({
    extends: cc.Component,

    properties: {
        nickNameLabel:cc.Label,
        heroPic:cc.Sprite,
        gameInfoLabel:cc.Label,
        readyNode:cc.Node,     
    },


    // onLoad () {},

    init(data){
        this.nickNameLabel.string = data.nickName;
        this.gameInfoLabel.string = "胜：" + data.gameWon + " 负：" + data.gameLost;
        this.readyNode.active = data.isReady;
        this.heroPic.spriteFrame = cc.vv.res[data.heroType];
    },

    start () {

    },

    //准备表示的显示函数
    showReady(data){
        this.readyNode.active = data.isReady;
    },

});



cc.Class({
    extends: cc.Component,

    properties: {

    },


    // onLoad () {},

    start () {

    },

    startGame(){
        cc.find("Canvas").getComponent("Room").vs.active = true;
        cc.director.loadScene("game");
    }

    // update (dt) {},
});

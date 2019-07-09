

cc.Class({
    extends: cc.Component,

    properties: {
        label:cc.Label,
        pic:cc.Sprite,
    },


    // onLoad () {},

    init(index,ranNum,propPicList){
        this.index = index;
        this.ranNum = ranNum;
        this.propPicList = propPicList;
        this.show();
    },

    start () {

    },

    show(){
        this.label.string = this.index;
        if(this.index === 0){
            this.pic.spriteFrame = cc.vv.res.start;
        }else{
            this.pic.spriteFrame = this.propPicList[this.ranNum];
        } 
    }
    // update (dt) {},
});

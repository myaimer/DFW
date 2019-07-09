

cc.Class({
    extends: cc.Component,

    properties: {
        loadProgressBar:cc.ProgressBar,
    },

 

    // onLoad () {},

    start () {
        this.loading()
    },

    loading(){
        let total = Object.keys(cc.vv.res).length;
        let hasFinish = 0;
        let self = this;
        for (const key in cc.vv.res) {
            let url =  cc.vv.res[key]["url"];
            let type = cc.vv.res[key]['type'];
            cc.loader.loadRes(url,type,function(err,obj){
                if(err){
                    console.log(err)
                }else{
                    cc.vv.res[key] = obj;
                    hasFinish++;
                    self.loadProgressBar.progress = hasFinish/total;
                    if(hasFinish/total === 1 ){
                        cc.director.loadScene("login")
                    }
                }
            })
        }
    }

    // update (dt) {},
});


cc.Class({
    extends: cc.Component,

    properties: {
        // 登录界面
        loginInterface:cc.Node,
        // 注册界面
        registerForm:cc.Node,
        // 注册账号ID
        accountID:cc.EditBox,
        // 昵称
        nickName:cc.EditBox,
        // 注册时的密码
        password:cc.EditBox,
        // 再次输入的密码
        passwordAgain:cc.EditBox,
        // 登录账号
        loginID:cc.EditBox,
        // 登录密码
        loginPassword:cc.EditBox
    },

   
    start () {
      
    },

    login(){
        let errInfo = cc.vv.checkInput(this.loginInterface);
        if(errInfo){
            cc.vv.showHint(errInfo);
        }else{
           let data = {
            accountID :this.loginID.string,
            password :this.loginPassword.string,
        }
        cc.vv.socketController.requestLogin(data,function (err,res) {  
            if(err){
                cc.vv.showHint(err)
            }else{
                cc.vv.myAccountID = data.accountID;
                cc.director.loadScene("hall");
            }
        }) 
        }
        
    },

    onButtonClick(event,customData){
        this[customData]();
    },

    // 登录界面的注册
    register_1(){
        this.loginInterface.active = !this.loginInterface.active;
        this.registerForm.active = !this.registerForm.active;
    },

    register_2(){
        let errInfo = cc.vv.checkInput(this.registerForm);
        let  that = this;
        let  data = {
            accountID:this.accountID.string,
            password:this.password.string,
            nickName:this.nickName.string,
        }
        if(errInfo){
            cc.vv.showHint(errInfo)
        }else{
            cc.vv.socketController.requestRegister(data,function(err,res){
                if(err){
                    cc.log("注册失败")
                }else{
                    cc.vv.showHint("注册成功")
                    that.back()
                }
            })
        }
    },

    back(){
        this.loginInterface.active = !this.loginInterface.active;
        this.registerForm.active = !this.registerForm.active;
        this.accountID.string  = "";
        this.nickName.string  = "";
        this.password.string  = "";
        this.passwordAgain.string  = "";
    },

   
});

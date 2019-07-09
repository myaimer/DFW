let eventListener = (function(){
    let listener = {
    };
    let callbackMap = {};
    // 注册需要监听的事件
    listener.on = function(type,callback){
        if(callbackMap.hasOwnProperty(type)){
            callbackMap[type].push(callback)
        }else{
            callbackMap[type] = [callback];
        }
    }
    // 事件发生时执行的对应的回调函数
    listener.emit = function(type,data){
        let callbackList = callbackMap[type];
        if(callbackList){
            for (let i = 0; i < callbackList.length; i++) {
                let cb = callbackList[i];
                    cb(data)        
            }
        }else{
            console.log("不可能到这里来")
        }
    }
    // 撤销所有的监听器
    listener.removeAllListener = function(){
        callbackMap = {};
    }
    return listener
})()
module.exports = eventListener;
exports.protocol = {
      // 请求类协议.......................................
    // 登录
    REQUEST_LOGIN :"request_login",
    // 注册
    REQUEST_REGISTER: "request_register",
    // 加入房间
    REQUEST_JOIN_ROOM: "request_join_room",
    // 进入房间
    REQUEST_ENTER_ROOM:"request_enter_room",
    // 进入大厅
    REQUEST_ENTER_HALL:"request_enter_hall",
    //离开房间
    REQUEST_LEAVE_ROOM:"request_leave_room",
    //是否准备
    REQUEST_IS_READY:"request_is_ready",
    //更换英雄类型
    REQUEST_CHANGE_HERO_TYPE:"request_change_hero_type",
    //开始游戏
    REQUEST_START_GAME:"request_start_game",
    //聊天
    REQUEST_CHAT:"request_chat",



    // 通知类协议.....................................
    //玩家加入房间（大厅视角）
    ON_PLAYER_JOIN_ROOM: "on_player_join_room",
    //玩家离开房间(大厅视角)
    ON_PLAYER_LEAVE_ROOM: "on_player_leave_room",

    //玩家是否准备
    ON_PLAYER_IS_READY:  "on_player_is_ready",
    //玩家聊天
    ON_PLAYER_CHAT:"on_player_chat",
    //开始游戏
    ON_GAME_START:"on_game_start",

}
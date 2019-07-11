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
    //掷骰子
    REQUEST_THROW_DICE:"request_throw_dice",
    //回合结束
    REQUEST_BOUT_OVER:"request_bout_over",
    //战斗
    REQUEST_FIGHT:"request_fight",
    //释放技能
    REQUEST_USE_SKILL:"request_use_skill",
    //结束战斗
    REQUEST_FIGHT_OVER:"request_fight_over",
    // 造成伤害
    REQUEST_HURT_PLAYER:"request_hurt_player",
    // 被造成的真实伤害
    REQUEST_BE_HURT:"request_be_hurt",
    //传送自己英雄信息
    REQUEST_SENT_HERO_INFO:"request_sent_hero_info",


    // 通知类协议.....................................
    //玩家加入房间（大厅视角）
    ON_PLAYER_JOIN_ROOM: "on_player_join_room",
    //玩家离开房间(大厅视角)
    ON_PLAYER_LEAVE_ROOM: "on_player_leave_room",
    // 英雄数据库
    ON_HERO_DATA:"on_hero_data",

    //玩家是否准备
    ON_PLAYER_IS_READY:  "on_player_is_ready",
    //玩家聊天
    ON_PLAYER_CHAT:"on_player_chat",
    //开始游戏
    ON_GAME_START:"on_game_start",
    //掷骰子
    ON_THROW_DICE:"on_throw_dice",
    //回合结束
    ON_BOUT_OVER:"on_bout_over",
    //战斗
    ON_FIGHT:"on_fight",
    //释放技能
    ON_USE_SKILL:"on_use_skill",
    //结束战斗
    ON_FIGHT_OVER:"on_fight_over",
    // 监听造成的伤害
    ON_HURT_PLAYER:"on_hurt_player",
    // 被造成的真实伤害
    ON_BE_HURT:"on_be_hurt",
    //监听其他玩家的英雄信息
    ON_HERO_INFO:"on_hero_info",

}
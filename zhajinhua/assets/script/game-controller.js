import SocketManager from './socket-manager'
import global from './global'
import EventListener from './common/event-listener'
cc.Class({
    extends: cc.Component,

    properties: {
        mainWorldPrefab: {
            default: null,
            type: cc.Prefab
        },
        gameWorldPrefab: {
            default: null,
            type: cc.Prefab
        }
    },

    // use this for initialization
    onLoad: function () {
        global.socketManager = SocketManager("localhost","3000");
        global.eventlistener = EventListener({});
        if (this.mainWorld !== undefined){
            this.mainWorld.removeFromParent(true);
        }
        this.mainWorld = cc.instantiate(this.mainWorldPrefab);
        this.mainWorld.parent = this.node;


        global.eventlistener.on("login_game",  (username)=> {
            //进入游戏界面
            console.log("enter game world");
            global.socketManager.request("login", {uid: username}, (data)=> {
                console.log("收到注册数据" + JSON.stringify(data));
                if (data.status === 'ok'){
                    global.playerData.uid = username;
                    global.playerData.syncData = data.data;
                    if (this.mainWorld !== undefined){
                        this.mainWorld.removeFromParent(true);
                    }
                    this.mainWorld = cc.instantiate(this.gameWorldPrefab);
                    this.mainWorld.parent = this.node;
                }
            })
        });


        //游戏内消息

        global.eventlistener.on("start_button_click", function () {
            console.log("点击了开始游戏的按钮");
            //向服务器发送开始游戏的按钮
            global.socketManager.emit("start_game");
        });
        global.eventlistener.on("player_button_click", function (buttonID) {
           console.log("gamecontroller  button click =" + buttonID);//玩家点击了按钮
            //给服务器发送玩家操作的消息
            global.socketManager.emit("player_input", buttonID);
            switch (buttonID){
                case "look":
                    global.socketManager.emit("look_cards");
                    break;
                default:
                    break;
            }
        });

        global.eventlistener.on("player_choose_pk", (uid)=>{
           //玩家选好了pk对象，发给服务器
            global.socketManager.emit("player_pk", {
                uid: global.playerData.uid,
                targetid: uid
            });
        });



        //服务器消息
        global.socketManager.on("player_join_in", function (data) {
            console.log("有玩家加入游戏" + data);
            global.gameEventListener.fire("player_join_in", data);
        });
        global.socketManager.on("player_leave", function (data) {
            console.log("有玩家退出了游戏" + JSON.stringify(data));
            global.gameEventListener.fire("player_leave", data);
        });
        global.socketManager.on("change_room_manager", function (data) {
            console.log("房主改变了" + data);
            global.gameEventListener.fire("change_room_manager", data);
        });
        global.socketManager.on("push_cards", function (data) {
          console.log("收到牌" + JSON.stringify(data));
            global.gameEventListener.fire("push_cards", data);
        });
        global.socketManager.on("turn_player_index", function (uid) {
            console.log("现在轮到谁操作了" + uid);
            global.gameEventListener.fire("turn_player_index", uid);
        });
        global.socketManager.on("player_choose_rate", function (data) {
            console.log("玩家选择了倍数" + JSON.stringify(data));
            global.gameEventListener.fire("player_choose_rate", data);
        });
        global.socketManager.on("show_player_cards", function (data) {
            console.log("收到了某人的牌" + JSON.stringify(data));
            global.gameEventListener.fire("player_show_cards", data);
        });
        global.socketManager.on("pk_result", function (data) {
            console.log("收到玩家的pk结果" + JSON.stringify(data));
            global.gameEventListener.fire("pk_result", data);
        });
        global.socketManager.on("game_over", function (data) {
            console.log("收到游戏结束的消息" + JSON.stringify(data));
            global.gameEventListener.fire("game_over", data);
        });
        global.socketManager.on("game_start", function (data) {
           global.gameEventListener.fire("game_start", data);
        });
    },


});

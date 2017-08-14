/**
 * Created by chuhaoyuan on 2017/8/5.
 */
import global from './../../global'
cc.Class({
  extends: cc.Component,
  properties: {

    startButton: {
      default: null,
      type: cc.Node
    }
  },
  onLoad: function () {
    this.changeRoomManager(global.playerData.roomManager);
    global.gameEventListener.on("change_room_manager",  (uid)=>{
      this.changeRoomManager(uid);
    });

    global.gameEventListener.on("push_cards", (data)=>{
      this.node.active = false;
    });
    global.gameEventListener.on("game_over", (data)=>{
      console.log("游戏结束了");
      //
      this.node.active = true;
    });
  },
  changeRoomManager : function (uid) {
    if (uid === global.playerData.uid){
      this.startButton.active = true;
    }else {
      this.startButton.active = false;
    }
  },
  buttonClick: function () {
    console.log("开速开始游戏");
    global.gameEventListener.fire("start_button_click");
  }
});
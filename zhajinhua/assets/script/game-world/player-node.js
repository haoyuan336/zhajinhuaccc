/**
 * Created by chuhaoyuan on 2017/8/4.
 */
import global from './../global'
cc.Class({
  extends: cc.Component,
  properties: {
    nameLabel: {
      default: null,
      type: cc.Label
    },
    roomManagerLabel: {
      default: null,
      type: cc.Label
    },
    pokerPosLlist: {
      default: [],
      type: cc.Node
    },
    cardPrefab: {
      default: null,
      type: cc.Prefab
    }
    
  },
  onLoad: function () {
    global.gameEventListener.on("change_room_manager", (uid)=>{
      this.changeRoomManager(uid);
    });
    global.gameEventListener.on("push_cards", ()=>{
      this.initPoker();
    });
  },
  init: function (data, currentIndex) {
    //使用初始化数据初始化玩家
    console.log("init player data = " + JSON.stringify(data));
    this.uid = data.uid;
    this.nameLabel.string = data.uid;
    this.currentIndex = currentIndex;
    // if (global.playerData.roomManager === this.uid){
    //   //自己是房主
    //   this.changeRoomManager(this.uid);
    // }
    this.changeRoomManager(global.playerData.roomManager);
  },
  changeRoomManager: function (uid) {
    //
    if (this.uid === uid){
      this.roomManagerLabel.string = "房主";
    }else {
      this.roomManagerLabel.string = "";
    }

  },
  initPoker: function () {
    if (global.playerData.uid != this.uid){
      let pokerPos = this.pokerPosLlist[this.currentIndex];
      for (var i = 0 ; i < 3 ; i++){
        var node = cc.instantiate(this.cardPrefab);
        node.parent = this.node;
        node.position = {
          x: pokerPos.x + 60 * i,
          y: pokerPos.y
        }
      }
    }

  }
});
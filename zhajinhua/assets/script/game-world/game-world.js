/**
 * Created by chuhaoyuan on 2017/8/5.
 */
import EventListener from './../common/event-listener'
import global from './../global'
cc.Class({
  extends: cc.Component,
  properties: {
    playerPosition: {
      default: [],
      type: cc.Node
    },
    playerNodePrefab: {
      default: null,
      type: cc.Prefab
    },
    readyUIPrefab: {
      default: null,
      type: cc.Prefab
    },
    pokerUIPrefab: {
      default: null,
      type: cc.Prefab
    }

  },
  onLoad: function () {
    this.playerNodeList = [];
    var syncData = global.playerData.syncData;
    console.log("同步数据 = " + JSON.stringify(syncData));
    global.gameEventListener = EventListener({});
    global.playerData.roomManager = syncData.roomManager;
    let playersList = syncData.players;
    console.log("玩家个数" + playersList.length);
    //取出自己在座位号
    // let index = syncData.index;//自己的座位号
    this.index = syncData.index;
    //从座位号开始，初始化玩家
    for (let i = 0 ; i < playersList.length ; i ++){
      //座位数
      let pl = playersList[i];
      this.createPlayer(pl);
    }

    global.gameEventListener.on("start_button_click",  ()=>{
      console.log("游戏开始按钮");
      //游戏开始按钮

      //如果只有一个玩家，是不能开始游戏的，
      if (this.playerNodeList.length > 1){
        global.eventlistener.fire("start_button_click");
      }


    });
    this.initUI();

    global.gameEventListener.on("player_join_in", (data)=>{
      this.createPlayer(data);
    });
    global.gameEventListener.on("player_leave", (data)=>{
      //
      this.deletePlayer(data);
    });
    global.gameEventListener.on("change_room_manager", (data)=>{
      // this.changeRoomManager(data);
    });

  },
  createPlayer : function (data) {
    console.log("根据数据创建一个玩家" + JSON.stringify(data));
    var playNode = cc.instantiate(this.playerNodePrefab);
    playNode.parent = this.node;
    let current = data.index - this.index; //玩家的座位号 -去 自己的座位号，就是他当前的座位号
    if (current < 0){
      current = 6 - Math.abs(current);
    }
    console.log("currentINdex = " + current);
    playNode.position = this.playerPosition[current].position;
    playNode.getComponent("player-node").init(data,current);
    this.playerNodeList.push(playNode);
  },
  deletePlayer : function (data) {
    //删掉玩家
    console.log("delete player = " + data);
    for (let i = 0 ; i < this.playerNodeList.length ; i ++){
      let playerNode = this.playerNodeList[i];
      if (playerNode.getComponent("player-node").uid === data){
        playerNode.removeFromParent(true);
        this.playerNodeList.splice(i, 1);
      }
    }
  },

  initUI: function () {

    let ui = cc.instantiate(this.readyUIPrefab);
    ui.parent = this.node;
    let pokerUI = cc.instantiate(this.pokerUIPrefab);
    pokerUI.parent = this.node;
  }
});
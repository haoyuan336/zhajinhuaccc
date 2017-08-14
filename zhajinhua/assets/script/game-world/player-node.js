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
    },
    rateLabel: {
      default: null,
      type: cc.Label
    },
    choosePlayerButton: {
      default: null,
      type: cc.Node
    },
    pkResultLabel: {
      default: null,
      type: cc.Label
    },
    winLabel: {
      default: null,
      type: cc.Label
    }
    ,
    totalScoreLabel: {
      default: null,
      type: cc.Label
    }
  },
  onLoad: function () {

    this.choosePlayerButton.active = false;

    global.gameEventListener.on("change_room_manager", (uid)=>{
      this.changeRoomManager(uid);
    });
    global.gameEventListener.on("push_cards", ()=>{
      this.initPoker();
    });
    global.gameEventListener.on("player_choose_rate", (data)=>{
      let uid = data.uid;
      let rate = data.rate;
      this.playerChooseRate(uid, rate);
    });
    global.gameEventListener.on("player_pk",()=>{
      console.log(" 玩家选择pk");
      if (this.uid !== global.playerData.uid){
        this.choosePlayerButton.active = true;
      }
    });
    global.gameEventListener.on("player_choose_pk", (uid)=>{
    //  玩家选好了 pk对象
      this.choosePlayerButton.active = false;

    });
    global.gameEventListener.on("player_show_cards", (data)=>{
      let targetId = data.targetid;
      if (targetId === this.uid){
        this.showPokerValue(data.cards);
      }
    });
    global.gameEventListener.on("pk_result", (data)=>{
      console.log("收到了 pk result" + JSON.stringify(data));
      if (data.lose === this.uid){
        //这个玩家输了
        console.log("这个玩家输了");
        this.pkResultLabel.string = 'pk lose';
      }
    });
    global.gameEventListener.on("game_over",  (data)=> {
      let winUid = data.win;
      if (winUid === this.uid){
        //这位玩家胜利了
        this.winLabel.string = "WIN";//胜利
      }
      console.log("player node data = " + JSON.stringify(data));
      console.log("player node uid = " + this.uid);
      let map = data.data[this.uid];
      console.log("player node map = " + JSON.stringify(map));
      let cards = map.cards;
      this.totalScoreLabel = map.totalScore;
      this.showPokerValue(cards);
    })
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
  playerChooseRate: function (uid, rate) {
    if (uid === this.uid){
      this.rateLabel.string = "倍数" + rate;
    }
  },
  chooseButtonClick: function () {
    global.gameEventListener.fire("player_choose_pk", this.uid);

  },
  initPoker: function () {
    this.cardsList = [];
    if (global.playerData.uid != this.uid){
      let pokerPos = this.pokerPosLlist[this.currentIndex];
      for (var i = 0 ; i < 3 ; i++){
        var node = cc.instantiate(this.cardPrefab);
        node.parent = this.node;
        node.position = {
          x: pokerPos.x + 60 * i,
          y: pokerPos.y
        }
        this.cardsList.push(node);
      }
    }
  },
  showPokerValue: function (cards) {
    console.log("show card value = " + JSON.stringify(cards));
    for (var i = 0 ; i < this.cardsList.length ; i ++ ){
      var card = this.cardsList[i];
      card.getComponent("card-node").showValue(cards[i]);
    }
  }
});
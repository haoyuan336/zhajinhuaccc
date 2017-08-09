/**
 * Created by chuhaoyuan on 2017/8/6.
 */
import global from './../../global'
cc.Class({
  extends: cc.Component,
  properties:{
    pokerPos: {
      default: null,
      type: cc.Node
    },
    cardPrefab: {
      default: null,
      type: cc.Prefab
    },
    uiButtons: {
      default: null,
      type: cc.Node
    }

  },
  onLoad: function () {
    this.uiButtons.active = false;
    global.gameEventListener.on("push_cards", (data)=>{
      console.log("收到了poker 牌" + JSON.stringify(data));
      this.initPokers(data);
      this.uiButtons.active = true;
    });
    global.gameEventListener.on("turn_player_index", (uid)=>{
      //轮到我操作的时候，开始倒计时

      if (uid === global.playerData.uid){

        this.disableButton(true);
      }else {
        this.disableButton(false);
      }
    });
    //先禁用按钮

    //获取到按钮组件


    var uiNode = this.node.getChildByName("ui");
    this.buttonNodeList = uiNode.children;
    this.disableButton(false);
  },
  initPokers: function (data) {
    this.pokersData = data;
    this.cardsList = [];
    for (let i = 0 ; i < 3; i ++){
      var node = cc.instantiate(this.cardPrefab);
      node.parent = this.node;
      node.position = {
        x: this.pokerPos.x + (3 - 1) * 100 * - 0.5 + i * 100,
        y: this.pokerPos.y
      };
      this.cardsList.push(node);
    }
  },
  showPokerValue: function () {
    for (let i = 0 ; i < 3 ; i ++ ){
      this.cardsList[i].getComponent("card-node").showValue(this.pokersData[i]);
    }
  },
  buttonClick: function (target, customData) {
    console.log("button click = " + customData);
    switch (customData){
      case "look":
        global.gameEventListener.fire("player_button_click", "look");
        this.showPokerValue();
        break;
      case "1rate":
        break;
      default:
        break;
    };
    this.disableButton(false); //玩家操作之后，禁用按钮
  },
  disableButton: function (value) {
    console.log("禁用按钮" + value);
    for (var i in this.buttonNodeList){
      this.buttonNodeList[i].interactable = value;
    }
  }

});
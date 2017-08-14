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
    lookButton: {
      default: null,
      type: cc.Button
    },
    rate1Button: {
      default: null,
      type: cc.Button
    },
    rate2Button: {
      default: null,
      type: cc.Button
    },
    rate5Button: {
      default: null,
      type: cc.Button
    },
    pkButton: {
      default: null,
      type: cc.Button
    },
    giveupButton: {
      default: null,
      type: cc.Button
    }

  },
  onLoad: function () {
    global.gameEventListener.on("push_cards", (data)=>{
      //发完牌之后，玩家就可以操作ui了。所以
      console.log("收到了poker 牌" + JSON.stringify(data));
      this.initPokers(data);
      //发完牌之后可以看牌
      this.lookButton.interactable = true;
      // this.uiButtons.active = true;
    });
    global.gameEventListener.on("turn_player_index", (data)=>{
      //轮到我操作的时候，开始倒计时
      console.log("轮到谁 出牌了" + data.uid);
      let uid = data.uid;
      let currentRate = data.rate; // 取出当前的倍数
      if (global.playerData.uid === uid){
        //轮到自己出牌了，所以开启输入


        let rateList = [1,2,5];
        for (let i = 0 ; i < 3 ; i ++){
          if (rateList[i] >= currentRate){
            this['rate' + rateList[i] + 'Button'].interactable = true;
          }
        }

        this.pkButton.interactable = true;
        this.giveupButton.interactable = true;
      }
    });
    //先禁用按钮

    global.gameEventListener.on("pk_result", (data)=>{
      let lose = data.lose;
      if (lose === global.playerData.uid){
        //自己输了，
      }
    });

    global.gameEventListener.on("game_over", (data)=>{
      console.log("游戏结束了");
      //
    });

    //获取到按钮组件
    this.disbaleBtton();

  },
  disbaleBtton: function () {
    this.lookButton.interactable = false;
    this.rate1Button.interactable = false;
    this.rate2Button.interactable = false;
    this.rate5Button.interactable = false;
    this.pkButton.interactable = false;
    this.giveupButton.interactable = false;
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
    global.gameEventListener.fire("player_button_click", customData);

    target.interactable = false;

    switch (customData){
      case "look":

        this.showPokerValue();
        this.lookButton.interactable = false;

        break;

      case "1rate":

      case "2rate":
      case "5rate":

        this.disbaleBtton();

        break;
      case "pk":

        global.gameEventListener.fire("player_pk");
        this.disbaleBtton();

        break;
      case 'giveup':
        break;
      default:
        break;
    };
  },


});
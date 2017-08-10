/**
 * Created by chuhaoyuan on 2017/8/6.
 */
const global = {};
global.getPlayerData = function (player) {
  return {
    uid: player.uid,
    index: player.index,
    state: player.getState()
  }
};
global.pokerValue = ["1","2","3","4","5","6","7","8","9","10","11","12","13"];
global.pokerColor = ["spades","hearts","clubs","diamonds"]; //黑红梅方

global.getCardsScore = function (cards) {
  var score = 0;
  console.log("cards = " + JSON.stringify(cards));
  //检查对子
  var map = {};
  for (var i = 0 ; i < cards.length ; i ++){
    var card = cards[i];
    map[card.value] = true;
  }
  console.log("map length = " + Object.keys(map));
  if (Object.keys(map) === 2){
    //说明是有对子的 加一分
    console.log("对子");
    score += 1;
  }

  //检查顺子
  var list = [];
  for(var i = 0 ; i < cards.length ; i ++){
    list.push(parseInt(cards[i].value));
  }
  //然后排序
  list.sort(function (a ,b) {
    return a > b
  });
  console.log("list = " + JSON.stringify(list));

  if (list[0] + list[2] === list[1] * 2){
    //是顺子 加一分
    console.log("顺子");
    score += 2;
  }

  //检查同花
  map = {};
  for (var i = 0 ; i < cards.length ; i ++){
    map[cards[i].color] = true;
  }
  console.log("map = " + JSON.stringify(map));
  if (Object.keys(map) === 1){
    console.log("是同花");
    score += 3;
  }

  //检查豹子
  map = {};
  for (var i = 0 ; i < cards.length ; i ++){
    map[cards[i].value] = true;
  }
  console.log("map = " + JSON.stringify(map));
  if (Object.keys(map) === 1){
    console.log("是豹子");
    score += 5;
  }
  return score;
};

module.exports = global;
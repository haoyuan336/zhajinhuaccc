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


const checkDouble = function (cards) {
  var map = {};
  var valueList = [];
  var doubleValue = 0;
  for (var i = 0 ; i < cards.length ; i ++){
    if (map.hasOwnProperty(cards[i].value)){
      doubleValue = cards[i].value;
    }
    map[cards[i].value] = true;
    valueList.push(parseInt(cards[i].value));
  }
  if (Object.keys(map).length === 2){
    valueList.sort(function (a, b) {
      if (a === doubleValue){
        return false
      }
      if (b === doubleValue){
        return true;
      }
      return false;
    });
    return valueList
  }
  
  
  return false
};
const checkSmooth = function (cards) {
  var list = [];
  for (var i = 0 ; i < cards.length ; i ++){
    list.push(parseInt(cards[i].value));
  }
  list.sort(function (a,b) {
    if (a === 1){
      return false
    }
    if (b === 1){
      return true;
    }
    if (a < b){
      return true; //从大到小排序
    }
    return false;
  });

  if (Math.abs(list[0] - list[1]) === 1 && Math.abs(list[1] - list[2]) === 1){
    //这是顺子
    return list;
  }
  if (list[0] === 1 && list[1] === 13 && list[2] === 12){
    // qka//特殊情况
    return list;
  }

  return false;
};



const checkFlush = function (cards) {
  var map = {};
  var list = [];
  for (var i = 0 ; i < cards.length ; i ++){
    map[cards[i].color] = true;
    list.push(parseInt(cards[i].value));
  }
  console.log("同花顺检查")
  console.log("list = " + JSON.stringify(list));
  if (Object.keys(map).length === 1){
    //这是同花
    list.sort(function (a , b) {

      if (a === 1){
        return false
      }
      if (b === 1){
        return true;
      }


      if (a < b){
        return true;
      }
      return false;
    });
    return list;
  }
  return false;
};


const checkLeopard = function (cards) {
  var map = {};
  var list = [];
  for (var i = 0 ; i < cards.length ; i ++){
    map[cards[i].value] = true;
    list.push(parseInt(cards[i].value));
  }
  if (Object.keys(map).length === 1){
    //是豹子
    return list
  }
  return false;
};


const getCardsScore = function (cards) {
  var scoreList = [];
  var score = 0;
  var result = [];
  for (var i = 0 ; i < cards.length ; i ++){
    result.push(parseInt(cards[i].value));
  }
  result.sort(function (a , b) {
    if (a === 1){
      return false
    }
    if (b === 1){
      return true;
    }
    if (a < b){
      return true
    }
    return false
  });


  if (checkDouble(cards)){
    result = checkDouble(cards);
    score += 1;
  }
  if (checkSmooth(cards)){
    result = checkSmooth(cards);
    score += 1;

  }
  if (checkFlush(cards)){
    result = checkFlush(cards);

    score += 1;
  }
  if (checkLeopard(cards)){
    result = checkLeopard(cards);
    score += 1;
  }
  scoreList.push(score);
  for (var i = 0 ; i < result.length ; i ++){
    scoreList.push(result[i]);
  }


  console.log("get card score = " + JSON.stringify(scoreList));
  return scoreList;
};


global.pkCards = function (card1, card2) {
  var score1 = getCardsScore(card1);
  var score2 = getCardsScore(card2);
  console.log("score map 1" + JSON.stringify(score1));
  console.log("score map 2" + JSON.stringify(score2));
  for (var i = 0 ; i < 4 ; i ++){
    if (score1[i] > score2[i]){
      console.log("pk 胜");
      return true;
    }
  }
  return false;
};

module.exports = global;
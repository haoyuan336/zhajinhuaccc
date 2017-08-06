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
// global.getRandomPokerValue = function () {
//   return getRandomValueInList(global.pokerValue);
// };
// global.getRandomPokerColor = function () {
//   return getRandomValueInList(global.pokerColor);
// };
// const getRandomValueInList = function (list) {
//   return list[Math.round(Math.random() * list.length)];
// };
module.exports = global;
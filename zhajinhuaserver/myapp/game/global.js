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
module.exports = global;
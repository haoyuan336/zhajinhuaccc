/**
 * Created by chuhaoyuan on 2017/8/2.
 */
const Room = function () {
  var that = {};
  console.log("创建了一个房间");
  var _playerList = [];
  that.pushPlayer = function (player) {
    _playerList.push(player);
  };
  that.deletePlayer = function (uid) {
    for (var i = 0 ; i < _playerList.length ; i ++){
      var player = _playerList[i];
      if (player.uid = uid){
        _playerList.splice(i , 1);
      }
    }
  };
  that.getPlayerCount = function () {
    return _playerList.length;
  };
  return that;
};
module.exports = Room;
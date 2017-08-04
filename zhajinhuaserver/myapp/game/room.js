/**
 * Created by chuhaoyuan on 2017/8/2.
 */
const RoomState = {
  Invalide: -1,
  Waitting: 1,
  Running: 2
};
const Room = function () {
  var that = {};
  var _roomManager = null;
  console.log("创建了一个房间");
  var _playerList = [];
  that.pushPlayer = function (player) {
    if (_playerList.length === 0){
      _roomManager = player.uid;
    }
    player.room = that;
    _playerList.push(player);
  };


  that.deletePlayer = function (uid) {
    for (var i = 0 ; i < _playerList.length ; i ++){
      var player = _playerList[i];
      if (player.uid === uid) {
        _playerList.splice(i, 1);
      }
    }
    if (_roomManager === uid){
      //房主退出了游戏，
      if (_playerList.length !== 0){
        _roomManager = _playerList[_playerList.length - 1];
        changeRoomManger();
      }

    }
  };
  that.getPlayerCount = function () {
    return _playerList.length;
  };



  that.playerReady = function (object) {
    for (var i = 0 ; i < _playerList.length ; i ++){
      _playerList[i].playerReady({
        uid: object.uid,
        isReady: object.isReady
      });
    }
  };
  that.roomManagerStartGame = function (uid) {

  };


  const changeRoomManger = function () {
    for (var i = 0 ; i < _playerList.length ; i ++){
      _playerList[i].changeRoomManager(_roomManager);
    }
  };

  return that;
};
module.exports = Room;
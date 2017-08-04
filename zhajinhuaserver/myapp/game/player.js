/**
 * Created by chuhaoyuan on 2017/8/2.
 */
const PlayerState = {
  Invalide: -1,
  Waiting: 1,
  Running: 2,

};

const Player = function (socket) {
  var that = socket;
  console.log("创建了一个玩家");
  that.isReady = false;

  socket.on("disconnect", function () {
    console.log("断开连接");
    that.room.deletePlayer(that.uid);
  });

  socket.on("ready", function (value) {
    that.isReady = value;
    that.room.playerReady(that);
  });
  socket.on("start_game", function () {
    console.log("房主开始游戏");
    that.room.roomManagerStartGame(that.uid);
  });

  that.sendCard = function (data) {
    socket.emit("push_cards", data);
  };

  that.playerReady = function (value) {
    socket.emit("player_ready", value);
  };

  that.changeRoomManager = function (uid) {
    socket.emit("change_room_manager" , uid);
  };

  return that;
};
module.exports = Player;
/**
 * Created by chuhaoyuan on 2017/8/2.
 */
const SocketIo = require("socket.io");
const Player  = require("./player");
const Room = require("./room");
const Socket = function (app) {
  var that = SocketIo(app);
  var _roomList = [Room()];


  that.on("connection", function (socket) {
    console.log("a user connection");

    if (_roomList[_roomList.length - 1].getPlayerCount() >6){
      _roomList.push(Room());
    }
    _roomList[_roomList.length - 1].pushPlayer(Player(socket));

  });
  return that;
};
module.exports = Socket;
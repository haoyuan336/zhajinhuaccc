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
    socket.on("message", function (data) {
      console.log("message = " + JSON.stringify(data));
      if (data.body.message === 'login'){
        playerLogin(data);

      }
    });
    const playerLogin = function (data) {
      console.log("玩家登陆" + JSON.stringify(data));
      var uid = data.body.data.uid;
      socket.uid = uid;
      if (_roomList[_roomList.length - 1].getPlayerCount() === 6){
        _roomList.push(Room());
      }
      _roomList[_roomList.length - 1].pushPlayer(Player(socket), function (syncData) {
        console.log("创建玩家成功了");
        //回调
        socket.emit("message",{
          id: data.id,
          body: {
            status: "ok",
            data: syncData
          }

        })
      });



      // socket.emit("message",{
      //   id: data.id,
      //   body: {
      //     status: "ok",
      //     data: {msg: "welcome" + data.body.data.uid}
      //   }
      // })

    }





  });
  return that;
};
module.exports = Socket;
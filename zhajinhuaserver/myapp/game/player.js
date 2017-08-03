/**
 * Created by chuhaoyuan on 2017/8/2.
 */
const Player = function (socket) {
  var that = {};
  console.log("创建了一个玩家");
  socket.on("disconnect", function () {
    console.log("断开连接");
  });
  return that;
};
module.exports = Player;
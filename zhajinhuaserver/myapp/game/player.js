/**
 * Created by chuhaoyuan on 2017/8/2.
 */
const Player = function (socket) {
  var that = {};
  console.log("创建了一个玩家");

  socket.emit("welcome","welcome");
  socket.on("login", function (data) {
    console.log("玩家登陆了，用户名为" + data);
  });
  return that;
};
module.exports = Player;
/**
 * Created by chuhaoyuan on 2017/8/2.
 */
const global = require("./global")
const PlayerState = {
  Invalide: -1,
  Waiting: 1,
  Running: 2,
  Ready: 3,
  UnReady: 4

};

const Player = function (socket) {
  var that = socket;
  var _state = PlayerState.Invalide;
  var _isOffline = false;
  var _currentCardsList = [];
  console.log("创建了一个玩家");
  that.isReady = false;
  that.index = undefined;
  that.uid = socket.uid;

  socket.on("disconnect", function () {
    console.log("断开连接");
    _isOffline = true;
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

  socket.on("player_input", function (data) {
    console.log("玩家输入了操作" + data);
    switch (data){
      case "look":

        // that.room.pla
        break;
      case '1rate':
        that.room.playerChooseRate(that.uid,1);
        break;
      case "2rate":
        that.room.playerChooseRate(that.uid, 2);
        break;
      case "5rate":
        that.room.playerChooseRate(that.uid, 5);
        break;
      case "pk":
        break;
      case "giveup":
        break;
      default:
        break;
    }

  });

  socket.on("player_pk", function (data) {
    //玩家选择了pk
    that.room.playerPK(data.uid, data.targetid);
  });




  that.getCurrentCards = function () {
    return _currentCardsList;
  };

  that.sendCard = function (data) {
    // global.getCardsScore(data);
    _currentCardsList = data;
    socket.emit("push_cards", data);
  };

  that.playerReady = function (value) {
    socket.emit("player_ready", value);
  };
  that.playerJoinIn = function (pl) {
    socket.emit("player_join_in",global.getPlayerData(pl));
  };
  that.playerLeave = function (data) {
    socket.emit("player_leave", data);
  };

  that.changeRoomManager = function (uid) {
    socket.emit("change_room_manager" , uid);
  };
  that.turnPlayerIndex = function (data) {
    socket.emit("turn_player_index", data);
  };
  that.playerChooseRate = function (uid, rate, totalRate) {
    socket.emit("player_choose_rate", {
      uid: uid,
      rate: rate,
      totalRate: totalRate
    });
  };

  that.sendPlayersCards = function (uid, cards) {
    socket.emit("show_player_cards", {
      targetid: uid,
      cards: cards
    })
  };


  that.getState = function () {
    console.log("player state = " + _state);
    if (_state === PlayerState.Ready){
      return "Ready";
    }
    if (_state === PlayerState.UnReady){
      return "UnReady";
    }
  };

  const setState = function (state) {
    if (_state === state){
      return
    }
    switch (state){
      case PlayerState.Invalide:
        break;
      case PlayerState.Running:
        break;
      case PlayerState.UnReady:
        break;
      case PlayerState.Ready:
        break;
      default:
        break;
    }
    _state = state;
  };
  setState(PlayerState.UnReady);
  return that;
};
module.exports = Player;
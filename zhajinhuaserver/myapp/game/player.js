/**
 * Created by chuhaoyuan on 2017/8/2.
 */
const global = require("./global")
const PlayerState = {
  Invalide: -1,
  Waiting: 1,
  Running: 2,
  Ready: 3,
  UnReady: 4,
  Win: 5,
  Lose: 6,
  GiveUp: 7
};





const Player = function (socket) {
  var that = socket;
  var _state = PlayerState.Invalide;
  var _isOffline = false;
  var _currentCardsList = [];
  var _currentScore = 0;
  var _totalScore = 0;
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
        _currentScore += 1;
        that.room.playerChooseRate(that.uid,1);
        break;
      case "2rate":
        _currentScore += 2;
        that.room.playerChooseRate(that.uid, 2);
        break;
      case "5rate":
        _currentScore += 5;
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
    //发牌的时候游戏开始
    setState(PlayerState.Running);
    _currentCardsList = data;
    // _currentCardsList = [{"value":"2","color":"clubs"},{"value":"1","color":"clubs"},{"value":"3","color":"clubs"}];
    socket.emit("push_cards", _currentCardsList);
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
  that.subScore = function (score) {
    _currentScore -= score;
  };
  that.sendGameState = function (data) {
    socket.emit("game_start", data);
  };

  that.sendPlayersCards = function (uid, cards) {
    socket.emit("show_player_cards", {
      targetid: uid,
      cards: cards
    })
  };
  that.sendPKresult = function (data) {
    //收到了PK结果
    if (data.lose === that.uid){
      //自己输了
      setState(PlayerState.Lose);
    }
    socket.emit("pk_result", data);
  };
  that.sendPlayerLose = function (uid) {

  };

  that.sendGameOver = function (data) {
    socket.emit("game_over", data);
  };

  that.getState = function () {
    // console.log("player state = " + _state);
    switch (_state){
      case PlayerState.Waiting:
        return 'waiting';
        break;
      case PlayerState.Running:
        return "running";
      break;
      case PlayerState.Lose:
        return "lose";
        break;
      case PlayerState.GiveUp:
        return "giveup";
        break;
      default:
        return "no case";
        break;
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
      case PlayerState.Lose:
        break;
      case PlayerState.Win:
        break;
      case PlayerState.GiveUp:
        break;
      default:
        break;
    }
    _state = state;
  };
  setState(PlayerState.UnReady);

  // that.getLose = function () {
  //   if (_state === PlayerState.Lose || _state === PlayerState.GiveUp){
  //     return "lose";
  //   }
  //   return "running";
  // };

  that.getCurrentScore = function () {
    return _currentScore;
  };
  
  that.playerWin = function (uid) {
   
  };
  that.getTotalScore = function () {
    return _totalScore;
  };
  return that;
};
module.exports = Player;
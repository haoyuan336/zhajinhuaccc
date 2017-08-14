/**
 * Created by chuhaoyuan on 2017/8/2.
 */
const global = require("./global");
const Card = require("./card")
const RoomState = {
  Invalide: -1,
  Waitting: 1,
  Running: 2
};
const Room = function () {
  var that = {};
  var _roomManager = null;
  var _turnPlayerIndex = 0;
  console.log("创建了一个房间");
  var _cardList = [];
  var _playerList = [];
  var _currentRate = 0;
  var _totalRate = 0;
  that.pushPlayer = function (player, cb) {
    if (_playerList.length === 0){
      _roomManager = player.uid;
    }
    player.room = that;
    _playerList.push(player);
    player.index = _playerList.length - 1; //玩家的座位号
    //同步信息 发送同步信息
    syncPlayerData(cb);
    playerJoinIn(player);
  };
  const syncPlayerData = function (cb) {
    //
    var list = [];
    for (var i = 0; i < _playerList.length ; i ++){
      var pl = _playerList[i];
      list.push(global.getPlayerData(pl));
    }
    if (cb){
      cb({
        roomManager: _roomManager,
        index: _playerList.length - 1,
        players: list
      })
    }
  };


  that.deletePlayer = function (uid) {
    console.log("删掉玩家" + uid);
    for (var i = 0 ; i < _playerList.length ; i ++){
      var player = _playerList[i];
      if (player.uid === uid) {
        _playerList.splice(i, 1);
      }
    }



    playerLeave(uid);

    if (_roomManager === uid){
      //
      console.log("房主退出了游戏");
      //房主退出了游戏，
      console.log("当前玩家的个数 = " + _playerList.length);
      if (_playerList.length !== 0){
        _roomManager = _playerList[_playerList.length - 1].uid;
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
    if (_roomManager === uid){
      //房主开始了游戏 ，那就开始发牌吧
      pushCard();
    }else {
      console.log(uid + "不是房主");
    }
  };

  that.playerChooseRate = function (uid,rate) {
    console.log(uid + "player choose rate =  " + rate);
    _currentRate = rate;
    _totalRate += _currentRate;
    //告诉所有人 此玩家选择了倍数
    for (var i = 0 ; i < _playerList.length ; i ++){
      _playerList[i].playerChooseRate(uid, rate, _totalRate);
    }
    turnPlayerIndex();
  };
  that.playerLookCards = function (uid) {
    console.log("player " + uid + "看牌了");
    for (var i = 0 ; i < _playerList.length ; i ++){
      if (_playerList[i].uid !== uid){
        _playerList[i].playerLookCards(uid);
      }
    }
  };
  that.playerPK = function (uid, targetid) {
    console.log(uid + "玩家选择与" + targetid + "pk");
    var playerMap = {};
    for (var i = 0 ; i < _playerList.length ; i ++){
      playerMap[_playerList[i].uid] = _playerList[i];
    }
    playerMap[uid].sendPlayersCards(targetid,playerMap[targetid].getCurrentCards());
    var result = global.pkCards(playerMap[uid].getCurrentCards(), playerMap[targetid].getCurrentCards());
    console.log("result = " + result);
    sendPkResult({
          win: result?uid: targetid,
          lose: result?targetid: uid
        });
    turnPlayerIndex();
  };




  that.playerGiveUp = function (uid) {
    console.log("玩家弃牌了" + uid);
  };

  const sendPlayerGiveUp = function () {

  };
  const sendPlayerLose = function (uid) {
    for (var i = 0 ; i < _playerList.length ; i ++){
      _playerList[i].sendPlayerLose(uid);
    }
  };
  const sendPkResult = function (data) {
    console.log("像所有人发送pk结果");
    for (var i = 0 ; i < _playerList.length ; i ++){
      _playerList[i].sendPKresult(data);
    }
  };

  const changeRoomManger = function () {
    console.log("房主改变了 " + _playerList.length);
    console.log("房主是 " + _roomManager);
    for (var i = 0 ; i < _playerList.length ; i ++){
      console.log("uid = " + _playerList[i].uid);
      _playerList[i].changeRoomManager(_roomManager);
    }
  };


  const playerJoinIn = function (player) {
    console.log("有玩家加入房间" + player.uid);
    //除了自己之外的玩家都会收到，加入信息
    for (var i = 0 ; i < _playerList.length ; i ++){
      var pl = _playerList[i];
      if (pl.uid !== player.uid){
        pl.playerJoinIn(player);
      }
    }
  };
  const playerLeave = function (uid) {
    console.log("玩家离开了游戏" + uid);
    for (var i in _playerList){
      var pl = _playerList[i];
      pl.playerLeave(uid);
    }
  };
  const pushCard = function () {
    //发牌

    //根据牌面 与玩家的个数，给玩家发牌
    if (_cardList.length >= _playerList.length * 3){
      //牌的个数大于玩家的个数*3,每人三张牌
    }else {
      //否则重新初始化牌，并洗牌
      initCards();
    }
    for (var i = 0 ; i < _playerList.length ; i ++){
      var cards = [];
      var player = _playerList[i];
      for (var j = 0 ; j < 3 ; j ++){
        cards.push(_cardList[_cardList.length - 1]);
        _cardList.splice(_cardList.length - 1, 1);
        //发一张牌，自己就去掉一张牌
      }
      player.sendCard(cards);
    }
    ///发完牌之后，房间将轮到谁出牌的才做发送给每个玩家
    turnPlayerIndex();
  };



  const initCards = function () {
    var cardList = [];
    for (var i = 0 ; i < global.pokerValue.length ; i ++){
      for (var j = 0 ; j < global.pokerColor.length ; j ++){
        var card = Card(global.pokerValue[i], global.pokerColor[j]);
        // console.log("card = " + JSON.stringify(card));
        cardList.push(card);
      }
    }
    for (var i = 0 ; i < 52; i ++){
      var index = Math.floor(Math.random() * cardList.length);
      var temp = cardList[index];
      cardList[index] = cardList[i];
      cardList[i] = temp;
    }
    _cardList = cardList;
  };


  initCards();


  const turnPlayerIndex = function () {

    //检查是否只剩下一名胜利玩家
    var leftPlayerCount = 0;
    var winPlayer = undefined;
    for (var i in _playerList){
      console.log("player state = " + _playerList[i].getState());
      if (_playerList[i].getState() === 'running'){
        leftPlayerCount ++;
        winPlayer = _playerList[i].uid;
      }
    }
    console.log("left player count = " + leftPlayerCount);
    if (leftPlayerCount === 1){
      //只剩下一个还没有失败的玩家的时候， 这时候游戏结束
      //给大家发送游戏结束的消息
      sendGameOver(winPlayer);
      return
    }


    //轮到下一位玩家了


    if (_turnPlayerIndex === _playerList.length){
      _turnPlayerIndex  = 0;
    }

    console.log("current player index = " + _turnPlayerIndex);
    if (_playerList[_turnPlayerIndex].getState() === 'lose'){
      _turnPlayerIndex ++;
      //如果当前玩家 输了 有可能是弃牌了，有可能是被pk 失败了，所以轮到下一位玩家出牌
      turnPlayerIndex();
      return;
    }

    for (var  i = 0 ; i < _playerList.length ; i ++){
      var player = _playerList[i];
      player.turnPlayerIndex({
        uid: _playerList[_turnPlayerIndex].uid,
        rate: _currentRate
      });
    }
    _turnPlayerIndex ++;
  };


  const sendGameOver = function (winUid) {
//这时候进行分数结算
    var dataMap = {};
    for (var i in _playerList){
      _playerList[i].playerWin(winUid);
      dataMap[_playerList[i].uid] = {
        cards: _playerList[i].getCurrentCards(),
        currentScore: _playerList[i].getCurrentScore(),
        totalScore: _playerList[i].getTotalScore()
      };
    };
    console.log('data map =  ' + JSON.stringify(dataMap));

    for (var i in _playerList){
      _playerList[i].sendGameOver({
        win: winUid,
        data: dataMap
      });
    }
  };

  return that;
};
module.exports = Room;
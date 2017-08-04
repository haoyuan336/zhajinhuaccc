const EventEmitter = function () {
  let that = {};

  let regisiter = {};
  
  that.emit = function (name) {
    
  };
  that.on = function (name, method) {
    
  };
  
  return that;
};



const Message = function (id, route,body) {
  this.id = id;
  this.route = route;
  this.body = body;
};
const Protocol = function () {
  let that = {};

  let HEADER = 5;
  that.encode = function (id, route, msg) {
    console.log('id = ' + id);
    console.log("route = " + route);
    console.log("msg = " + msg);
    var msgStr = JSON.stringify(msg);
    if (route.length>255) { throw new Error('route maxlength is overflow'); }
    var byteArray = new Uint16Array(HEADER + route.length + msgStr.length);
    var index = 0;
    byteArray[index++] = (id>>24) & 0xFF;
    byteArray[index++] = (id>>16) & 0xFF;
    byteArray[index++] = (id>>8) & 0xFF;
    byteArray[index++] = id & 0xFF;
    byteArray[index++] = route.length & 0xFF;
    for(var i = 0;i<route.length;i++){
      byteArray[index++] = route.charCodeAt(i);
    }
    for (var i = 0; i < msgStr.length; i++) {
      byteArray[index++] = msgStr.charCodeAt(i);
    }
    return bt2Str(byteArray,0,byteArray.length);
  };

  that.decode = function (msg) {
    var idx, len = msg.length, arr = new Array(len);
    for (idx = 0 ; idx < len ; ++ idx){
      arr[idx] = msg.charCodeAt(idx);
    }
    var index = 0;
    var buf = new Uint16Array(arr);
    var id = ((buf[index++] <<24) | (buf[index++])  << 16  |  (buf[index++]) << 8 | buf[index++]) >>>0;
    var routeLen = buf[HEADER - 1];
    var route = bt2Str(buf, HEADER, routeLen + HEADER);
    var body = bt2Str(buf, routeLen + HEADER,  buf.length);
    return new Message(id, route, body);
  };
  const getStrWithUnicode = function (code) {
    let str = String.fromCharCode(code);
    return new String(str);
  }
  const bt2Str = function (byteArray, start, end) {
    let result = "";
    for(var i = start; i < byteArray.length && i<end; i++) {
      let byte = byteArray[i];
      // if (byte !== 0){
        let str = String.fromCharCode(byte);
        // console.log("str = " + str);
        result = result + str;
        // console.log("result = " + result);
      // }
    };
    console.log("result = " + result);

    return result;




  };

  return that;
};


const Pomelo = function () {
  var that = EventEmitter();
  var socket = null;
  var callbacks = {};
  var id = 1;
  that.init = function (params,cb) {
    that.params = params;
    params.debug = true;
    var host = params.host;
    var port = params.port;
    var url = "ws://" + host;
    if (port){
      url += ":" + port;
    }
    socket = SocketIO.connect(url, {'force new connection': true, reconnect: false});
    socket.on('connect', function () {
      console.log("pomeloclient init websocket connected!");
      if (cb){
        cb(socket);
      }
    });
    socket.on("reconnect", function () {
      console.log("reconnect");
    });
    socket.on("message", function (data) {
      console.log("message = " + data);
      if (typeof data === 'string'){
        data = JSON.parse(data);
      }
      if (data instanceof Array){
        processMessageBatch(that, data);
      }else {
        processMessage(that, data);
      }
    });
    socket.on("error", function (err) {
      console.log("err");
    });
    socket.on("disconnect", function (reason) {
      console.log("断开连接");
      that.emit("disconnect", reason);
    });
  };


  that.disconnect = function () {
    if (socket){
      socket.disconnect();
      socket = null;
    }
  };


  that.request = function (route) {
    if (!route){
      return ;
    }
    var msg = {};
    var cb;
    var args = Array.prototype.slice.apply(arguments);
    if (args.length === 2){
      if (typeof args[1] === 'function'){
        cb = args[1];
      }else if (typeof args[1] === 'object'){
        msg = args[1];
      }
    }else if (args.length === 3){
      msg = args[1];
      cb = args[2];
    }
    var bodyMsg = Filter(msg, route);
    console.log('filter' + JSON.stringify(bodyMsg));
    id = 0;
    callbacks[id] = cb;
    var sg = Protocol().encode(id, route, bodyMsg);
    cc.log("sg = " + sg);
    socket.send(sg);
  };




  var processMessage = function (pomelo, msg) {
    var route;
    if (msg.id){
      var cb = callbacks[msg.id];
      delete  callbacks[msg.id];
      if (typeof  cb !== "function"){
        console.log("pomeloclient cb is not a function for request" + msg.id);
        return;
      }
      cb(msg.body);
      return;
    }
    processCell(msg);
    function processCell(msg) {
      var route = msg.route;
      if (!!route){
        if (!!msg.body){
          var body = msg.body.body;
          if (!body) {body = msg.body};
          pomelo.emit(route, body);
        }else {
          pomelo.emit(route,msg);
        }
      }else {
        pomelo.emit(msg.body.route, msg.body);
      }
    }
  };

  var processMessageBatch = function (pomelo, msgs) {
    for (var i = 0 ; i < msgs.length ; i ++){
      processMessage(pomelo, msgs[i]);
    }
  };
  function Filter(msg, route) {
    console.log("msg = " + JSON.stringify(msg));

    if (route.indexOf('area.') === 0){
      msg.areaId = that.areaId;
    }
    msg.timestamp =new Date().getTime();
    console.log("msg = " + JSON.stringify(msg));
    return msg;
  }
  return that;
};
export default Pomelo;
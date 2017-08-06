/**
 * Created by chuhaoyuan on 2017/8/4.
 */
const SocketManager = function (host, port) {
  let that = {};
  let _socket = io(host + ":" + port);
  that = _socket;
  let _callbacks = {};
  let _id = 0;
  // that.init = function (host,port) {
  //   _socket = io(host + ":" + port);
  //   _socket.on("connect", function () {
  //     console.log("连接成功");
  //   })
  // };

  _socket.on("connect", function () {
    console.log(" 连接成功了");
  })
  _socket.on("message", function (data) {

    console.log("收到message " + JSON.stringify(data));
    let id = data.id;
    let body = data.body;
    let cb = _callbacks[id];
    if (_callbacks.hasOwnProperty(id)){
      console.log("有这个cb");
    }
    if (cb){
      cb(body);
    }
  });
  that.request = function (message, params, cb) {
    _id ++;
    _callbacks[_id] = cb;

    _socket.emit("message", {
      id: _id,
      body: {
        message: message,
        data: params
      }
    });
  };


  return that;
};
export default SocketManager;
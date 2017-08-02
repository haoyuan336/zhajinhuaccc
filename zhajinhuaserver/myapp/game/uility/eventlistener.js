/**
 * Created by chuhaoyuan on 2017/8/2.
 */
const EventListener = function (obj) {

  var register = [];
  obj.on = function (name, method) {
    if (register.hasOwnProperty(name)){
      register[name].push(method);
    }else {
      register[name] = [];
      register[name].push(method);
    }
  };
  obj.fire = function (name) {
    if (register.hasOwnProperty(name)){
      var handlerList = register[name];
      for (var i = 0 ; i < handlerList.length ; i ++){
        var handler = handlerList[i];
        var argus = [];
        for (var j = 1 ; j < arguments.length ; j ++){
          argus.push(arguments[j]);
        }
        handler.apply(this, argus);
      }
    }
  };

  obj.removeAllListeners = function () {
    register = [];
  };

  obj.removeAllListenersByName = function (name) {
    if (register.hasOwnProperty(name)){
      register[name] = [];
    }
  };
  obj.removeListener = function (name, method) {
    var handlerList = register[name];
    for (var i = 0  ; i < handlerList.length ; i ++){
      if (handlerList[i] === method){
        handlerList.splice(i , method);
      }
    }
  };


  return that
};
module.exports = EventListener;

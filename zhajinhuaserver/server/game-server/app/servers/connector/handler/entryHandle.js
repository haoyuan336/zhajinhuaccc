/**
 * Created by chuhaoyuan on 2017/8/3.
 */
handler.enter = function (msg, session, next) {
  session.bind(uid);
  session.on("closed", onUserLevel.bing(null, this.app));
}
import global from './../global'
cc.Class({
    extends: cc.Component,

    properties: {
        editBoxNode: {
            default: null,
            type: cc.EditBox
        }
    },

    // use this for initialization
    onLoad: function () {


    },
    buttonClick: function (event, customData) {
        console.log("custom data = " + customData);
        console.log("edit box" + this.editBoxNode.getComponent(cc.EditBox).string);
        var nameStr = this.editBoxNode.getComponent(cc.EditBox).string;
        if (nameStr.length != 0){
            // global.socket.emit("login", this.editBoxNode.getComponent(cc.EditBox).string);
            // global.socketManager.sendMessage("login",{uid: "haoyuan336"}, function (data) {
            //     if (data.status === 'ok'){
            //         console.log("登陆成功了");
            //         //登陆成功，进入游戏页面
            //         global.eventlistener.fire("enter-gameworld");
            //     }
            // });


            global.eventlistener.fire("login_game", nameStr);

        }
    }


});

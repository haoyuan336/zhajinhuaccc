import global from './global'
cc.Class({
    extends: cc.Component,

    properties: {
        mainWorldPrefab: {
            default: null,
            type: cc.Prefab
        }
    },

    // use this for initialization
    onLoad: function () {
        var socket = io("127.0.0.1:3000");
        socket.on("connect", function () {
            console.log(" connect");
        });
        socket.on("welcome", function (data) {
            console.log('welcome = ' + data);
        });
        socket.on("disconnect", function () {
            console.log("disconnect");
        });
        socket.on("player_ready", function (data) {
            console.log("a player change ready state = " + JSON.stringify(data));
        });

        global.socket = socket;
        if (this.mainWorld !== undefined){
            this.mainWorld.removeFromParent(true);
        }
        this.mainWorld = cc.instantiate(this.mainWorldPrefab);
        this.mainWorld.parent = this.node;
    },

});

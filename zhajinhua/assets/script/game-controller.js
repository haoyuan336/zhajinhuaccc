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

        // global.socket = io.connect("localhost:3000");
        // global.socket.on("welcome",  (data)=>{
        //     cc.log("welcome =" + data);
        // });
        if (cc.sys.isNative){
            window.io = SocketIO;
        }


        global.socket = window.io.connect("localhost:3000");
        global.socket.on("welcome", function (data) {
           cc.log("welcome = " + data);
        });


        if (this.mainWorld !== undefined){
            this.mainWorld.removeFromParent(true);
        }
        this.mainWorld = cc.instantiate(this.mainWorldPrefab);
        this.mainWorld.parent = this.node;
    },

});

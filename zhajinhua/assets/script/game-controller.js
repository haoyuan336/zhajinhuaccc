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

        let ws = new WebSocket("ws://localhost:8181");
        ws.onopen = function (e) {
            console.log("connection to server opened");
            
        };
        function sendMessage() {
            ws.send($("#message").val());
        }


        if (this.mainWorld !== undefined){
            this.mainWorld.removeFromParent(true);
        }
        this.mainWorld = cc.instantiate(this.mainWorldPrefab);
        this.mainWorld.parent = this.node;
    },

});

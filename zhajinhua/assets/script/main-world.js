import global from './global'
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
            global.socket.emit("login", this.editBoxNode.getComponent(cc.EditBox).string);
        }
    }


});

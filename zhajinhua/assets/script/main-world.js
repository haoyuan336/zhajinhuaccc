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
        cc.log("custom data = " + customData);
        cc.log("edit box" + this.editBoxNode.getComponent(cc.EditBox).string);

        global.socket.emit("login", this.editBoxNode.getComponent(cc.EditBox).string);



    }


});

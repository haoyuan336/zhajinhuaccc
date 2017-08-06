const ColorConfig = {
    "spades": 3,
    "hearts": 2,
    "clubs": 1,
    "diamonds": 0
};//黑红梅方
const ValueConfig = {
    "1": "1",
    "2": "2",
    "3": "3",
    "4": "4",
    "5": "5",
    "6": "6",
    "7": "7",
    "8": "8",
    "9": "9",
    "10": "A",
    "11": "B",
    "12": "C",
    "13": "D",

};
cc.Class({
    extends: cc.Component,

    properties: {
        bgSpriteFrame: {
            default: null,
            type: cc.SpriteFrame
        },
        cardSpriteFrames: {
            default: null,
            type: cc.SpriteAtlas
        }
    },

    // use this for initialization
    onLoad: function () {
        this.node.addComponent(cc.Sprite).spriteFrame = this.bgSpriteFrame;
    },
    showValue: function (data) {
        var spriteName = "card_" + ColorConfig[data.color] + ValueConfig[data.value];
        this.node.getComponent(cc.Sprite).spriteFrame = this.cardSpriteFrames.getSpriteFrame(spriteName);

    }

    
});

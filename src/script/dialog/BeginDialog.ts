import GameUI from "../GameUI";

export default class BeginDialog extends Laya.Dialog {
    private beginBtn: Laya.Image;
    private closeBtn: Laya.Button;
    private eventName: string;
    private beginImage: Laya.Image;


    private timeLine: Laya.TimeLine = new Laya.TimeLine();

    constructor() { super() }
    onEnable() {
        UIConfig.closeDialogOnSide = false;
        let numn = 3
        this.beginBtn = this.getChildByName("beginBtn") as Laya.Image;
        this.closeBtn = this.getChildByName("closeBtn") as Laya.Button;
        this.beginImage = this.getChildByName("beginImage") as Laya.Image;

        this.beginBtn.on(Laya.Event.CLICK, this, this.onBtnClick);
        this.closeBtn.on(Laya.Event.CLICK, this, this.onCloseBtnClick);
        this.beginImage.on(Laya.Event.CLICK, this, this.onBtnClick);
        this.createTimerLine()
    }

    private createTimerLine(): void {

        this.timeLine.addLabel("turnSmall", 0).to(this.beginBtn, { scaleX: 0.9, scaleY: 0.9 }, 500, null, 0)
            .addLabel("turnBig", 0).to(this.beginBtn, { scaleX: 1, scaleY: 1, }, 500, null, 0)
            .addLabel("turnBig", 0).to(this.beginBtn, { scaleX: 1.1, scaleY: 1.1, }, 500, null, 0)
            .addLabel("turnBig", 0).to(this.beginBtn, { scaleX: 1, scaleY: 1, }, 500, null, 0);
        this.timeLine.play(0, true);
    }

    onBtnClick(): void {
        parent.postMessage({ stage: 'go' }, '*');
        Laya.Scene.open('test/TestScene.json');
    }

    onCloseBtnClick(): void {
        parent.postMessage({ stage: 'close-icon' }, '*');
    }
}
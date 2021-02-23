import GameUI from "../GameUI";

export default class ReadyDialog extends Laya.Dialog {
    private numbers: Laya.Image;
    numn = 3;
    constructor() { super() }
    onEnable() {
        UIConfig.closeDialogOnSide = false;
        this.numbers = this.getChildByName("numbers") as Laya.Image;
        this.timeLine();
        Laya.timer.loop(1000, this, this.timeLine)
    }

    timeLine() {
        let numn = this.numn;
        this.numn--;
        switch (true) {
            case numn > 1:
                this.numbers.scale(1.3, 1.3);
                this.numbers.skin = `game/iconlbl_${numn}.png`;
                Laya.Tween.to(this.numbers, { scaleX: 0.8, scaleY: 0.8, ease: Laya.Ease.circInOut }, 1000)
                break;
            case numn == 1:
                this.numbers.skin = `game/iconlbl_${numn}.png`;
                this.numbers.x = 310
                this.numbers.width = 127
                this.numbers.height = 322
                this.numbers.scale(1.3, 1.3);
                Laya.Tween.to(this.numbers, { scaleX: 0.8, scaleY: 0.8, ease: Laya.Ease.circInOut }, 1000)
                break;
            case numn == 0:
                this.numbers.skin = `game/iconlbl_${numn}.png`;
                this.numbers.x = 328
                this.numbers.y = 673
                this.numbers.width = 324
                this.numbers.height = 167
                this.numbers.anchorX = 0.5
                this.numbers.anchorY = 0.5
                this.numbers.scale(1.3, 1.3);
                Laya.Tween.to(this.numbers, { scaleX: 0.8, scaleY: 0.8, ease: Laya.Ease.circInOut }, 1000)
                break;
            default:
                Laya.timer.clear(this, this.timeLine)
                // Laya.Scene.close('test/Dialog/ReadyDialog.json');
                this.close()
                GameUI.instance.startGame();
                break
        }
    }
}

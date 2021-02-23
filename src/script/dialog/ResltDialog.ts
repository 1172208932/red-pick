import GameUI from "../GameUI";

export default class ResltDialog extends Laya.Dialog {
    private iconText: Laya.Text;
    private timeText: Laya.Text;
    //老铁手速太慢了
    private text1: Laya.Text;
    //下一场红包雨时间
    private text2: Laya.Text;
    private text3: Laya.Text;
    private successBottom: Laya.Box;
    private successBox: Laya.Box;
    private useBtn: Laya.Image;

    constructor() { super() }
    onEnable() {
        console.log(1)
        UIConfig.closeDialogOnSide = false;
        this.timeText = this.getChildByName("time") as Laya.Text;
        this.useBtn = this.getChildByName("useBtn") as Laya.Image;
        this.text1 = this.getChildByName("text1") as Laya.Text;
        this.text2 = this.getChildByName("text2") as Laya.Text;
        this.text3 = this.getChildByName("text2") as Laya.Text;
        this.successBottom = this.getChildByName("successBottom") as Laya.Box;
        this.successBox = this.getChildByName("successBox") as Laya.Box;
        this.iconText = this.successBox.getChildByName("icon") as Laya.Text;

        this.useBtn.on(Laya.Event.CLICK, this, this.onUseBtnClick);
        window.addEventListener('message', message => {
            if (message.origin != location.origin) {
                console.log(message, '接送到的数据')

                console.log(message.data, '接送到的数据')
                if (message.data.type === 'date') {
                    this.setDateTime(message.data.value)
                }

                if (message.data.type === 'success') {
                    this.setSuccessDialog(message.data.value)
                }

                if (message.data.type === 'error') {
                    this.setErrorDialog(message.data.value)
                }
                // _this.iconText.text = message.data.coin+'' || '';
                // _this.timeText.text =  message.data.date+'' || '';
            }
        }, false)
        console.log(GameUI.instance.score !== 0, ' gameover GameUI.instance.score !== 0')

        parent.postMessage({ stage: 'gameover', isClick: GameUI.instance.score !== 0 }, '*');
        if (GameUI.instance.score === 0) {
            this.text1.visible = true;
        }
        // this.setDateTime({date:'2月20日15:00'})
        // this.setErrorDialog({coin: 23 ,date:'2021.2.20-2021.3.20'})
    }

    setDateTime(val) {
        console.log(val, 'setDateTime')

        if (val) {
            this.timeText.text = val;
            this.timeText.visible = true;
            this.text2.visible = true;
        } else {
            this.timeText.visible = false;
            this.text2.visible = false;
        }
    }

    setSuccessDialog(val) {
        console.log(val, 'setSuccessDialog')
        this.text1.visible = false;
        this.timeText.visible = false;
        this.text2.visible = false;
        this.text3.visible = true;
        this.successBottom.visible = true;
        this.successBox.visible = true;
        this.text3.text = '有效期' + val.date;
        this.text3.align = 'center';
        this.iconText.text = val.coin || 0;

        let coin = val.coin || 0;

        if (coin > 9 && coin < 100) {
            this.iconText.fontSize = 70;
            this.iconText.x = 292;
            this.iconText.y = -26;
        }

        if (coin > 999) {
            this.iconText.fontSize = 35;
            this.iconText.x = 292;
            this.iconText.y = -4;
        }

        this.useBtn.skin = 'game/use_btn.png'
    }

    setErrorDialog(val) {
        console.log(val, 'setErrorDialog')
        this.text1.text = '很遗憾，本场红包雨已抢完'
        this.text1.fontSize = 28

        if (val.code === 32548) {
            this.text1.text = val.msg || ''
            this.text1.fontSize = 22
        }
        this.text1.visible = true;

    }

    onUseBtnClick() {
        if (this.useBtn.skin === 'game/use_btn.png') {
            parent.postMessage({ stage: 'used' }, '*');
        } else {
            parent.postMessage({ stage: 'close-btn' }, '*');
        }
    }

    onBtnClick(): void {
        Laya.Scene.open('test/TestScene.json');
    }
}
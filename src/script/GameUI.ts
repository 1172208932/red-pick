import { ui } from "./../ui/layaMaxUI";
import GameControl from "./GameControl"
/**
 * 采用非脚本的方式实现，而使用继承页面基类，实现页面逻辑。在IDE里面设置场景的Runtime属性即可和场景进行关联
 * 相比脚本方式，继承式页面类，可以直接使用页面定义的属性（通过IDE内var属性定义），比如this.tipLbll，this.scoreLbl，具有代码提示效果
 * 建议：如果是页面级的逻辑，需要频繁访问页面内多个元素，使用继承式写法，如果是独立小模块，功能单一，建议用脚本方式实现，比如红包脚本。
 */
export default class GameUI extends ui.test.TestSceneUI {
    /**设置单例的引用方式，方便其他类引用 */
    static instance: GameUI;
    /**当前积分字段 */
    score: number;
    /**游戏控制脚本引用，避免每次获取组件带来不必要的性能开销 */
    private _control: GameControl;
    doubleNum: number = 0;
    downNum: number = 10;
    constructor() {
        super();
        GameUI.instance = this;
        //是否关闭多点触控
        // Laya.MouseManager.multiTouchEnabled = false;
        UIConfig.popupBgAlpha = 0.3
    }

    onEnable(): void {
        console.log('gameUI')
        let bgImg = document.getElementById('bgImg');
        bgImg.style.display = 'inline';

        Laya.Scene.open('test/Dialog/ReadyDialog.json');
        this._control = this.getComponent(GameControl);

    }

    downTime() {
        if (this.downNum == 2) {
            this.stopGame()
        }
        if (this.downNum <= 0) {
            Laya.timer.clear(this, this.downTime)
        }

        this.downTimeNum.text = this.downNum + ''

        if (this.downNum > 0) {
            this.downNum--
        }

    }

    initDoubleNum(): void {
        Laya.Tween.to(this.double, {
            x: -565, ease: Laya.Ease.backOut, complete: Laya.Handler.create(this, () => {
                this.double.visible = false
            })
        }, 500)
        this.doubleNum = 0;
        this.double.skin = 'game/2.png'
    }

    showDoubleNum(): void {
        Laya.timer.clear(this, this.initDoubleNum)
        this.doubleNum++
        if (this.doubleNum >= 2) {
            if (this.doubleNum >= 17) {
                this.doubleNum = 17
            }
            this.double.skin = `game/${this.doubleNum}.png`
            this.double.x = 668;
            this.double.visible = true
            Laya.Tween.to(this.double, { x: 44, ease: Laya.Ease.backOut }, 500)
        }
        Laya.timer.once(1000, this, this.initDoubleNum)
    }

    /**增加分数 */
    addScore(value: number = 1): void {
        if (this.score < 15) {
            this.score += value;
        }
        this.showDoubleNum()
        this.iconProcess.width = 112 + 462 * this.score / 15;
        //随着分数越高，难度增大
        if (this._control.createBoxInterval > 600 && this.score % 20 == 0) this._control.createBoxInterval -= 20;
    }

    startGame(): void {
        this.score = 0;
        this._control.startGame();

        this.timeBox.y = -200
        this.timeBox.visible = true
        Laya.Tween.to(this.timeBox, { y: 24, ease: Laya.Ease.backOut }, 500)

        this.processBox.y = -200
        this.processBox.visible = true
        Laya.Tween.to(this.processBox, { y: 53, ease: Laya.Ease.backOut }, 500)

        Laya.timer.loop(1000, this, this.downTime)
    }

    /**停止游戏 */
    stopGame(): void {
        this._control.stopGame();
        Laya.timer.once(2000, this, () => {
            this.timeBox.visible = false;
            this.processBox.visible = false;
        })

        // Laya.Scene.open('test/Dialog/ResltDialog.json');
    }
}
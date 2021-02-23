(function () {
    'use strict';

    class BeginDialog extends Laya.Dialog {
        constructor() {
            super();
            this.timeLine = new Laya.TimeLine();
        }
        onEnable() {
            UIConfig.closeDialogOnSide = false;
            let numn = 3;
            this.beginBtn = this.getChildByName("beginBtn");
            this.closeBtn = this.getChildByName("closeBtn");
            this.beginImage = this.getChildByName("beginImage");
            this.beginBtn.on(Laya.Event.CLICK, this, this.onBtnClick);
            this.closeBtn.on(Laya.Event.CLICK, this, this.onCloseBtnClick);
            this.beginImage.on(Laya.Event.CLICK, this, this.onBtnClick);
            this.createTimerLine();
        }
        createTimerLine() {
            this.timeLine.addLabel("turnSmall", 0).to(this.beginBtn, { scaleX: 0.9, scaleY: 0.9 }, 500, null, 0)
                .addLabel("turnBig", 0).to(this.beginBtn, { scaleX: 1, scaleY: 1, }, 500, null, 0)
                .addLabel("turnBig", 0).to(this.beginBtn, { scaleX: 1.1, scaleY: 1.1, }, 500, null, 0)
                .addLabel("turnBig", 0).to(this.beginBtn, { scaleX: 1, scaleY: 1, }, 500, null, 0);
            this.timeLine.play(0, true);
        }
        onBtnClick() {
            parent.postMessage({ stage: 'go' }, '*');
            Laya.Scene.open('test/TestScene.json');
        }
        onCloseBtnClick() {
            parent.postMessage({ stage: 'close-icon' }, '*');
        }
    }

    var REG = Laya.ClassUtils.regClass;
    var ui;
    (function (ui) {
        var test;
        (function (test) {
            class TestSceneUI extends Laya.Scene {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("test/TestScene");
                }
            }
            test.TestSceneUI = TestSceneUI;
            REG("ui.test.TestSceneUI", TestSceneUI);
        })(test = ui.test || (ui.test = {}));
    })(ui || (ui = {}));

    class GameControl extends Laya.Script {
        constructor() {
            super();
            this.createBoxInterval = 600;
            this._time = 0;
            this._started = false;
        }
        onEnable() {
            this._time = Date.now();
            this._gameBox = this.owner.getChildByName("gameBox");
            Laya.loader.load("prefab/fireworks.part");
        }
        onUpdate() {
            let now = Date.now();
            if (now - this._time > this.createBoxInterval && this._started) {
                this._time = now;
                this.createBox();
            }
        }
        createBox() {
            let box = Laya.Pool.getItemByCreateFun("dropBox", this.dropBox.create, this.dropBox);
            box.pos(Math.random() * (Laya.stage.width - 150) + 50, -100);
            this._gameBox.addChild(box);
        }
        onStageClick(e) {
            e.stopPropagation();
        }
        startGame() {
            if (!this._started) {
                this._started = true;
                this.enabled = true;
            }
        }
        stopGame() {
            this._started = false;
            this.enabled = false;
            this.createBoxInterval = 1000;
            Laya.timer.once(2000, this, () => {
                Laya.Scene.open('test/Dialog/ResltDialog.json');
            });
        }
    }

    class GameUI extends ui.test.TestSceneUI {
        constructor() {
            super();
            this.doubleNum = 0;
            this.downNum = 10;
            GameUI.instance = this;
            UIConfig.popupBgAlpha = 0.3;
        }
        onEnable() {
            console.log('gameUI');
            let bgImg = document.getElementById('bgImg');
            bgImg.style.display = 'inline';
            Laya.Scene.open('test/Dialog/ReadyDialog.json');
            this._control = this.getComponent(GameControl);
        }
        downTime() {
            if (this.downNum == 2) {
                this.stopGame();
            }
            if (this.downNum <= 0) {
                Laya.timer.clear(this, this.downTime);
            }
            this.downTimeNum.text = this.downNum + '';
            if (this.downNum > 0) {
                this.downNum--;
            }
        }
        initDoubleNum() {
            Laya.Tween.to(this.double, {
                x: -565, ease: Laya.Ease.backOut, complete: Laya.Handler.create(this, () => {
                    this.double.visible = false;
                })
            }, 500);
            this.doubleNum = 0;
            this.double.skin = 'game/2.png';
        }
        showDoubleNum() {
            Laya.timer.clear(this, this.initDoubleNum);
            this.doubleNum++;
            if (this.doubleNum >= 2) {
                if (this.doubleNum >= 17) {
                    this.doubleNum = 17;
                }
                this.double.skin = `game/${this.doubleNum}.png`;
                this.double.x = 668;
                this.double.visible = true;
                Laya.Tween.to(this.double, { x: 44, ease: Laya.Ease.backOut }, 500);
            }
            Laya.timer.once(1000, this, this.initDoubleNum);
        }
        addScore(value = 1) {
            if (this.score < 15) {
                this.score += value;
            }
            this.showDoubleNum();
            this.iconProcess.width = 112 + 462 * this.score / 15;
            if (this._control.createBoxInterval > 600 && this.score % 20 == 0)
                this._control.createBoxInterval -= 20;
        }
        startGame() {
            this.score = 0;
            this._control.startGame();
            this.timeBox.y = -200;
            this.timeBox.visible = true;
            Laya.Tween.to(this.timeBox, { y: 24, ease: Laya.Ease.backOut }, 500);
            this.processBox.y = -200;
            this.processBox.visible = true;
            Laya.Tween.to(this.processBox, { y: 53, ease: Laya.Ease.backOut }, 500);
            Laya.timer.loop(1000, this, this.downTime);
        }
        stopGame() {
            this._control.stopGame();
            Laya.timer.once(2000, this, () => {
                this.timeBox.visible = false;
                this.processBox.visible = false;
            });
        }
    }

    class ReadyDialog extends Laya.Dialog {
        constructor() {
            super();
            this.numn = 3;
        }
        onEnable() {
            UIConfig.closeDialogOnSide = false;
            this.numbers = this.getChildByName("numbers");
            this.timeLine();
            Laya.timer.loop(1000, this, this.timeLine);
        }
        timeLine() {
            let numn = this.numn;
            this.numn--;
            switch (true) {
                case numn > 1:
                    this.numbers.scale(1.3, 1.3);
                    this.numbers.skin = `game/iconlbl_${numn}.png`;
                    Laya.Tween.to(this.numbers, { scaleX: 0.8, scaleY: 0.8, ease: Laya.Ease.circInOut }, 1000);
                    break;
                case numn == 1:
                    this.numbers.skin = `game/iconlbl_${numn}.png`;
                    this.numbers.x = 310;
                    this.numbers.width = 127;
                    this.numbers.height = 322;
                    this.numbers.scale(1.3, 1.3);
                    Laya.Tween.to(this.numbers, { scaleX: 0.8, scaleY: 0.8, ease: Laya.Ease.circInOut }, 1000);
                    break;
                case numn == 0:
                    this.numbers.skin = `game/iconlbl_${numn}.png`;
                    this.numbers.x = 328;
                    this.numbers.y = 673;
                    this.numbers.width = 324;
                    this.numbers.height = 167;
                    this.numbers.anchorX = 0.5;
                    this.numbers.anchorY = 0.5;
                    this.numbers.scale(1.3, 1.3);
                    Laya.Tween.to(this.numbers, { scaleX: 0.8, scaleY: 0.8, ease: Laya.Ease.circInOut }, 1000);
                    break;
                default:
                    Laya.timer.clear(this, this.timeLine);
                    this.close();
                    GameUI.instance.startGame();
                    break;
            }
        }
    }

    class ResltDialog extends Laya.Dialog {
        constructor() { super(); }
        onEnable() {
            console.log(1);
            UIConfig.closeDialogOnSide = false;
            this.timeText = this.getChildByName("time");
            this.useBtn = this.getChildByName("useBtn");
            this.text1 = this.getChildByName("text1");
            this.text2 = this.getChildByName("text2");
            this.text3 = this.getChildByName("text2");
            this.successBottom = this.getChildByName("successBottom");
            this.successBox = this.getChildByName("successBox");
            this.iconText = this.successBox.getChildByName("icon");
            this.useBtn.on(Laya.Event.CLICK, this, this.onUseBtnClick);
            let _this = this;
            window.addEventListener('message', message => {
                if (message.origin != location.origin) {
                    console.log(message, '接送到的数据');
                    console.log(message.data, '接送到的数据');
                    if (message.data.type === 'date') {
                        this.setDateTime(message.data.value);
                    }
                    if (message.data.type === 'success') {
                        this.setSuccessDialog(message.data.value);
                    }
                    if (message.data.type === 'error') {
                        this.setErrorDialog(message.data.value);
                    }
                }
            }, false);
            console.log(GameUI.instance.score !== 0, ' gameover GameUI.instance.score !== 0');
            parent.postMessage({ stage: 'gameover', isClick: GameUI.instance.score !== 0 }, '*');
            if (GameUI.instance.score === 0) {
                this.text1.visible = true;
            }
        }
        setDateTime(val) {
            console.log(val, 'setDateTime');
            if (val) {
                this.timeText.text = val;
                this.timeText.visible = true;
                this.text2.visible = true;
            }
            else {
                this.timeText.visible = false;
                this.text2.visible = false;
            }
        }
        setSuccessDialog(val) {
            console.log(val, 'setSuccessDialog');
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
            this.useBtn.skin = 'game/use_btn.png';
        }
        setErrorDialog(val) {
            console.log(val, 'setErrorDialog');
            this.text1.text = '很遗憾，本场红包雨已抢完';
            this.text1.fontSize = 28;
            if (val.code === 32548) {
                this.text1.text = val.msg || '';
                this.text1.fontSize = 22;
            }
            this.text1.visible = true;
        }
        onUseBtnClick() {
            if (this.useBtn.skin === 'game/use_btn.png') {
                parent.postMessage({ stage: 'used' }, '*');
            }
            else {
                parent.postMessage({ stage: 'close-btn' }, '*');
            }
        }
        onBtnClick() {
            Laya.Scene.open('test/TestScene.json');
        }
    }

    class DropBox extends Laya.Script {
        constructor() {
            super();
            this.level = 1;
        }
        onEnable() {
            this._rig = this.owner.getComponent(Laya.RigidBody);
            this.level = 1;
            this._redPick = this.owner.getChildByName("redPacker");
            if (Math.random() < 0.08) {
                this._redPick.skin = 'test/红包 2.png';
                this._redPick.scale(0.75, 0.75);
                this._rig.gravityScale = 0.8;
            }
        }
        onUpdate() {
            this.owner.rotation += 0.3;
            if (this.owner.y > 1736) {
                this.owner.removeSelf();
            }
        }
        onClick() {
            var owner = this.owner;
            if (owner.parent) {
                let effect = new Laya.Particle2D(Laya.loader.getRes("prefab/fireworks.part"));
                effect.pos(owner.x, owner.y);
                owner.parent.addChild(effect);
                effect.play();
                Laya.timer.once(600, this, () => {
                    effect.destroy();
                });
                owner.removeSelf();
                Laya.SoundManager.playSound("sound/destroy.wav");
            }
            GameUI.instance.addScore(1);
        }
        createEffect() {
            this.part = new Laya.Particle2D(Laya.loader.getRes("prefab/fireworks.part"));
            return this.part;
        }
        onDisable() {
            Laya.Pool.recover("dropBox", this.owner);
        }
    }

    class GameConfig {
        constructor() {
        }
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("script/dialog/BeginDialog.ts", BeginDialog);
            reg("script/dialog/ReadyDialog.ts", ReadyDialog);
            reg("script/dialog/ResltDialog.ts", ResltDialog);
            reg("script/GameUI.ts", GameUI);
            reg("script/GameControl.ts", GameControl);
            reg("script/DropBox.ts", DropBox);
        }
    }
    GameConfig.width = 640;
    GameConfig.height = 1136;
    GameConfig.scaleMode = "fixedauto";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "middle";
    GameConfig.alignH = "center";
    GameConfig.startScene = "test/Dialog/BeginDialog.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    class Main {
        constructor() {
            window.hello = function (value) {
                console.log(value, 'xiachuangyi');
            };
            if (window["Laya3D"]) {
                Laya3D.init(GameConfig.width, GameConfig.height);
                Laya.stage.bgColor = null;
            }
            else {
                Config.isAlpha = true;
                Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
                Laya.stage.bgColor = "none";
            }
            Laya["Physics"] && Laya["Physics"].enable();
            Laya["DebugPanel"] && Laya["DebugPanel"].enable();
            Laya.stage.scaleMode = GameConfig.scaleMode;
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.stage.alignV = GameConfig.alignV;
            Laya.stage.alignH = GameConfig.alignH;
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
                Laya.enableDebugPanel();
            if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
                Laya["PhysicsDebugDraw"].enable();
            if (GameConfig.stat)
                Laya.Stat.show();
            Laya.alertGlobalError(true);
            Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
            Laya.stage.bgColor = null;
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onImgLoaded));
        }
        onImgLoaded() {
            var res = [{ url: "res/atlas/game.atlas", type: Laya.Loader.ATLAS },
                { url: "res/atlas/game.png", type: Laya.Loader.IMAGE }
            ];
            Laya.loader.load(res, null, Laya.Handler.create(this, this.onConfigLoaded, null, false));
        }
        onConfigLoaded() {
            GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
        }
    }
    new Main();

}());

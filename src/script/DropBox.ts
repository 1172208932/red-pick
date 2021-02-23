import GameUI from "./GameUI";
/**
 * 掉落盒子脚本，实现盒子碰撞及回收流程
 */
export default class DropBox extends Laya.Script {
    /**等级 */
    level: number = 1;
    /**等级文本对象引用 */
    // private _text: Laya.Text;
    /**刚体对象引用 */
    private _rig: Laya.RigidBody
    private _redPick: Laya.Image;
    part: Laya.Particle2D
    constructor() { super(); }
    onEnable(): void {
        /**获得组件引用，避免每次获取组件带来不必要的查询开销 */
        this._rig = this.owner.getComponent(Laya.RigidBody);
        this.level = 1;
        this._redPick = this.owner.getChildByName("redPacker") as Laya.Image;
        if (Math.random() < 0.08) {
            this._redPick.skin = 'test/红包 2.png'
            this._redPick.scale(0.75, 0.75);
            this._rig.gravityScale = 0.8
        }
    }

    onUpdate(): void {
        //持续旋转
        (this.owner as Laya.Sprite).rotation += 0.3;
        //如果超出屏幕
        if ((this.owner as Laya.Sprite).y > 1736) {
            this.owner.removeSelf();
        }
    }

    onClick() {
        var owner: Laya.Sprite = this.owner as Laya.Sprite;
        if (owner.parent) {
            let effect: Laya.Particle2D = new Laya.Particle2D(Laya.loader.getRes("prefab/fireworks.part"));
            effect.pos(owner.x, owner.y);
            owner.parent.addChild(effect);
            effect.play();
            Laya.timer.once(600, this, () => {
                effect.destroy()
                // Laya.Pool.recover("effect", this.part);
            })
            owner.removeSelf();
            Laya.SoundManager.playSound("sound/destroy.wav");
        }
        GameUI.instance.addScore(1);
    }

    /**使用对象池创建爆炸动画 */
    createEffect(): Laya.Particle2D {
        this.part = new Laya.Particle2D(Laya.loader.getRes("prefab/fireworks.part"));
        return this.part
    }

    onDisable(): void {
        //被移除时，回收到对象池，方便下次复用，减少对象创建开销。
        Laya.Pool.recover("dropBox", this.owner);
    }
}
/**
 * 能源轉盤 (Energy Dial)
 * 可旋轉的圓形UI組件，用於調整能源輸出
 */

class EnergyDial {
    constructor(scene, x, y, energyType, energySystem) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.energyType = energyType;
        this.energySystem = energySystem;
        this.energyData = ENERGY_DATA[energyType];

        // 視覺參數
        this.radius = 80;  // 轉盤半徑
        this.rotation = 0;  // 當前旋轉角度

        // 容器
        this.container = null;

        // 子元素
        this.background = null;  // 背景圓
        this.progressArc = null;  // 進度弧線
        this.centerCircle = null;  // 中心圓
        this.icon = null;  // 圖示
        this.nameText = null;  // 名稱文字
        this.valueText = null;  // 數值文字
        this.lockIcon = null;  // 鎖定圖示（不可控能源）

        // 輸入處理器
        this.inputHandler = null;

        // 互動狀態
        this.isInteracting = false;

        this.create();
    }

    /**
     * 創建轉盤
     */
    create() {
        // 創建容器
        this.container = this.scene.add.container(this.x, this.y);

        // 背景圓（深色）
        this.background = this.scene.add.circle(0, 0, this.radius, 0x0a0e27, 0.8);
        this.container.add(this.background);

        // 外框（霓虹藍發光）
        const outerRing = this.scene.add.circle(0, 0, this.radius, 0x000000, 0)
            .setStrokeStyle(3, this.energyData.color, 0.8);
        this.container.add(outerRing);

        // 進度弧線（動態顯示能源百分比）
        this.progressArc = this.scene.add.graphics();
        this.container.add(this.progressArc);

        // 中心圓
        this.centerCircle = this.scene.add.circle(0, 0, this.radius * 0.6, 0x1a1e3e, 0.9);
        this.container.add(this.centerCircle);

        // 名稱文字
        this.nameText = this.scene.add.text(0, -this.radius - 25, this.energyData.name, {
            fontSize: '16px',
            fontFamily: 'Microsoft JhengHei, Arial',
            color: '#00d9ff',
            align: 'center'
        }).setOrigin(0.5);
        this.container.add(this.nameText);

        // 圖示
        this.icon = this.scene.add.text(0, -10, this.energyData.icon, {
            fontSize: '32px'
        }).setOrigin(0.5);
        this.container.add(this.icon);

        // 數值文字
        this.valueText = this.scene.add.text(0, 25, '0 MW', {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#ffffff',
            align: 'center',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.container.add(this.valueText);

        // 如果不可控，顯示鎖定圖示
        if (!this.energyData.controlled) {
            this.lockIcon = this.scene.add.text(this.radius - 15, -this.radius + 15, '🔒', {
                fontSize: '20px'
            }).setOrigin(0.5).setAlpha(0.7);
            this.container.add(this.lockIcon);

            // 不可控能源使用較暗的顏色
            this.background.setAlpha(0.5);
            this.centerCircle.setAlpha(0.7);
        } else {
            // 可控能源，創建輸入處理器
            this.inputHandler = new InputHandler(this.scene, this);
        }

        // 更新顯示
        this.updateDisplay();
    }

    /**
     * 更新進度弧線
     */
    updateProgressArc() {
        this.progressArc.clear();

        const percent = this.energySystem.getEnergyPercent(this.energyType);
        const angle = (percent / 100) * 360;

        if (angle > 0) {
            this.progressArc.lineStyle(6, this.energyData.color, 0.8);
            this.progressArc.beginPath();
            this.progressArc.arc(
                0, 0,
                this.radius - 3,
                Phaser.Math.DegToRad(-90),
                Phaser.Math.DegToRad(-90 + angle),
                false
            );
            this.progressArc.strokePath();
        }
    }

    /**
     * 更新數值顯示
     */
    updateValueText() {
        const value = this.energySystem.getEnergy(this.energyType);
        this.valueText.setText(`${Math.round(value)} MW`);

        // 根據百分比改變顏色
        const percent = this.energySystem.getEnergyPercent(this.energyType);
        if (percent > 80) {
            this.valueText.setColor('#00ff00');  // 綠色：高
        } else if (percent > 50) {
            this.valueText.setColor('#ffaa00');  // 橙色：中
        } else if (percent > 30) {
            this.valueText.setColor('#ff6600');  // 深橙：低
        } else {
            this.valueText.setColor('#ff0000');  // 紅色：很低
        }
    }

    /**
     * 更新顯示
     */
    updateDisplay() {
        this.updateProgressArc();
        this.updateValueText();
    }

    /**
     * 旋轉回調（由 InputHandler 調用）
     */
    onRotate(delta) {
        // 嘗試調整能源
        const deltaTime = this.scene.game.loop.delta;
        const success = this.energySystem.adjustEnergy(
            this.energyType,
            delta,
            deltaTime
        );

        if (success) {
            // 更新視覺旋轉
            this.rotation += delta;
            this.container.angle = this.rotation;

            // 更新顯示
            this.updateDisplay();

            // 觸覺回饋（如果支援）
            if (navigator.vibrate && Math.abs(delta) > 5) {
                navigator.vibrate(10);
            }
        }
    }

    /**
     * 互動開始回調
     */
    onInteractionStart() {
        this.isInteracting = true;

        // 視覺回饋：放大
        this.scene.tweens.add({
            targets: this.container,
            scale: 1.1,
            duration: 150,
            ease: 'Power2'
        });

        // 外框發光增強
        this.background.setAlpha(1);
    }

    /**
     * 互動結束回調
     */
    onInteractionEnd() {
        this.isInteracting = false;

        // 視覺回饋：縮回
        this.scene.tweens.add({
            targets: this.container,
            scale: 1.0,
            duration: 150,
            ease: 'Power2'
        });

        // 外框發光恢復
        this.background.setAlpha(0.8);
    }

    /**
     * 設定位置
     */
    setPosition(x, y) {
        this.x = x;
        this.y = y;
        if (this.container) {
            this.container.setPosition(x, y);
        }
    }

    /**
     * 設定縮放
     */
    setScale(scale) {
        if (this.container) {
            this.container.setScale(scale);
        }
    }

    /**
     * 更新（每幀調用）
     */
    update() {
        // 更新顯示
        this.updateDisplay();

        // 更新輸入處理
        if (this.inputHandler) {
            this.inputHandler.update();
        }

        // 不可控能源的閃爍效果（提示無法操作）
        if (!this.energyData.controlled && this.lockIcon) {
            // 緩慢呼吸效果
            const alpha = 0.5 + Math.sin(Date.now() / 1000) * 0.2;
            this.lockIcon.setAlpha(alpha);
        }
    }

    /**
     * 銷毀
     */
    destroy() {
        if (this.inputHandler) {
            this.inputHandler.destroy();
            this.inputHandler = null;
        }

        if (this.container) {
            this.container.destroy();
            this.container = null;
        }

        this.scene = null;
        this.energySystem = null;
    }
}

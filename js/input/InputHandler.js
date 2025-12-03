/**
 * 輸入處理器 (Input Handler)
 * 處理觸控和滑鼠操作，用於旋轉能源轉盤
 */

class InputHandler {
    constructor(scene, dial) {
        this.scene = scene;
        this.dial = dial;  // 關聯的轉盤對象

        // 輸入狀態
        this.isActive = false;  // 是否正在操作
        this.lastAngle = 0;  // 上一幀的角度
        this.centerX = 0;  // 轉盤中心X
        this.centerY = 0;  // 轉盤中心Y

        // 旋轉參數
        this.rotationSpeed = 0;  // 當前旋轉速度（度/幀）
        this.rotationDamping = 0.95;  // 阻尼系數（慣性）
        this.minSpeed = 0.1;  // 最小速度閾值

        // 靈敏度
        this.sensitivity = 1.5;  // 旋轉靈敏度

        // 多點觸控支援
        this.activePointers = new Map();  // 追蹤多個觸控點

        this.setupInput();
    }

    /**
     * 設定輸入監聽
     */
    setupInput() {
        if (!this.dial.container) return;

        // 啟用互動
        this.dial.container.setInteractive(
            new Phaser.Geom.Circle(0, 0, this.dial.radius),
            Phaser.Geom.Circle.Contains
        );

        // 監聽事件
        this.dial.container.on('pointerdown', this.onPointerDown, this);
        this.dial.container.on('pointermove', this.onPointerMove, this);
        this.dial.container.on('pointerup', this.onPointerUp, this);
        this.dial.container.on('pointerout', this.onPointerOut, this);
    }

    /**
     * 計算指針相對於轉盤中心的角度
     */
    getAngle(pointer) {
        const dx = pointer.x - this.centerX;
        const dy = pointer.y - this.centerY;
        return Math.atan2(dy, dx);
    }

    /**
     * 計算角度差（處理跨越±π的情況）
     */
    getAngleDelta(angle1, angle2) {
        let delta = angle2 - angle1;

        // 處理角度跨越±π的情況
        if (delta > Math.PI) delta -= Math.PI * 2;
        if (delta < -Math.PI) delta += Math.PI * 2;

        return delta;
    }

    /**
     * 指針按下
     */
    onPointerDown(pointer) {
        // 更新轉盤中心位置（世界坐標）
        const worldPoint = this.dial.container.getWorldTransformMatrix();
        this.centerX = worldPoint.tx;
        this.centerY = worldPoint.ty;

        // 記錄初始角度
        this.lastAngle = this.getAngle(pointer);
        this.isActive = true;
        this.rotationSpeed = 0;

        // 記錄觸控點
        this.activePointers.set(pointer.id, {
            angle: this.lastAngle,
            time: Date.now()
        });

        // 視覺回饋
        if (this.dial.onInteractionStart) {
            this.dial.onInteractionStart();
        }
    }

    /**
     * 指針移動
     */
    onPointerMove(pointer) {
        if (!this.isActive) return;
        if (!this.activePointers.has(pointer.id)) return;

        // 計算當前角度
        const currentAngle = this.getAngle(pointer);

        // 計算角度差
        const angleDelta = this.getAngleDelta(this.lastAngle, currentAngle);

        // 轉換為度數並應用靈敏度
        const rotationDelta = Phaser.Math.RadToDeg(angleDelta) * this.sensitivity;

        // 更新旋轉速度（用於慣性）
        this.rotationSpeed = rotationDelta;

        // 通知轉盤旋轉
        if (this.dial.onRotate) {
            this.dial.onRotate(rotationDelta);
        }

        // 更新記錄
        this.lastAngle = currentAngle;
        this.activePointers.get(pointer.id).angle = currentAngle;
        this.activePointers.get(pointer.id).time = Date.now();
    }

    /**
     * 指針抬起
     */
    onPointerUp(pointer) {
        // 移除觸控點
        this.activePointers.delete(pointer.id);

        // 如果還有其他觸控點，繼續操作
        if (this.activePointers.size > 0) {
            // 切換到剩餘的觸控點
            const [firstId, firstPointer] = this.activePointers.entries().next().value;
            this.lastAngle = firstPointer.angle;
            return;
        }

        // 所有觸控點都已釋放
        this.isActive = false;

        // 視覺回饋
        if (this.dial.onInteractionEnd) {
            this.dial.onInteractionEnd();
        }
    }

    /**
     * 指針移出
     */
    onPointerOut(pointer) {
        // 觸控移出轉盤區域，視為釋放
        this.onPointerUp(pointer);
    }

    /**
     * 應用慣性（每幀更新）
     */
    applyInertia() {
        if (this.isActive) return;  // 正在操作時不應用慣性

        if (Math.abs(this.rotationSpeed) > this.minSpeed) {
            // 應用慣性旋轉
            if (this.dial.onRotate) {
                this.dial.onRotate(this.rotationSpeed);
            }

            // 衰減速度
            this.rotationSpeed *= this.rotationDamping;
        } else {
            // 速度太小，停止慣性
            this.rotationSpeed = 0;
        }
    }

    /**
     * 更新（每幀調用）
     */
    update() {
        this.applyInertia();
    }

    /**
     * 啟用/禁用輸入
     */
    setEnabled(enabled) {
        if (this.dial.container) {
            this.dial.container.setInteractive(enabled);
        }
    }

    /**
     * 銷毀
     */
    destroy() {
        if (this.dial.container) {
            this.dial.container.off('pointerdown', this.onPointerDown, this);
            this.dial.container.off('pointermove', this.onPointerMove, this);
            this.dial.container.off('pointerup', this.onPointerUp, this);
            this.dial.container.off('pointerout', this.onPointerOut, this);
        }

        this.activePointers.clear();
        this.scene = null;
        this.dial = null;
    }
}

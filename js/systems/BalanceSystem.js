/**
 * 平衡檢核系統 (Balance System)
 * 檢查供需平衡，判斷過關條件
 */

class BalanceSystem {
    constructor(scene, energySystem, demandSystem) {
        this.scene = scene;
        this.energySystem = energySystem;
        this.demandSystem = demandSystem;

        // 平衡參數
        this.balanceTolerance = 100;  // 容許差值 (±MW)
        this.balanceDuration = 5000;  // 需維持時間 (毫秒)

        // 狀態追蹤
        this.stableTime = 0;  // 已穩定時間
        this.isBalanced = false;  // 當前是否平衡
        this.maxImbalance = 0;  // 最大失衡值
        this.balanceHistory = [];  // 平衡歷史記錄

        // 電網頻率（模擬值）
        this.frequency = 60.0;  // 台灣電網標準頻率 60Hz
        this.frequencyMin = 59.5;
        this.frequencyMax = 60.5;

        // 統計數據
        this.totalBalancedTime = 0;  // 總平衡時間
        this.totalTime = 0;  // 總遊戲時間
    }

    /**
     * 設定過關條件
     */
    setWinConditions(tolerance, duration) {
        this.balanceTolerance = tolerance;
        this.balanceDuration = duration * 1000;  // 轉換為毫秒
    }

    /**
     * 計算供需差
     */
    getSupplyDemandGap() {
        const supply = this.energySystem.getTotalSupply();
        const demand = this.demandSystem.getActualDemand();
        return supply - demand;
    }

    /**
     * 獲取供需差的絕對值
     */
    getAbsoluteGap() {
        return Math.abs(this.getSupplyDemandGap());
    }

    /**
     * 檢查當前是否平衡
     */
    checkBalance() {
        const gap = this.getAbsoluteGap();
        this.isBalanced = gap <= this.balanceTolerance;
        return this.isBalanced;
    }

    /**
     * 計算電網頻率（基於供需差）
     * 供電過多 → 頻率上升
     * 供電不足 → 頻率下降
     */
    calculateFrequency() {
        const gap = this.getSupplyDemandGap();
        const demand = this.demandSystem.getActualDemand();

        // 頻率偏移 = 供需差 / 總需求 * 靈敏度
        const sensitivity = 0.5;  // 靈敏度係數
        const frequencyOffset = (gap / demand) * sensitivity;

        this.frequency = Phaser.Math.Clamp(
            60.0 + frequencyOffset,
            this.frequencyMin,
            this.frequencyMax
        );

        return this.frequency;
    }

    /**
     * 獲取頻率狀態
     */
    getFrequencyStatus() {
        if (this.frequency < 59.7) return { status: '低頻', color: 0xff0000 };
        if (this.frequency < 59.9) return { status: '偏低', color: 0xffaa00 };
        if (this.frequency > 60.3) return { status: '高頻', color: 0xff0000 };
        if (this.frequency > 60.1) return { status: '偏高', color: 0xffaa00 };
        return { status: '正常', color: 0x00ff00 };
    }

    /**
     * 獲取供需平衡等級
     */
    getBalanceGrade() {
        const gap = this.getAbsoluteGap();

        if (gap <= 50) return 'A';
        if (gap <= 100) return 'B';
        if (gap <= 200) return 'C';
        if (gap <= 300) return 'D';
        return 'F';
    }

    /**
     * 獲取供需平衡顏色
     */
    getBalanceColor() {
        const gap = this.getAbsoluteGap();

        if (gap <= 50) return 0x00ff00;   // 綠色：優秀
        if (gap <= 100) return 0x7fff00;  // 黃綠：良好
        if (gap <= 200) return 0xffaa00;  // 橙色：注意
        if (gap <= 300) return 0xff6600;  // 深橙：警告
        return 0xff0000;  // 紅色：危險
    }

    /**
     * 檢查是否達成過關條件
     */
    checkWinCondition() {
        return this.stableTime >= this.balanceDuration;
    }

    /**
     * 獲取穩定進度（0-1）
     */
    getStableProgress() {
        return Math.min(this.stableTime / this.balanceDuration, 1);
    }

    /**
     * 獲取統計數據
     */
    getStatistics() {
        return {
            maxImbalance: Math.round(this.maxImbalance),
            totalBalancedTime: Math.round(this.totalBalancedTime / 1000),
            totalTime: Math.round(this.totalTime / 1000),
            balanceRate: this.totalTime > 0
                ? Math.round((this.totalBalancedTime / this.totalTime) * 100)
                : 0,
            finalGrade: this.getBalanceGrade()
        };
    }

    /**
     * 更新系統（每幀調用）
     */
    update(deltaTime) {
        // 檢查平衡狀態
        const balanced = this.checkBalance();

        // 更新穩定時間
        if (balanced) {
            this.stableTime += deltaTime;
            this.totalBalancedTime += deltaTime;
        } else {
            this.stableTime = 0;  // 重置穩定時間
        }

        // 更新總時間
        this.totalTime += deltaTime;

        // 記錄最大失衡值
        const currentGap = this.getAbsoluteGap();
        if (currentGap > this.maxImbalance) {
            this.maxImbalance = currentGap;
        }

        // 計算電網頻率
        this.calculateFrequency();

        // 記錄歷史（每秒記錄一次）
        if (this.totalTime % 1000 < deltaTime) {
            this.balanceHistory.push({
                time: this.totalTime,
                gap: currentGap,
                balanced: balanced
            });
        }
    }

    /**
     * 重置系統
     */
    reset() {
        this.stableTime = 0;
        this.isBalanced = false;
        this.maxImbalance = 0;
        this.balanceHistory = [];
        this.totalBalancedTime = 0;
        this.totalTime = 0;
        this.frequency = 60.0;
    }

    /**
     * 銷毀系統
     */
    destroy() {
        this.scene = null;
        this.energySystem = null;
        this.demandSystem = null;
        this.balanceHistory = null;
    }
}

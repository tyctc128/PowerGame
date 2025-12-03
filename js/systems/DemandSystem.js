/**
 * 用電需求系統 (Demand System)
 * 管理用電負載和需求變化
 */

class DemandSystem {
    constructor(scene, energySystem) {
        this.scene = scene;
        this.energySystem = energySystem;

        // 用電參數
        this.baseDemand = 30000;  // 基礎用電需求 (MW)
        this.currentDemand = 30000;  // 當前用電需求

        // 動態變化參數
        this.enableNaturalVariation = true;
        this.variationTimer = 0;
        this.variationInterval = 2000;  // 每2秒變化一次（更頻繁）

        // 週期性波動（模擬一天中的用電變化）
        this.cycleAmplitude = 3000;  // 週期波動幅度 (MW)
        this.cycleFrequency = 0.0001;  // 週期頻率（越小週期越長）
        this.cyclePhase = 0;  // 當前相位

        // 趨勢性變化
        this.trendDirection = 0;  // 趨勢方向（1=上升，-1=下降，0=無趨勢）
        this.trendRate = 50;  // 趨勢變化率 (MW/秒)
        this.trendTimer = 0;
        this.trendChangeInterval = 15000;  // 每15秒可能改變趨勢

        // 記錄初始基準
        this.initialBaseDemand = 30000;
    }

    /**
     * 設定基礎用電需求
     */
    setBaseDemand(demand) {
        this.baseDemand = demand;
        this.currentDemand = demand;
        this.initialBaseDemand = demand;
    }

    /**
     * 調整用電需求（用於事件）
     * @param {number} change - 變化量（MW）
     */
    adjustDemand(change) {
        this.currentDemand = Math.max(0, this.currentDemand + change);
    }

    /**
     * 設定用電需求（絕對值）
     */
    setDemand(demand) {
        this.currentDemand = Math.max(0, demand);
    }

    /**
     * 計算週期性波動
     */
    getCyclicVariation() {
        // 使用正弦波模擬一天中的用電變化
        return Math.sin(this.cyclePhase) * this.cycleAmplitude;
    }

    /**
     * 隨機改變趨勢方向
     */
    updateTrend() {
        const random = Math.random();
        if (random < 0.3) {
            // 30% 機率上升趨勢
            this.trendDirection = 1;
        } else if (random < 0.6) {
            // 30% 機率下降趨勢
            this.trendDirection = -1;
        } else {
            // 40% 機率無趨勢
            this.trendDirection = 0;
        }
    }

    /**
     * 自然波動（模擬真實用電變化）
     */
    applyNaturalVariation() {
        if (!this.enableNaturalVariation) return;

        // 1. 隨機波動 ±800 MW（約±2.5%）
        const randomVariation = Phaser.Math.Between(-800, 800);

        // 2. 週期性波動
        const cyclicVariation = this.getCyclicVariation();

        // 3. 趨勢性變化
        const trendVariation = this.trendDirection * this.trendRate * (this.variationInterval / 1000);

        // 計算新的用電需求
        let newDemand = this.baseDemand + randomVariation + cyclicVariation + trendVariation;

        // 限制在合理範圍內（不低於基礎值的50%，不高於150%）
        const minDemand = this.initialBaseDemand * 0.5;
        const maxDemand = this.initialBaseDemand * 1.5;
        newDemand = Phaser.Math.Clamp(newDemand, minDemand, maxDemand);

        this.currentDemand = newDemand;
    }

    /**
     * 獲取實際用電需求（扣除節電量）
     */
    getActualDemand() {
        const demandReduction = this.energySystem.getDemandReduction();
        return Math.max(0, this.currentDemand - demandReduction);
    }

    /**
     * 獲取原始用電需求（不扣除節電）
     */
    getRawDemand() {
        return this.currentDemand;
    }

    /**
     * 獲取節電量
     */
    getDemandReduction() {
        return this.energySystem.getDemandReduction();
    }

    /**
     * 獲取用電等級描述
     */
    getDemandLevel() {
        if (this.currentDemand < 25000) return { level: '低載', color: 0x00ff00 };
        if (this.currentDemand < 32000) return { level: '中載', color: 0xffaa00 };
        if (this.currentDemand < 38000) return { level: '高載', color: 0xff6600 };
        return { level: '尖峰', color: 0xff0000 };
    }

    /**
     * 更新系統（每幀調用）
     */
    update(deltaTime) {
        // 更新週期相位
        this.cyclePhase += this.cycleFrequency * deltaTime;

        // 自然波動計時器
        this.variationTimer += deltaTime;
        if (this.variationTimer >= this.variationInterval) {
            this.applyNaturalVariation();
            this.variationTimer = 0;
        }

        // 趨勢變化計時器
        this.trendTimer += deltaTime;
        if (this.trendTimer >= this.trendChangeInterval) {
            this.updateTrend();
            this.trendTimer = 0;
        }
    }

    /**
     * 重置系統
     */
    reset() {
        this.baseDemand = 30000;
        this.currentDemand = 30000;
        this.initialBaseDemand = 30000;
        this.variationTimer = 0;
        this.cyclePhase = 0;
        this.trendDirection = 0;
        this.trendTimer = 0;
    }

    /**
     * 銷毀系統
     */
    destroy() {
        this.scene = null;
        this.energySystem = null;
    }
}

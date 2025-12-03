/**
 * 能源系統 (Energy System)
 * 管理所有能源的狀態和變化
 */

class EnergySystem {
    constructor(scene) {
        this.scene = scene;
        this.energies = {};
        this.limits = {};  // 能源限制（用於特殊關卡）

        this.initialize();
    }

    /**
     * 初始化能源系統
     */
    initialize() {
        // 深拷貝能源資料
        ENERGY_TYPES.forEach(type => {
            this.energies[type] = { ...ENERGY_DATA[type] };
        });
    }

    /**
     * 設定關卡的能源限制
     */
    setLimits(limits) {
        this.limits = limits || {};

        // 應用限制到能源上限
        Object.keys(this.limits).forEach(type => {
            if (this.energies[type]) {
                const originalMax = ENERGY_DATA[type].max;
                this.energies[type].max = originalMax * this.limits[type];

                // 如果當前值超過新上限，調整為上限
                if (this.energies[type].current > this.energies[type].max) {
                    this.energies[type].current = this.energies[type].max;
                }
            }
        });
    }

    /**
     * 重置能源系統到初始狀態
     */
    reset() {
        ENERGY_TYPES.forEach(type => {
            this.energies[type].current = ENERGY_DATA[type].current;
            this.energies[type].max = ENERGY_DATA[type].max;
            this.energies[type].min = ENERGY_DATA[type].min;
        });
        this.limits = {};
    }

    /**
     * 調整能源輸出（玩家旋轉轉盤）
     * @param {string} type - 能源類型
     * @param {number} delta - 變化量（正數增加，負數減少）
     * @param {number} deltaTime - 時間差（毫秒）
     */
    adjustEnergy(type, delta, deltaTime) {
        const energy = this.energies[type];

        if (!energy || !energy.controlled) {
            return false;  // 不可控能源無法調整
        }

        // 計算變化量 = 變化率 * 時間 * 方向
        const change = energy.changeRate * (deltaTime / 1000) * Math.sign(delta);

        // 更新能源值
        energy.current = Phaser.Math.Clamp(
            energy.current + change,
            energy.min,
            energy.max
        );

        return true;
    }

    /**
     * 設定能源值（用於天氣系統或事件）
     * @param {string} type - 能源類型
     * @param {number} value - 新值
     */
    setEnergy(type, value) {
        const energy = this.energies[type];
        if (!energy) return false;

        energy.current = Phaser.Math.Clamp(value, energy.min, energy.max);
        return true;
    }

    /**
     * 根據百分比調整能源（用於天氣事件）
     * @param {string} type - 能源類型
     * @param {number} percentChange - 百分比變化（如 -30 表示下降30%）
     */
    adjustEnergyByPercent(type, percentChange) {
        const energy = this.energies[type];
        if (!energy) return false;

        const change = energy.current * (percentChange / 100);
        energy.current = Phaser.Math.Clamp(
            energy.current + change,
            energy.min,
            energy.max
        );

        return true;
    }

    /**
     * 獲取能源值
     */
    getEnergy(type) {
        return this.energies[type]?.current || 0;
    }

    /**
     * 獲取所有能源資料
     */
    getAllEnergies() {
        return this.energies;
    }

    /**
     * 計算總發電量（不包含需求側）
     */
    getTotalSupply() {
        return SUPPLY_TYPES.reduce((sum, type) => {
            return sum + this.energies[type].current;
        }, 0);
    }

    /**
     * 獲取節電量
     */
    getDemandReduction() {
        return this.energies.demand.current;
    }

    /**
     * 檢查能源是否可控
     */
    isControllable(type) {
        return this.energies[type]?.controlled || false;
    }

    /**
     * 獲取能源百分比（當前值/最大值）
     */
    getEnergyPercent(type) {
        const energy = this.energies[type];
        if (!energy) return 0;
        return (energy.current / energy.max) * 100;
    }

    /**
     * 更新系統（每幀調用）
     */
    update(deltaTime) {
        // 這裡可以加入自動衰減、慣性等邏輯
        // 目前保持簡單，由天氣系統和事件系統控制不可控能源
    }

    /**
     * 銷毀系統
     */
    destroy() {
        this.energies = null;
        this.limits = null;
        this.scene = null;
    }
}

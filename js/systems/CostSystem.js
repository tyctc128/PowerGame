/**
 * 成本系統 (Cost System)
 * 追蹤和計算發電成本
 */

class CostSystem {
    constructor(scene, energySystem) {
        this.scene = scene;
        this.energySystem = energySystem;

        // 成本追蹤
        this.totalCost = 0;  // 總成本（元）
        this.energyCosts = {};  // 各能源的累計成本
        this.energyGenerated = {};  // 各能源的累計發電量（MWh）

        // 初始化追蹤數據
        this.initialize();
    }

    /**
     * 初始化成本追蹤
     */
    initialize() {
        SUPPLY_TYPES.forEach(type => {
            this.energyCosts[type] = 0;
            this.energyGenerated[type] = 0;
        });
    }

    /**
     * 計算當前成本率（元/秒）
     * 基於當前各能源的輸出功率
     */
    getCurrentCostRate() {
        let costRate = 0;

        SUPPLY_TYPES.forEach(type => {
            const energy = this.energySystem.getEnergy(type);  // MW
            const costPerKWh = ENERGY_DATA[type].cost;  // 元/度(kWh)

            // MW → kW → 每秒的度數 → 每秒的成本
            // 1 MW = 1000 kW
            // 1秒 = 1/3600 小時
            // 所以 1 MW 運行 1 秒 = 1000 kW * (1/3600) h = 0.2778 kWh
            const kWhPerSecond = energy * 1000 / 3600;
            const costPerSecond = kWhPerSecond * costPerKWh;

            costRate += costPerSecond;
        });

        return costRate;
    }

    /**
     * 更新成本（每幀調用）
     * @param {number} deltaTime - 時間差（毫秒）
     */
    update(deltaTime) {
        const deltaSeconds = deltaTime / 1000;

        SUPPLY_TYPES.forEach(type => {
            const energy = this.energySystem.getEnergy(type);  // MW
            const costPerKWh = ENERGY_DATA[type].cost;  // 元/度(kWh)

            // 計算這段時間的發電量（MWh）
            const energyGenerated = energy * (deltaSeconds / 3600);  // MWh

            // 計算這段時間的成本
            // MWh → kWh → 成本
            const cost = energyGenerated * 1000 * costPerKWh;

            // 累計
            this.energyGenerated[type] += energyGenerated;
            this.energyCosts[type] += cost;
            this.totalCost += cost;
        });
    }

    /**
     * 獲取總成本
     */
    getTotalCost() {
        return this.totalCost;
    }

    /**
     * 獲取某種能源的累計成本
     */
    getEnergyCost(type) {
        return this.energyCosts[type] || 0;
    }

    /**
     * 獲取某種能源的累計發電量（MWh）
     */
    getEnergyGenerated(type) {
        return this.energyGenerated[type] || 0;
    }

    /**
     * 獲取平均成本（元/度）
     */
    getAverageCost() {
        const totalGenerated = Object.values(this.energyGenerated).reduce((sum, val) => sum + val, 0);
        if (totalGenerated === 0) return 0;

        // 總成本 / 總發電量(MWh) / 1000(轉換為kWh)
        return this.totalCost / (totalGenerated * 1000);
    }

    /**
     * 獲取成本效率評級
     * 基於平均成本
     */
    getCostGrade() {
        const avgCost = this.getAverageCost();

        if (avgCost <= 2.2) return 'A';  // 優秀：大量使用低成本能源
        if (avgCost <= 2.5) return 'B';  // 良好
        if (avgCost <= 3.0) return 'C';  // 中等
        if (avgCost <= 3.5) return 'D';  // 偏高
        return 'F';  // 過高：大量使用高成本能源
    }

    /**
     * 獲取統計數據
     */
    getStatistics() {
        const statistics = {
            totalCost: Math.round(this.totalCost),
            averageCost: this.getAverageCost().toFixed(2),
            costGrade: this.getCostGrade(),
            breakdown: {}
        };

        // 各能源的成本分解
        SUPPLY_TYPES.forEach(type => {
            statistics.breakdown[type] = {
                name: ENERGY_DATA[type].name,
                generated: this.energyGenerated[type].toFixed(2),  // MWh
                cost: Math.round(this.energyCosts[type]),  // 元
                percentage: this.totalCost > 0
                    ? Math.round((this.energyCosts[type] / this.totalCost) * 100)
                    : 0
            };
        });

        return statistics;
    }

    /**
     * 重置系統
     */
    reset() {
        this.totalCost = 0;
        this.initialize();
    }

    /**
     * 銷毀系統
     */
    destroy() {
        this.scene = null;
        this.energySystem = null;
        this.energyCosts = null;
        this.energyGenerated = null;
    }
}

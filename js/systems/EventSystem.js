/**
 * 事件系統 (Event System)
 * 處理關卡事件腳本的觸發和執行
 */

class EventSystem {
    constructor(scene, energySystem, weatherSystem, demandSystem) {
        this.scene = scene;
        this.energySystem = energySystem;
        this.weatherSystem = weatherSystem;
        this.demandSystem = demandSystem;

        // 事件佇列
        this.events = [];
        this.currentTime = 0;  // 遊戲時間（毫秒）
        this.executedEvents = [];  // 已執行的事件

        // 事件回調
        this.onEventTriggered = null;  // 事件觸發時的回調函數
    }

    /**
     * 載入關卡事件
     */
    loadEvents(events) {
        this.events = [...events];  // 深拷貝
        this.events.sort((a, b) => a.time - b.time);  // 按時間排序
        this.currentTime = 0;
        this.executedEvents = [];
    }

    /**
     * 執行單個事件
     */
    executeEvent(event) {
        switch (event.type) {
            case 'weather':
                this.handleWeatherEvent(event);
                break;

            case 'demand_change':
                this.handleDemandChangeEvent(event);
                break;

            case 'energy_failure':
                this.handleEnergyFailureEvent(event);
                break;

            case 'energy_recovery':
                this.handleEnergyRecoveryEvent(event);
                break;

            case 'demand_response_boost':
                this.handleDemandResponseBoost(event);
                break;

            case 'system_message':
                // 僅顯示訊息，不做任何操作
                break;

            default:
                console.warn('未知事件類型:', event.type);
        }

        // 記錄已執行的事件
        this.executedEvents.push(event);

        // 觸發回調（通知UI顯示訊息）
        if (this.onEventTriggered) {
            this.onEventTriggered(event);
        }
    }

    /**
     * 處理天氣事件
     */
    handleWeatherEvent(event) {
        const { target, value } = event;

        if (target === 'solar') {
            this.weatherSystem.adjustSunIntensity(value);
        } else if (target === 'wind') {
            this.weatherSystem.adjustWindSpeed(value);
        }
    }

    /**
     * 處理需求變化事件
     */
    handleDemandChangeEvent(event) {
        this.demandSystem.adjustDemand(event.value);
    }

    /**
     * 處理能源故障事件
     */
    handleEnergyFailureEvent(event) {
        const { target, value } = event;

        // 根據百分比減少能源
        this.energySystem.adjustEnergyByPercent(target, value);
    }

    /**
     * 處理能源恢復事件
     */
    handleEnergyRecoveryEvent(event) {
        const { target, value } = event;

        // 根據百分比增加能源
        this.energySystem.adjustEnergyByPercent(target, value);
    }

    /**
     * 處理需求響應提升事件（關卡5專用）
     */
    handleDemandResponseBoost(event) {
        const demandEnergy = this.energySystem.energies.demand;
        const originalMax = ENERGY_DATA.demand.max;

        // 提升節電上限
        demandEnergy.max = originalMax * event.value;
    }

    /**
     * 獲取即將發生的事件（用於預告）
     */
    getUpcomingEvents(timeWindow = 10) {
        const futureTime = this.currentTime + timeWindow * 1000;
        return this.events.filter(event =>
            event.time * 1000 > this.currentTime &&
            event.time * 1000 <= futureTime
        );
    }

    /**
     * 獲取已執行的事件
     */
    getExecutedEvents() {
        return this.executedEvents;
    }

    /**
     * 檢查是否還有未執行的事件
     */
    hasRemainingEvents() {
        return this.events.some(event =>
            event.time * 1000 > this.currentTime
        );
    }

    /**
     * 更新系統（每幀調用）
     */
    update(deltaTime) {
        this.currentTime += deltaTime;

        // 檢查需要觸發的事件
        const currentSeconds = this.currentTime / 1000;

        this.events = this.events.filter(event => {
            if (event.time <= currentSeconds) {
                this.executeEvent(event);
                return false;  // 移除已執行的事件
            }
            return true;  // 保留未執行的事件
        });
    }

    /**
     * 重置系統
     */
    reset() {
        this.events = [];
        this.currentTime = 0;
        this.executedEvents = [];
    }

    /**
     * 設定事件觸發回調
     */
    setEventCallback(callback) {
        this.onEventTriggered = callback;
    }

    /**
     * 銷毀系統
     */
    destroy() {
        this.scene = null;
        this.energySystem = null;
        this.weatherSystem = null;
        this.demandSystem = null;
        this.events = null;
        this.executedEvents = null;
        this.onEventTriggered = null;
    }
}

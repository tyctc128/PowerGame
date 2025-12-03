/**
 * 天氣系統 (Weather System)
 * 控制風力和太陽能的變化
 */

class WeatherSystem {
    constructor(scene, energySystem) {
        this.scene = scene;
        this.energySystem = energySystem;

        // 天氣參數
        this.sunIntensity = 80;  // 日照強度 (0-100)
        this.windSpeed = 60;     // 風速 (0-100)

        // 基準值（用於計算實際輸出）
        this.solarBaseOutput = ENERGY_DATA.solar.current;
        this.windBaseOutput = ENERGY_DATA.wind.current;

        // 自然波動（隨機微調）
        this.enableNaturalVariation = true;
        this.variationTimer = 0;
        this.variationInterval = 3000;  // 每3秒微調一次
    }

    /**
     * 設定初始天氣條件
     */
    setInitialWeather(sunIntensity, windSpeed) {
        this.sunIntensity = sunIntensity;
        this.windSpeed = windSpeed;

        this.updateEnergyOutputs();
    }

    /**
     * 調整日照強度（百分比）
     * @param {number} percentChange - 變化百分比（如 -30 表示下降30%）
     */
    adjustSunIntensity(percentChange) {
        this.sunIntensity = Phaser.Math.Clamp(
            this.sunIntensity + percentChange,
            0,
            120  // 最高可達120%（特別晴朗）
        );

        this.updateSolarOutput();
    }

    /**
     * 調整風速（百分比）
     * @param {number} percentChange - 變化百分比
     */
    adjustWindSpeed(percentChange) {
        this.windSpeed = Phaser.Math.Clamp(
            this.windSpeed + percentChange,
            0,
            150  // 最高可達150%（強風）
        );

        this.updateWindOutput();
    }

    /**
     * 設定日照強度（絕對值）
     */
    setSunIntensity(value) {
        this.sunIntensity = Phaser.Math.Clamp(value, 0, 120);
        this.updateSolarOutput();
    }

    /**
     * 設定風速（絕對值）
     */
    setWindSpeed(value) {
        this.windSpeed = Phaser.Math.Clamp(value, 0, 150);
        this.updateWindOutput();
    }

    /**
     * 更新太陽能輸出
     */
    updateSolarOutput() {
        const output = (this.solarBaseOutput * this.sunIntensity) / 100;
        this.energySystem.setEnergy('solar', output);
    }

    /**
     * 更新風力輸出
     */
    updateWindOutput() {
        const output = (this.windBaseOutput * this.windSpeed) / 100;
        this.energySystem.setEnergy('wind', output);
    }

    /**
     * 同時更新兩者
     */
    updateEnergyOutputs() {
        this.updateSolarOutput();
        this.updateWindOutput();
    }

    /**
     * 自然波動（微小的隨機變化）
     */
    applyNaturalVariation() {
        if (!this.enableNaturalVariation) return;

        // 太陽能微調 ±2%
        const solarVariation = Phaser.Math.Between(-2, 2);
        this.adjustSunIntensity(solarVariation);

        // 風力微調 ±5%（風力波動較大）
        const windVariation = Phaser.Math.Between(-5, 5);
        this.adjustWindSpeed(windVariation);
    }

    /**
     * 獲取天氣狀態描述
     */
    getWeatherDescription() {
        let sunDesc = '晴朗';
        if (this.sunIntensity < 20) sunDesc = '陰暗';
        else if (this.sunIntensity < 50) sunDesc = '多雲';
        else if (this.sunIntensity < 80) sunDesc = '晴時多雲';
        else if (this.sunIntensity > 100) sunDesc = '艷陽高照';

        let windDesc = '微風';
        if (this.windSpeed < 30) windDesc = '無風';
        else if (this.windSpeed < 60) windDesc = '微風';
        else if (this.windSpeed < 90) windDesc = '強風';
        else windDesc = '暴風';

        return { sun: sunDesc, wind: windDesc };
    }

    /**
     * 獲取天氣圖示
     */
    getWeatherIcon() {
        let sunIcon = '☀️';
        if (this.sunIntensity < 20) sunIcon = '☁️';
        else if (this.sunIntensity < 50) sunIcon = '⛅';
        else if (this.sunIntensity < 80) sunIcon = '🌤️';
        else if (this.sunIntensity > 100) sunIcon = '☀️';

        let windIcon = '🍃';
        if (this.windSpeed < 30) windIcon = '💨';
        else if (this.windSpeed > 90) windIcon = '🌪️';

        return { sun: sunIcon, wind: windIcon };
    }

    /**
     * 更新系統（每幀調用）
     */
    update(deltaTime) {
        // 自然波動計時器
        this.variationTimer += deltaTime;

        if (this.variationTimer >= this.variationInterval) {
            this.applyNaturalVariation();
            this.variationTimer = 0;
        }
    }

    /**
     * 重置天氣系統
     */
    reset() {
        this.sunIntensity = 80;
        this.windSpeed = 60;
        this.variationTimer = 0;
        this.updateEnergyOutputs();
    }

    /**
     * 銷毀系統
     */
    destroy() {
        this.scene = null;
        this.energySystem = null;
    }
}

/**
 * 儀表板 (Dashboard)
 * 顯示遊戲數據和狀態
 */

class Dashboard {
    constructor(scene, x, y, energySystem, demandSystem, balanceSystem, weatherSystem, costSystem) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.energySystem = energySystem;
        this.demandSystem = demandSystem;
        this.balanceSystem = balanceSystem;
        this.weatherSystem = weatherSystem;
        this.costSystem = costSystem;

        // 容器
        this.container = null;

        // 文字元素
        this.texts = {};

        // 視覺參數
        this.width = 300;
        this.padding = 20;
        this.lineHeight = 35;

        this.create();
    }

    /**
     * 創建儀表板
     */
    create() {
        this.container = this.scene.add.container(this.x, this.y);

        // 背景面板
        const background = this.scene.add.rectangle(
            0, 0,
            this.width, 550,
            0x0a0e27, 0.85
        ).setOrigin(0);

        const border = this.scene.add.rectangle(
            0, 0,
            this.width, 550,
            0x000000, 0
        ).setStrokeStyle(2, 0x00d9ff, 0.6).setOrigin(0);

        this.container.add([background, border]);

        // 標題
        const title = this.scene.add.text(
            this.padding, this.padding,
            '⚡ 電網狀態',
            {
                fontSize: '22px',
                fontFamily: 'Microsoft JhengHei, Arial',
                color: '#00d9ff',
                fontStyle: 'bold'
            }
        );
        this.container.add(title);

        // 創建數據文字
        let yOffset = this.padding + 40;

        // 總發電量
        this.texts.supply = this.createDataRow(
            '總發電量',
            '0 MW',
            yOffset,
            0x00ff00
        );
        yOffset += this.lineHeight;

        // 目前用電
        this.texts.demand = this.createDataRow(
            '目前用電',
            '0 MW',
            yOffset,
            0xffaa00
        );
        yOffset += this.lineHeight;

        // 節電量
        this.texts.reduction = this.createDataRow(
            '節電量',
            '0 MW',
            yOffset,
            0x9370db
        );
        yOffset += this.lineHeight;

        // 分隔線
        const divider1 = this.scene.add.rectangle(
            this.padding, yOffset + 10,
            this.width - this.padding * 2, 1,
            0x00d9ff, 0.3
        ).setOrigin(0);
        this.container.add(divider1);
        yOffset += 30;

        // 供需差
        this.texts.gap = this.createDataRow(
            '供需差',
            '0 MW',
            yOffset,
            0xffffff
        );
        yOffset += this.lineHeight;

        // 平衡狀態
        this.texts.balance = this.createDataRow(
            '平衡狀態',
            '失衡',
            yOffset,
            0xff0000
        );
        yOffset += this.lineHeight;

        // 穩定時間進度條
        yOffset += 10;
        const stableLabel = this.scene.add.text(
            this.padding, yOffset,
            '穩定時間',
            {
                fontSize: '14px',
                fontFamily: 'Microsoft JhengHei, Arial',
                color: '#00d9ff'
            }
        );
        this.container.add(stableLabel);
        yOffset += 25;

        // 進度條背景
        this.progressBarBg = this.scene.add.rectangle(
            this.padding, yOffset,
            this.width - this.padding * 2, 20,
            0x1a1e3e, 0.8
        ).setOrigin(0);

        // 進度條填充
        this.progressBarFill = this.scene.add.rectangle(
            this.padding, yOffset,
            0, 20,
            0x00ff00, 0.8
        ).setOrigin(0);

        // 進度條文字
        this.progressBarText = this.scene.add.text(
            this.padding + (this.width - this.padding * 2) / 2,
            yOffset + 10,
            '0 / 5 秒',
            {
                fontSize: '12px',
                fontFamily: 'Arial',
                color: '#ffffff'
            }
        ).setOrigin(0.5);

        this.container.add([this.progressBarBg, this.progressBarFill, this.progressBarText]);
        yOffset += 40;

        // 分隔線
        const divider2 = this.scene.add.rectangle(
            this.padding, yOffset,
            this.width - this.padding * 2, 1,
            0x00d9ff, 0.3
        ).setOrigin(0);
        this.container.add(divider2);
        yOffset += 20;

        // 電網頻率
        this.texts.frequency = this.createDataRow(
            '電網頻率',
            '60.00 Hz',
            yOffset,
            0x00ff00
        );
        yOffset += this.lineHeight;

        // 天氣資訊
        this.texts.weather = this.createDataRow(
            '天氣',
            '日照 80%, 風速 60%',
            yOffset,
            0xffffff
        );
        yOffset += this.lineHeight;

        // 剩餘時間（可選，用於關卡）
        this.texts.timer = this.createDataRow(
            '關卡時間',
            '--',
            yOffset,
            0xffaa00
        );
        yOffset += this.lineHeight;

        // 分隔線
        const divider3 = this.scene.add.rectangle(
            this.padding, yOffset,
            this.width - this.padding * 2, 1,
            0x00d9ff, 0.3
        ).setOrigin(0);
        this.container.add(divider3);
        yOffset += 20;

        // 當前成本率
        this.texts.costRate = this.createDataRow(
            '當前成本',
            '0 元/秒',
            yOffset,
            0xffd700
        );
        yOffset += this.lineHeight;

        // 累計總成本
        this.texts.totalCost = this.createDataRow(
            '累計成本',
            '0 元',
            yOffset,
            0xff9900
        );
    }

    /**
     * 創建數據行
     */
    createDataRow(label, value, y, color) {
        const labelText = this.scene.add.text(
            this.padding, y,
            label + ':',
            {
                fontSize: '14px',
                fontFamily: 'Microsoft JhengHei, Arial',
                color: '#aaaaaa'
            }
        );

        const valueText = this.scene.add.text(
            this.padding, y + 18,
            value,
            {
                fontSize: '18px',
                fontFamily: 'Arial',
                color: '#' + color.toString(16).padStart(6, '0'),
                fontStyle: 'bold'
            }
        );

        this.container.add([labelText, valueText]);

        return { label: labelText, value: valueText };
    }

    /**
     * 更新顯示
     */
    updateDisplay() {
        // 總發電量
        const supply = Math.round(this.energySystem.getTotalSupply());
        this.texts.supply.value.setText(`${supply} MW`);

        // 原始用電需求
        const rawDemand = Math.round(this.demandSystem.getRawDemand());
        this.texts.demand.value.setText(`${rawDemand} MW`);

        // 節電量
        const reduction = Math.round(this.demandSystem.getDemandReduction());
        this.texts.reduction.value.setText(`${reduction} MW`);

        // 供需差
        const gap = Math.round(this.balanceSystem.getSupplyDemandGap());
        const gapColor = this.balanceSystem.getBalanceColor();
        this.texts.gap.value.setText(`${gap > 0 ? '+' : ''}${gap} MW`);
        this.texts.gap.value.setColor('#' + gapColor.toString(16).padStart(6, '0'));

        // 平衡狀態
        const balanced = this.balanceSystem.isBalanced;
        this.texts.balance.value.setText(balanced ? '✓ 平衡' : '✗ 失衡');
        this.texts.balance.value.setColor(balanced ? '#00ff00' : '#ff0000');

        // 穩定時間進度
        const progress = this.balanceSystem.getStableProgress();
        const stableSeconds = Math.round(this.balanceSystem.stableTime / 1000);
        const requiredSeconds = Math.round(this.balanceSystem.balanceDuration / 1000);

        const barWidth = (this.width - this.padding * 2) * progress;
        this.progressBarFill.setSize(barWidth, 20);
        this.progressBarText.setText(`${stableSeconds} / ${requiredSeconds} 秒`);

        // 進度條顏色變化
        if (progress >= 1) {
            this.progressBarFill.setFillStyle(0x00ff00, 1);
        } else if (progress >= 0.6) {
            this.progressBarFill.setFillStyle(0x7fff00, 0.8);
        } else {
            this.progressBarFill.setFillStyle(0x00ff00, 0.8);
        }

        // 電網頻率
        const frequency = this.balanceSystem.frequency.toFixed(2);
        const freqStatus = this.balanceSystem.getFrequencyStatus();
        this.texts.frequency.value.setText(`${frequency} Hz (${freqStatus.status})`);
        this.texts.frequency.value.setColor('#' + freqStatus.color.toString(16).padStart(6, '0'));

        // 天氣資訊
        const sunIntensity = Math.round(this.weatherSystem.sunIntensity);
        const windSpeed = Math.round(this.weatherSystem.windSpeed);
        const weatherDesc = this.weatherSystem.getWeatherDescription();
        const weatherIcon = this.weatherSystem.getWeatherIcon();
        this.texts.weather.value.setText(
            `${weatherIcon.sun} ${weatherDesc.sun} ${sunIntensity}%\n${weatherIcon.wind} ${weatherDesc.wind} ${windSpeed}%`
        );

        // 成本資訊
        if (this.costSystem) {
            const costRate = this.costSystem.getCurrentCostRate();
            const totalCost = this.costSystem.getTotalCost();

            this.texts.costRate.value.setText(`${costRate.toFixed(1)} 元/秒`);
            this.texts.totalCost.value.setText(`${Math.round(totalCost).toLocaleString()} 元`);
        }
    }

    /**
     * 更新關卡時間
     */
    updateTimer(seconds) {
        if (seconds >= 0) {
            this.texts.timer.value.setText(`${seconds} 秒`);
        } else {
            this.texts.timer.value.setText('--');
        }
    }

    /**
     * 更新（每幀調用）
     */
    update() {
        this.updateDisplay();
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
     * 顯示/隱藏
     */
    setVisible(visible) {
        if (this.container) {
            this.container.setVisible(visible);
        }
    }

    /**
     * 銷毀
     */
    destroy() {
        if (this.container) {
            this.container.destroy();
            this.container = null;
        }

        this.texts = null;
        this.scene = null;
    }
}

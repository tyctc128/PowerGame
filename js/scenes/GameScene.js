/**
 * 遊戲主場景 (Game Scene)
 * 核心遊戲邏輯
 */

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });

        // 系統
        this.energySystem = null;
        this.weatherSystem = null;
        this.demandSystem = null;
        this.balanceSystem = null;
        this.eventSystem = null;
        this.costSystem = null;

        // UI 組件
        this.energyDials = {};
        this.dashboard = null;
        this.eventMarquee = null;

        // 關卡資料
        this.levelData = null;

        // 遊戲狀態
        this.isPlaying = false;
        this.hasWon = false;
    }

    init(data) {
        this.levelData = data.levelData;
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // 背景
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x0a0e27, 0x0a0e27, 0x1a1e3e, 0x1a1e3e, 1);
        bg.fillRect(0, 0, width, height);

        // 初始化系統
        this.initSystems();

        // 創建 UI
        this.createUI();

        // 載入關卡
        this.loadLevel();

        // 開始遊戲
        this.startGame();

        // 暫停按鈕
        this.createPauseButton(width - 60, 50);
    }

    /**
     * 初始化系統
     */
    initSystems() {
        this.energySystem = new EnergySystem(this);
        this.weatherSystem = new WeatherSystem(this, this.energySystem);
        this.demandSystem = new DemandSystem(this, this.energySystem);
        this.balanceSystem = new BalanceSystem(this, this.energySystem, this.demandSystem);
        this.costSystem = new CostSystem(this, this.energySystem);
        this.eventSystem = new EventSystem(
            this,
            this.energySystem,
            this.weatherSystem,
            this.demandSystem
        );
    }

    /**
     * 創建 UI
     */
    createUI() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // 標題
        this.add.text(width / 2, 30, this.levelData.name, {
            fontSize: '28px',
            fontFamily: 'Microsoft JhengHei, Arial',
            color: '#00d9ff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // 六個能源轉盤（3x2 網格，中央區域）
        const dialStartX = 180;
        const dialStartY = 180;
        const dialSpacingX = 200;
        const dialSpacingY = 200;

        ENERGY_TYPES.forEach((type, index) => {
            const col = index % 3;
            const row = Math.floor(index / 3);
            const x = dialStartX + col * dialSpacingX;
            const y = dialStartY + row * dialSpacingY;

            this.energyDials[type] = new EnergyDial(
                this,
                x, y,
                type,
                this.energySystem
            );
        });

        // 儀表板（右側）
        this.dashboard = new Dashboard(
            this,
            width - 320, 80,
            this.energySystem,
            this.demandSystem,
            this.balanceSystem,
            this.weatherSystem,
            this.costSystem
        );

        // 事件跑馬燈（上方）
        this.eventMarquee = new EventMarquee(
            this,
            width / 2, 80,
            width - 400
        );

        // 設定事件回調
        this.eventSystem.setEventCallback((event) => {
            this.eventMarquee.showEvent(event);
        });
    }

    /**
     * 載入關卡
     */
    loadLevel() {
        const ic = this.levelData.initialConditions;

        // 設定初始需求
        this.demandSystem.setBaseDemand(ic.baseDemand);

        // 設定初始天氣
        this.weatherSystem.setInitialWeather(
            ic.weather.sunIntensity,
            ic.weather.windSpeed
        );

        // 設定能源限制
        this.energySystem.setLimits(ic.energyLimits);

        // 設定過關條件
        this.balanceSystem.setWinConditions(
            this.levelData.winConditions.balanceTolerance,
            this.levelData.winConditions.balanceDuration
        );

        // 載入事件
        this.eventSystem.loadEvents(this.levelData.events);

        // 需求響應提升（關卡5專用）
        if (ic.demandResponseBoost) {
            const demandEnergy = this.energySystem.energies.demand;
            demandEnergy.max = ENERGY_DATA.demand.max * ic.demandResponseBoost;
        }
    }

    /**
     * 開始遊戲
     */
    startGame() {
        this.isPlaying = true;
        this.hasWon = false;

        // 顯示開始訊息
        this.eventMarquee.showMessage(
            '🎮 遊戲開始！調整能源轉盤以平衡供需',
            '🎮',
            '#00ff00'
        );
    }

    /**
     * 更新（每幀調用）
     */
    update(time, delta) {
        if (!this.isPlaying) return;

        // 更新系統
        this.energySystem.update(delta);
        this.weatherSystem.update(delta);
        this.demandSystem.update(delta);
        this.balanceSystem.update(delta);
        this.costSystem.update(delta);
        this.eventSystem.update(delta);

        // 更新 UI
        Object.values(this.energyDials).forEach(dial => dial.update());
        this.dashboard.update();

        // 檢查過關條件
        if (!this.hasWon && this.balanceSystem.checkWinCondition()) {
            this.onWin();
        }
    }

    /**
     * 過關
     */
    onWin() {
        this.hasWon = true;
        this.isPlaying = false;

        // 顯示過關訊息
        this.eventMarquee.showMessage(
            '🎉 恭喜過關！供需平衡達成',
            '🎉',
            '#00ff00'
        );

        // 延遲後進入結算畫面
        this.time.delayedCall(2000, () => {
            this.scene.start('ResultScene', {
                levelData: this.levelData,
                statistics: this.balanceSystem.getStatistics(),
                costStatistics: this.costSystem.getStatistics()
            });
        });
    }

    /**
     * 創建暫停按鈕
     */
    createPauseButton(x, y) {
        const button = this.add.container(x, y);

        const bg = this.add.circle(0, 0, 30, 0x1a1e3e, 0.8);
        const border = this.add.circle(0, 0, 30, 0x000000, 0)
            .setStrokeStyle(2, 0x00d9ff, 0.6);

        const pauseIcon = this.add.text(0, 0, '⏸', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#00d9ff'
        }).setOrigin(0.5);

        button.add([bg, border, pauseIcon]);

        bg.setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.showPauseMenu();
            });

        return button;
    }

    /**
     * 顯示暫停選單
     */
    showPauseMenu() {
        this.isPlaying = false;

        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // 遮罩
        const overlay = this.add.rectangle(
            width / 2, height / 2,
            width, height,
            0x000000, 0.7
        ).setInteractive().setDepth(1000);

        // 選單面板
        const panel = this.add.container(width / 2, height / 2).setDepth(1001);

        const bg = this.add.rectangle(0, 0, 400, 300, 0x1a1e3e, 0.95);
        const border = this.add.rectangle(0, 0, 400, 300, 0x000000, 0)
            .setStrokeStyle(3, 0x00d9ff, 0.8);

        const title = this.add.text(0, -100, '⏸ 遊戲暫停', {
            fontSize: '32px',
            fontFamily: 'Microsoft JhengHei, Arial',
            color: '#00d9ff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        panel.add([bg, border, title]);

        // 繼續按鈕
        const resumeBtn = this.createMenuButton(0, -20, '繼續遊戲', () => {
            panel.destroy();
            overlay.destroy();
            this.isPlaying = true;
        });

        // 重新開始按鈕
        const restartBtn = this.createMenuButton(0, 40, '重新開始', () => {
            this.scene.restart({ levelData: this.levelData });
        });

        // 返回選單按鈕
        const menuBtn = this.createMenuButton(0, 100, '返回選單', () => {
            this.scene.start('MenuScene');
        });

        panel.add([resumeBtn, restartBtn, menuBtn]);
    }

    /**
     * 創建選單按鈕
     */
    createMenuButton(x, y, text, callback) {
        const button = this.add.container(x, y);

        const bg = this.add.rectangle(0, 0, 250, 45, 0x00d9ff, 0.1);
        const border = this.add.rectangle(0, 0, 250, 45, 0x000000, 0)
            .setStrokeStyle(2, 0x00d9ff, 0.6);

        const label = this.add.text(0, 0, text, {
            fontSize: '20px',
            fontFamily: 'Microsoft JhengHei, Arial',
            color: '#00d9ff'
        }).setOrigin(0.5);

        button.add([bg, border, label]);

        bg.setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                bg.setFillStyle(0x00d9ff, 0.3);
                label.setColor('#ffffff');
            })
            .on('pointerout', () => {
                bg.setFillStyle(0x00d9ff, 0.1);
                label.setColor('#00d9ff');
            })
            .on('pointerdown', callback);

        return button;
    }

    /**
     * 清理場景
     */
    shutdown() {
        // 銷毀系統
        if (this.energySystem) this.energySystem.destroy();
        if (this.weatherSystem) this.weatherSystem.destroy();
        if (this.demandSystem) this.demandSystem.destroy();
        if (this.balanceSystem) this.balanceSystem.destroy();
        if (this.costSystem) this.costSystem.destroy();
        if (this.eventSystem) this.eventSystem.destroy();

        // 銷毀 UI
        Object.values(this.energyDials).forEach(dial => dial.destroy());
        if (this.dashboard) this.dashboard.destroy();
        if (this.eventMarquee) this.eventMarquee.destroy();
    }
}

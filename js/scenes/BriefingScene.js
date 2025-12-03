/**
 * 關卡簡報場景 (Briefing Scene)
 * 顯示關卡資訊和說明
 */

class BriefingScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BriefingScene' });
        this.levelData = null;
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

        // 返回按鈕
        this.createBackButton(50, 50);

        // 主面板
        const panel = this.add.container(width / 2, height / 2);

        const panelBg = this.add.rectangle(0, 0, 700, 500, 0x1a1e3e, 0.95);
        const panelBorder = this.add.rectangle(0, 0, 700, 500, 0x000000, 0)
            .setStrokeStyle(3, DIFFICULTY_CONFIG[this.levelData.difficulty].color, 0.8);

        panel.add([panelBg, panelBorder]);

        // 關卡圖示和編號
        const icon = this.add.text(0, -200, this.levelData.icon, {
            fontSize: '64px'
        }).setOrigin(0.5);
        panel.add(icon);

        const levelNumber = this.add.text(0, -130,
            `關卡 ${this.levelData.id}`, {
            fontSize: '24px',
            fontFamily: 'Microsoft JhengHei, Arial',
            color: '#00d9ff'
        }).setOrigin(0.5);
        panel.add(levelNumber);

        // 關卡名稱
        const title = this.add.text(0, -90,
            this.levelData.name, {
            fontSize: '36px',
            fontFamily: 'Microsoft JhengHei, Arial',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        panel.add(title);

        // 難度標籤
        const difficulty = this.add.text(0, -45,
            `難度：${DIFFICULTY_CONFIG[this.levelData.difficulty].label}`, {
            fontSize: '18px',
            fontFamily: 'Microsoft JhengHei, Arial',
            color: '#' + DIFFICULTY_CONFIG[this.levelData.difficulty].color.toString(16).padStart(6, '0')
        }).setOrigin(0.5);
        panel.add(difficulty);

        // 情境描述
        const description = this.add.text(0, 20,
            this.levelData.description, {
            fontSize: '20px',
            fontFamily: 'Microsoft JhengHei, Arial',
            color: '#ffffff',
            align: 'center',
            wordWrap: { width: 600 },
            lineSpacing: 8
        }).setOrigin(0.5);
        panel.add(description);

        // 初始條件
        let conditionsText = '初始條件：\n';
        const ic = this.levelData.initialConditions;

        if (ic.baseDemand) {
            conditionsText += `• 用電需求：${ic.baseDemand} MW\n`;
        }

        if (ic.weather) {
            conditionsText += `• 天氣：日照 ${ic.weather.sunIntensity}%、風速 ${ic.weather.windSpeed}%\n`;
        }

        if (ic.energyLimits && Object.keys(ic.energyLimits).length > 0) {
            Object.keys(ic.energyLimits).forEach(key => {
                const energyName = ENERGY_DATA[key].name;
                const limit = Math.round(ic.energyLimits[key] * 100);
                conditionsText += `• ${energyName}上限：${limit}%\n`;
            });
        }

        const conditions = this.add.text(-300, 90,
            conditionsText, {
            fontSize: '16px',
            fontFamily: 'Microsoft JhengHei, Arial',
            color: '#aaaaaa',
            lineSpacing: 6
        }).setOrigin(0);
        panel.add(conditions);

        // 過關條件
        const wc = this.levelData.winConditions;
        const winText = `過關條件：\n` +
            `• 供需差維持在 ±${wc.balanceTolerance} MW\n` +
            `• 持續時間達到 ${wc.balanceDuration} 秒`;

        const winConditions = this.add.text(300, 90,
            winText, {
            fontSize: '16px',
            fontFamily: 'Microsoft JhengHei, Arial',
            color: '#aaaaaa',
            align: 'right',
            lineSpacing: 6
        }).setOrigin(1, 0);
        panel.add(winConditions);

        // 開始挑戰按鈕
        const startButton = this.createStartButton(0, 200);
        panel.add(startButton);

        // 入場動畫
        panel.setScale(0.8);
        panel.setAlpha(0);
        this.tweens.add({
            targets: panel,
            scale: 1,
            alpha: 1,
            duration: 500,
            ease: 'Back.easeOut'
        });
    }

    /**
     * 創建開始按鈕
     */
    createStartButton(x, y) {
        const button = this.add.container(x, y);

        const bg = this.add.rectangle(0, 0, 200, 50, 0x00d9ff, 0.2);
        const border = this.add.rectangle(0, 0, 200, 50, 0x000000, 0)
            .setStrokeStyle(3, 0x00d9ff, 0.8);

        const label = this.add.text(0, 0, '開始挑戰', {
            fontSize: '24px',
            fontFamily: 'Microsoft JhengHei, Arial',
            color: '#00d9ff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        button.add([bg, border, label]);

        bg.setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                this.tweens.add({
                    targets: button,
                    scale: 1.1,
                    duration: 150
                });
                bg.setFillStyle(0x00d9ff, 0.4);
                label.setColor('#ffffff');
            })
            .on('pointerout', () => {
                this.tweens.add({
                    targets: button,
                    scale: 1,
                    duration: 150
                });
                bg.setFillStyle(0x00d9ff, 0.2);
                label.setColor('#00d9ff');
            })
            .on('pointerdown', () => {
                this.tweens.add({
                    targets: button,
                    scale: 0.95,
                    duration: 100,
                    yoyo: true,
                    onComplete: () => {
                        // 進入遊戲場景
                        this.scene.start('GameScene', { levelData: this.levelData });
                    }
                });
            });

        return button;
    }

    /**
     * 創建返回按鈕
     */
    createBackButton(x, y) {
        const button = this.add.container(x, y);

        const bg = this.add.circle(0, 0, 30, 0x1a1e3e, 0.8);
        const border = this.add.circle(0, 0, 30, 0x000000, 0)
            .setStrokeStyle(2, 0x00d9ff, 0.6);

        const arrow = this.add.text(0, 0, '←', {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#00d9ff'
        }).setOrigin(0.5);

        button.add([bg, border, arrow]);

        bg.setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.scene.start('LevelSelectScene');
            });

        return button;
    }
}

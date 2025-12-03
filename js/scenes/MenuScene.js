/**
 * 主選單場景 (Menu Scene)
 * 遊戲主選單
 */

class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // 背景漸層
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x0a0e27, 0x0a0e27, 0x1a1e3e, 0x1a1e3e, 1);
        bg.fillRect(0, 0, width, height);

        // 標題
        const title = this.add.text(
            width / 2, 150,
            '智慧電網調度員',
            {
                fontSize: '56px',
                fontFamily: 'Microsoft JhengHei, Arial',
                color: '#00d9ff',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5);

        // 標題發光效果
        title.setShadow(0, 0, '#00d9ff', 15, false, true);

        // 標題動畫
        this.tweens.add({
            targets: title,
            y: 145,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // 副標題
        this.add.text(
            width / 2, 220,
            '⚡ 電力供需平衡模擬遊戲 ⚡',
            {
                fontSize: '20px',
                fontFamily: 'Microsoft JhengHei, Arial',
                color: '#ffffff'
            }
        ).setOrigin(0.5);

        // 選單按鈕
        const buttonY = 320;
        const buttonSpacing = 70;

        this.createButton(width / 2, buttonY, '開始遊戲', () => {
            this.scene.start('LevelSelectScene');
        });

        this.createButton(width / 2, buttonY + buttonSpacing, '選擇關卡', () => {
            this.scene.start('LevelSelectScene');
        });

        this.createButton(width / 2, buttonY + buttonSpacing * 2, '教學模式', () => {
            this.showTutorial();
        });

        this.createButton(width / 2, buttonY + buttonSpacing * 3, '關於智慧電網', () => {
            this.showAbout();
        });

        // 底部資訊
        this.add.text(
            width / 2, height - 30,
            '© 2025 智慧電網調度員 | 純Web版本',
            {
                fontSize: '14px',
                fontFamily: 'Arial',
                color: '#666666'
            }
        ).setOrigin(0.5);
    }

    /**
     * 創建選單按鈕
     */
    createButton(x, y, text, callback) {
        const button = this.add.container(x, y);

        // 按鈕背景
        const bg = this.add.rectangle(0, 0, 300, 50, 0x1a1e3e, 0.8);
        const border = this.add.rectangle(0, 0, 300, 50, 0x000000, 0)
            .setStrokeStyle(2, 0x00d9ff, 0.6);

        // 按鈕文字
        const label = this.add.text(0, 0, text, {
            fontSize: '22px',
            fontFamily: 'Microsoft JhengHei, Arial',
            color: '#00d9ff'
        }).setOrigin(0.5);

        button.add([bg, border, label]);

        // 互動
        bg.setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                this.tweens.add({
                    targets: button,
                    scale: 1.05,
                    duration: 150
                });
                border.setStrokeStyle(3, 0x00d9ff, 1);
                label.setColor('#ffffff');
            })
            .on('pointerout', () => {
                this.tweens.add({
                    targets: button,
                    scale: 1,
                    duration: 150
                });
                border.setStrokeStyle(2, 0x00d9ff, 0.6);
                label.setColor('#00d9ff');
            })
            .on('pointerdown', () => {
                this.tweens.add({
                    targets: button,
                    scale: 0.95,
                    duration: 100,
                    yoyo: true,
                    onComplete: callback
                });
            });

        return button;
    }

    /**
     * 顯示教學
     */
    showTutorial() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // 遮罩
        const overlay = this.add.rectangle(
            width / 2, height / 2,
            width, height,
            0x000000, 0.85
        ).setInteractive();

        // 教學面板
        const panel = this.add.container(width / 2, height / 2);

        const bg = this.add.rectangle(0, 0, 700, 500, 0x1a1e3e, 0.95);
        const border = this.add.rectangle(0, 0, 700, 500, 0x000000, 0)
            .setStrokeStyle(3, 0x00d9ff, 0.8);

        const title = this.add.text(0, -200, '🎮 遊戲教學', {
            fontSize: '32px',
            fontFamily: 'Microsoft JhengHei, Arial',
            color: '#00d9ff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const content = this.add.text(0, -50,
            '✦ 遊戲目標：\n' +
            '   使供需差保持在 ±100 MW 內，持續 5 秒即可過關\n\n' +
            '✦ 如何操作：\n' +
            '   • 旋轉可控能源轉盤（水力、燃煤、燃氣）調整發電量\n' +
            '   • 旋轉用戶節電轉盤來降低需求\n' +
            '   • 風力和太陽能受天氣影響，無法直接控制\n\n' +
            '✦ 注意事項：\n' +
            '   • 注意天氣變化導致的再生能源波動\n' +
            '   • 關注事件提示，及時調整策略\n' +
            '   • 某些關卡有特殊限制（如燃氣滿載）',
            {
                fontSize: '16px',
                fontFamily: 'Microsoft JhengHei, Arial',
                color: '#ffffff',
                lineSpacing: 8
            }
        ).setOrigin(0.5);

        const closeButton = this.add.text(0, 200, '[ 關閉 ]', {
            fontSize: '20px',
            fontFamily: 'Microsoft JhengHei, Arial',
            color: '#00d9ff'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                panel.destroy();
                overlay.destroy();
            });

        panel.add([bg, border, title, content, closeButton]);
    }

    /**
     * 顯示關於
     */
    showAbout() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // 遮罩
        const overlay = this.add.rectangle(
            width / 2, height / 2,
            width, height,
            0x000000, 0.85
        ).setInteractive();

        // 關於面板
        const panel = this.add.container(width / 2, height / 2);

        const bg = this.add.rectangle(0, 0, 700, 400, 0x1a1e3e, 0.95);
        const border = this.add.rectangle(0, 0, 700, 400, 0x000000, 0)
            .setStrokeStyle(3, 0x00d9ff, 0.8);

        const title = this.add.text(0, -150, '⚡ 關於智慧電網', {
            fontSize: '32px',
            fontFamily: 'Microsoft JhengHei, Arial',
            color: '#00d9ff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const content = this.add.text(0, -20,
            '智慧電網是現代電力系統的核心，需要即時平衡\n' +
            '電力供應與需求。本遊戲模擬真實的電網調度情境，\n' +
            '讓玩家體驗：\n\n' +
            '• 傳統能源（水力、燃煤、燃氣）的可控性\n' +
            '• 再生能源（太陽能、風力）的不穩定性\n' +
            '• 需求側管理（用戶節電）的重要性\n' +
            '• 極端天氣和突發事故的應對策略\n\n' +
            '透過遊戲，了解電網調度的挑戰與智慧電網的價值。',
            {
                fontSize: '16px',
                fontFamily: 'Microsoft JhengHei, Arial',
                color: '#ffffff',
                align: 'center',
                lineSpacing: 8
            }
        ).setOrigin(0.5);

        const closeButton = this.add.text(0, 150, '[ 關閉 ]', {
            fontSize: '20px',
            fontFamily: 'Microsoft JhengHei, Arial',
            color: '#00d9ff'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                panel.destroy();
                overlay.destroy();
            });

        panel.add([bg, border, title, content, closeButton]);
    }
}

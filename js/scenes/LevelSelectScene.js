/**
 * 關卡選擇場景 (Level Select Scene)
 * 選擇挑戰關卡
 */

class LevelSelectScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LevelSelectScene' });
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // 背景
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x0a0e27, 0x0a0e27, 0x1a1e3e, 0x1a1e3e, 1);
        bg.fillRect(0, 0, width, height);

        // 標題
        this.add.text(
            width / 2, 80,
            '選擇關卡',
            {
                fontSize: '42px',
                fontFamily: 'Microsoft JhengHei, Arial',
                color: '#00d9ff',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5);

        // 返回按鈕
        this.createBackButton(50, 50);

        // 創建關卡按鈕（2x3 網格）
        const startX = width / 2 - 200;
        const startY = 180;
        const spacingX = 200;
        const spacingY = 180;

        LEVEL_ORDER.forEach((levelKey, index) => {
            const levelData = LEVEL_DATA[levelKey];
            const col = index % 3;
            const row = Math.floor(index / 3);
            const x = startX + col * spacingX;
            const y = startY + row * spacingY;

            this.createLevelButton(x, y, levelData);
        });
    }

    /**
     * 創建關卡按鈕
     */
    createLevelButton(x, y, levelData) {
        const button = this.add.container(x, y);

        // 按鈕背景
        const bg = this.add.rectangle(0, 0, 180, 150, 0x1a1e3e, 0.9);
        const border = this.add.rectangle(0, 0, 180, 150, 0x000000, 0)
            .setStrokeStyle(2, DIFFICULTY_CONFIG[levelData.difficulty].color, 0.7);

        // 關卡編號
        const levelNumber = this.add.text(-70, -55, `關卡 ${levelData.id}`, {
            fontSize: '16px',
            fontFamily: 'Microsoft JhengHei, Arial',
            color: '#00d9ff'
        }).setOrigin(0);

        // 難度標籤
        const difficultyBadge = this.add.rectangle(
            70, -55,
            60, 22,
            DIFFICULTY_CONFIG[levelData.difficulty].color, 0.3
        ).setOrigin(1, 0);

        const difficultyText = this.add.text(70, -55,
            DIFFICULTY_CONFIG[levelData.difficulty].label, {
            fontSize: '12px',
            fontFamily: 'Microsoft JhengHei, Arial',
            color: '#ffffff'
        }).setOrigin(1, 0);

        // 關卡圖示
        const icon = this.add.text(0, -10, levelData.icon, {
            fontSize: '48px'
        }).setOrigin(0.5);

        // 關卡名稱
        const name = this.add.text(0, 40, levelData.name, {
            fontSize: '18px',
            fontFamily: 'Microsoft JhengHei, Arial',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);

        button.add([bg, border, levelNumber, difficultyBadge, difficultyText, icon, name]);

        // 互動
        bg.setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                this.tweens.add({
                    targets: button,
                    scale: 1.05,
                    duration: 150
                });
                border.setStrokeStyle(3, DIFFICULTY_CONFIG[levelData.difficulty].color, 1);
            })
            .on('pointerout', () => {
                this.tweens.add({
                    targets: button,
                    scale: 1,
                    duration: 150
                });
                border.setStrokeStyle(2, DIFFICULTY_CONFIG[levelData.difficulty].color, 0.7);
            })
            .on('pointerdown', () => {
                this.tweens.add({
                    targets: button,
                    scale: 0.95,
                    duration: 100,
                    yoyo: true,
                    onComplete: () => {
                        // 進入關卡簡報場景
                        this.scene.start('BriefingScene', { levelData: levelData });
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
            .on('pointerover', () => {
                this.tweens.add({
                    targets: button,
                    scale: 1.1,
                    duration: 150
                });
                border.setStrokeStyle(3, 0x00d9ff, 1);
            })
            .on('pointerout', () => {
                this.tweens.add({
                    targets: button,
                    scale: 1,
                    duration: 150
                });
                border.setStrokeStyle(2, 0x00d9ff, 0.6);
            })
            .on('pointerdown', () => {
                this.scene.start('MenuScene');
            });

        return button;
    }
}

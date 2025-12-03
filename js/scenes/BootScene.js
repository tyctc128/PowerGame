/**
 * 啟動場景 (Boot Scene)
 * 載入資源和初始化
 */

class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // 創建載入畫面
        this.createLoadingScreen();

        // 這裡可以載入圖片、音效等資源
        // 目前使用程式繪製的圖形，所以不需要載入外部資源
    }

    create() {
        // 完成載入，延遲後進入主選單
        this.time.delayedCall(1000, () => {
            this.scene.start('MenuScene');
        });
    }

    /**
     * 創建載入畫面
     */
    createLoadingScreen() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // 背景
        this.add.rectangle(
            width / 2, height / 2,
            width, height,
            0x0a0e27
        );

        // 標題
        const title = this.add.text(
            width / 2, height / 2 - 50,
            '智慧電網調度員',
            {
                fontSize: '48px',
                fontFamily: 'Microsoft JhengHei, Arial',
                color: '#00d9ff',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5);

        // 標題發光效果
        title.setShadow(0, 0, '#00d9ff', 10, false, true);

        // 副標題
        this.add.text(
            width / 2, height / 2 + 20,
            'Smart Grid Dispatcher',
            {
                fontSize: '24px',
                fontFamily: 'Arial',
                color: '#ffffff'
            }
        ).setOrigin(0.5);

        // 載入文字
        const loadingText = this.add.text(
            width / 2, height / 2 + 100,
            '載入中...',
            {
                fontSize: '20px',
                fontFamily: 'Microsoft JhengHei, Arial',
                color: '#00d9ff'
            }
        ).setOrigin(0.5);

        // 載入動畫
        this.tweens.add({
            targets: loadingText,
            alpha: 0.3,
            duration: 800,
            yoyo: true,
            repeat: -1
        });
    }
}

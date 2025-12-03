/**
 * 事件跑馬燈 (Event Marquee)
 * 顯示遊戲事件提示訊息
 */

class EventMarquee {
    constructor(scene, x, y, width) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.width = width;

        // 容器
        this.container = null;

        // 訊息佇列
        this.messageQueue = [];
        this.currentMessage = null;

        // 顯示參數
        this.displayDuration = 5000;  // 訊息顯示時間（毫秒）
        this.fadeDuration = 500;  // 淡入淡出時間

        this.create();
    }

    /**
     * 創建跑馬燈
     */
    create() {
        this.container = this.scene.add.container(this.x, this.y);

        // 背景面板
        this.background = this.scene.add.rectangle(
            0, 0,
            this.width, 60,
            0x0a0e27, 0.9
        ).setOrigin(0.5);

        // 邊框（霓虹藍）
        this.border = this.scene.add.rectangle(
            0, 0,
            this.width, 60,
            0x000000, 0
        ).setStrokeStyle(2, 0x00d9ff, 0.7).setOrigin(0.5);

        // 圖示
        this.icon = this.scene.add.text(
            -this.width / 2 + 30, 0,
            '📢',
            {
                fontSize: '28px'
            }
        ).setOrigin(0.5).setVisible(false);

        // 訊息文字
        this.messageText = this.scene.add.text(
            0, 0,
            '',
            {
                fontSize: '18px',
                fontFamily: 'Microsoft JhengHei, Arial',
                color: '#ffffff',
                align: 'center',
                wordWrap: { width: this.width - 100 }
            }
        ).setOrigin(0.5).setVisible(false);

        this.container.add([this.background, this.border, this.icon, this.messageText]);

        // 初始隱藏
        this.container.setAlpha(0);
    }

    /**
     * 顯示訊息
     */
    showMessage(message, icon = '📢', color = '#ffffff') {
        // 如果正在顯示訊息，加入佇列
        if (this.currentMessage) {
            this.messageQueue.push({ message, icon, color });
            return;
        }

        this.currentMessage = { message, icon, color };

        // 更新內容
        this.icon.setText(icon);
        this.icon.setVisible(true);
        this.messageText.setText(message);
        this.messageText.setColor(color);
        this.messageText.setVisible(true);

        // 根據訊息類型改變邊框顏色
        let borderColor = 0x00d9ff;  // 預設藍色
        if (message.includes('⚠️') || message.includes('🚨')) {
            borderColor = 0xff0000;  // 紅色：警告
        } else if (message.includes('✅')) {
            borderColor = 0x00ff00;  // 綠色：成功
        }
        this.border.setStrokeStyle(2, borderColor, 0.9);

        // 淡入動畫
        this.scene.tweens.add({
            targets: this.container,
            alpha: 1,
            duration: this.fadeDuration,
            ease: 'Power2',
            onComplete: () => {
                // 顯示一段時間後淡出
                this.scene.time.delayedCall(this.displayDuration, () => {
                    this.hideMessage();
                });
            }
        });

        // 彈跳動畫
        this.container.setScale(0.9);
        this.scene.tweens.add({
            targets: this.container,
            scaleX: 1,
            scaleY: 1,
            duration: this.fadeDuration,
            ease: 'Back.easeOut'
        });
    }

    /**
     * 隱藏訊息
     */
    hideMessage() {
        // 淡出動畫
        this.scene.tweens.add({
            targets: this.container,
            alpha: 0,
            duration: this.fadeDuration,
            ease: 'Power2',
            onComplete: () => {
                this.currentMessage = null;
                this.icon.setVisible(false);
                this.messageText.setVisible(false);

                // 顯示佇列中的下一個訊息
                if (this.messageQueue.length > 0) {
                    const next = this.messageQueue.shift();
                    this.showMessage(next.message, next.icon, next.color);
                }
            }
        });
    }

    /**
     * 顯示事件訊息（根據事件類型自動選擇圖示和顏色）
     */
    showEvent(event) {
        let icon = '📢';
        let color = '#ffffff';

        // 根據事件類型選擇圖示
        if (event.type === 'weather') {
            if (event.target === 'solar') {
                icon = '☀️';
                color = '#ffd700';
            } else if (event.target === 'wind') {
                icon = '🍃';
                color = '#98fb98';
            }
        } else if (event.type === 'demand_change') {
            icon = '⚡';
            color = '#ffaa00';
        } else if (event.type === 'energy_failure') {
            icon = '🚨';
            color = '#ff0000';
        } else if (event.type === 'energy_recovery') {
            icon = '✅';
            color = '#00ff00';
        } else if (event.type === 'demand_response_boost') {
            icon = '💡';
            color = '#9370db';
        }

        this.showMessage(event.message, icon, color);
    }

    /**
     * 清空訊息佇列
     */
    clearQueue() {
        this.messageQueue = [];
    }

    /**
     * 立即隱藏當前訊息
     */
    hideImmediately() {
        this.scene.tweens.killTweensOf(this.container);
        this.container.setAlpha(0);
        this.currentMessage = null;
        this.icon.setVisible(false);
        this.messageText.setVisible(false);
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
     * 設定寬度
     */
    setWidth(width) {
        this.width = width;
        if (this.background) {
            this.background.setSize(width, 60);
            this.border.setSize(width, 60);
            this.messageText.setWordWrapWidth(width - 100);
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
            this.scene.tweens.killTweensOf(this.container);
            this.container.destroy();
            this.container = null;
        }

        this.messageQueue = null;
        this.currentMessage = null;
        this.scene = null;
    }
}

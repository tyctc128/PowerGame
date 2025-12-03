/**
 * 結算場景 (Result Scene)
 * 顯示遊戲結果和統計
 */

class ResultScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ResultScene' });
        this.levelData = null;
        this.statistics = null;
        this.costStatistics = null;
    }

    init(data) {
        this.levelData = data.levelData;
        this.statistics = data.statistics;
        this.costStatistics = data.costStatistics;
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // 背景
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x0a0e27, 0x0a0e27, 0x1a1e3e, 0x1a1e3e, 1);
        bg.fillRect(0, 0, width, height);

        // 煙火效果（過關慶祝）
        this.createFireworks();

        // 主面板
        const panel = this.add.container(width / 2, height / 2);

        const panelBg = this.add.rectangle(0, 0, 700, 650, 0x1a1e3e, 0.95);
        const panelBorder = this.add.rectangle(0, 0, 700, 650, 0x000000, 0)
            .setStrokeStyle(3, 0x00ff00, 0.8);

        panel.add([panelBg, panelBorder]);

        // 過關標題
        const title = this.add.text(0, -230, '🎉 過關成功！', {
            fontSize: '48px',
            fontFamily: 'Microsoft JhengHei, Arial',
            color: '#00ff00',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        panel.add(title);

        // 關卡名稱
        const levelName = this.add.text(0, -170,
            `${this.levelData.icon} ${this.levelData.name}`, {
            fontSize: '24px',
            fontFamily: 'Microsoft JhengHei, Arial',
            color: '#00d9ff'
        }).setOrigin(0.5);
        panel.add(levelName);

        // 評級
        const grade = this.statistics.finalGrade;
        const gradeColor = this.getGradeColor(grade);
        const gradeText = this.add.text(0, -110,
            `電網穩定度：${grade}`, {
            fontSize: '36px',
            fontFamily: 'Arial',
            color: '#' + gradeColor.toString(16).padStart(6, '0'),
            fontStyle: 'bold'
        }).setOrigin(0.5);
        panel.add(gradeText);

        // 統計資料
        let yOffset = -40;
        const lineHeight = 40;

        // 最大供需差
        this.createStatRow(
            panel,
            '最大供需差',
            `${this.statistics.maxImbalance} MW`,
            yOffset,
            this.statistics.maxImbalance <= 100 ? 0x00ff00 : 0xff6600
        );
        yOffset += lineHeight;

        // 平衡維持時間
        this.createStatRow(
            panel,
            '平衡維持時間',
            `${this.statistics.totalBalancedTime} 秒`,
            yOffset,
            0x00d9ff
        );
        yOffset += lineHeight;

        // 總遊戲時間
        this.createStatRow(
            panel,
            '總遊戲時間',
            `${this.statistics.totalTime} 秒`,
            yOffset,
            0xaaaaaa
        );
        yOffset += lineHeight;

        // 平衡率
        this.createStatRow(
            panel,
            '平衡達成率',
            `${this.statistics.balanceRate}%`,
            yOffset,
            this.statistics.balanceRate >= 70 ? 0x00ff00 : 0xffaa00
        );
        yOffset += lineHeight;

        // 成本統計（如果有）
        if (this.costStatistics) {
            // 總成本
            this.createStatRow(
                panel,
                '總發電成本',
                `${this.costStatistics.totalCost.toLocaleString()} 元`,
                yOffset,
                0xffd700
            );
            yOffset += lineHeight;

            // 平均成本
            this.createStatRow(
                panel,
                '平均成本',
                `${this.costStatistics.averageCost} 元/度`,
                yOffset,
                0xffaa00
            );
            yOffset += lineHeight;

            // 成本評級
            const costGrade = this.costStatistics.costGrade;
            const costGradeColor = this.getGradeColor(costGrade);
            this.createStatRow(
                panel,
                '成本效率',
                costGrade,
                yOffset,
                costGradeColor
            );
            yOffset += lineHeight;
        }

        // 評價訊息
        const comment = this.getComment(grade, this.statistics.balanceRate, this.costStatistics?.costGrade);
        const commentText = this.add.text(0, 150,
            comment, {
            fontSize: '18px',
            fontFamily: 'Microsoft JhengHei, Arial',
            color: '#ffffff',
            align: 'center',
            wordWrap: { width: 600 }
        }).setOrigin(0.5);
        panel.add(commentText);

        // 按鈕
        const restartBtn = this.createButton(-120, 220, '再試一次', () => {
            this.scene.start('GameScene', { levelData: this.levelData });
        });

        const nextBtn = this.createButton(120, 220, '下一關', () => {
            const currentIndex = LEVEL_ORDER.indexOf('level' + this.levelData.id);
            if (currentIndex < LEVEL_ORDER.length - 1) {
                const nextLevelKey = LEVEL_ORDER[currentIndex + 1];
                const nextLevelData = LEVEL_DATA[nextLevelKey];
                this.scene.start('BriefingScene', { levelData: nextLevelData });
            } else {
                // 全部通關
                this.showAllClear();
            }
        });

        panel.add([restartBtn, nextBtn]);

        // 入場動畫
        panel.setScale(0.8);
        panel.setAlpha(0);
        this.tweens.add({
            targets: panel,
            scale: 1,
            alpha: 1,
            duration: 600,
            ease: 'Back.easeOut'
        });
    }

    /**
     * 創建統計行
     */
    createStatRow(parent, label, value, y, color) {
        const labelText = this.add.text(-280, y, label + ':', {
            fontSize: '18px',
            fontFamily: 'Microsoft JhengHei, Arial',
            color: '#aaaaaa'
        }).setOrigin(0, 0.5);

        const valueText = this.add.text(280, y, value, {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#' + color.toString(16).padStart(6, '0'),
            fontStyle: 'bold'
        }).setOrigin(1, 0.5);

        parent.add([labelText, valueText]);
    }

    /**
     * 創建按鈕
     */
    createButton(x, y, text, callback) {
        const button = this.add.container(x, y);

        const bg = this.add.rectangle(0, 0, 200, 50, 0x00d9ff, 0.2);
        const border = this.add.rectangle(0, 0, 200, 50, 0x000000, 0)
            .setStrokeStyle(2, 0x00d9ff, 0.7);

        const label = this.add.text(0, 0, text, {
            fontSize: '20px',
            fontFamily: 'Microsoft JhengHei, Arial',
            color: '#00d9ff'
        }).setOrigin(0.5);

        button.add([bg, border, label]);

        bg.setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                this.tweens.add({
                    targets: button,
                    scale: 1.05,
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
            .on('pointerdown', callback);

        return button;
    }

    /**
     * 獲取評級顏色
     */
    getGradeColor(grade) {
        const colors = {
            'A': 0x00ff00,
            'B': 0x7fff00,
            'C': 0xffaa00,
            'D': 0xff6600,
            'F': 0xff0000
        };
        return colors[grade] || 0xffffff;
    }

    /**
     * 獲取評價
     */
    getComment(grade, balanceRate, costGrade) {
        let balanceComment = '';
        let costComment = '';

        // 平衡評價
        if (grade === 'A' && balanceRate >= 90) {
            balanceComment = '完美！你是真正的電網調度專家！供需控制精準無誤。';
        } else if (grade === 'A' || grade === 'B') {
            balanceComment = '優秀！你對電網調度有很好的掌控能力。';
        } else if (grade === 'C') {
            balanceComment = '不錯！但還有進步空間，試著更快速地響應變化。';
        } else if (grade === 'D') {
            balanceComment = '勉強過關，建議多注意天氣變化和事件提示。';
        } else {
            balanceComment = '供需失衡較大，多練習能源調配技巧吧！';
        }

        // 成本評價
        if (costGrade) {
            if (costGrade === 'A') {
                costComment = '\n成本控制優異！充分利用了低成本能源。';
            } else if (costGrade === 'B') {
                costComment = '\n成本控制良好，保持經濟與穩定的平衡。';
            } else if (costGrade === 'C') {
                costComment = '\n成本略高，可多使用風力和水力發電。';
            } else if (costGrade === 'D') {
                costComment = '\n成本偏高，避免過度依賴高成本能源。';
            } else {
                costComment = '\n成本過高！需要優化能源配置降低成本。';
            }
        }

        return balanceComment + costComment;
    }

    /**
     * 創建煙火效果
     */
    createFireworks() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // 簡單的粒子效果
        for (let i = 0; i < 5; i++) {
            this.time.delayedCall(i * 500, () => {
                const x = Phaser.Math.Between(100, width - 100);
                const y = Phaser.Math.Between(100, height / 2);

                for (let j = 0; j < 20; j++) {
                    const particle = this.add.circle(x, y, 3, 0xffd700, 1);

                    const angle = (Math.PI * 2 * j) / 20;
                    const speed = Phaser.Math.Between(50, 150);

                    this.tweens.add({
                        targets: particle,
                        x: x + Math.cos(angle) * speed,
                        y: y + Math.sin(angle) * speed,
                        alpha: 0,
                        duration: 1000,
                        ease: 'Cubic.easeOut',
                        onComplete: () => particle.destroy()
                    });
                }
            });
        }
    }

    /**
     * 全部通關
     */
    showAllClear() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // 遮罩
        const overlay = this.add.rectangle(
            width / 2, height / 2,
            width, height,
            0x000000, 0.9
        );

        // 通關訊息
        const message = this.add.text(
            width / 2, height / 2,
            '🎊 恭喜通關所有關卡！ 🎊\n\n你已經掌握了智慧電網調度的精髓！',
            {
                fontSize: '32px',
                fontFamily: 'Microsoft JhengHei, Arial',
                color: '#00ff00',
                align: 'center',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5);

        // 返回選單按鈕
        this.time.delayedCall(3000, () => {
            this.scene.start('MenuScene');
        });
    }
}

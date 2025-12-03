/**
 * Phaser 遊戲配置
 */

const gameConfig = {
    type: Phaser.AUTO,  // 自動選擇 WebGL 或 Canvas
    parent: 'game-container',
    width: 1280,
    height: 720,
    backgroundColor: '#0a0e27',

    // 場景
    scene: [
        BootScene,
        MenuScene,
        LevelSelectScene,
        BriefingScene,
        GameScene,
        ResultScene
    ],

    // 物理引擎（本遊戲不需要）
    physics: {
        default: false
    },

    // 縮放模式
    scale: {
        mode: Phaser.Scale.FIT,  // 自適應縮放
        autoCenter: Phaser.Scale.CENTER_BOTH,  // 居中顯示
        width: 1280,
        height: 720,
        min: {
            width: 800,
            height: 600
        },
        max: {
            width: 1920,
            height: 1080
        }
    },

    // 渲染配置
    render: {
        antialias: true,
        pixelArt: false,
        roundPixels: true
    },

    // 輸入配置
    input: {
        // 啟用多點觸控
        activePointers: 6,  // 支援最多6個觸控點
        touch: {
            target: null,
            capture: true
        },
        mouse: {
            target: null,
            capture: true
        }
    },

    // DOM 配置
    dom: {
        createContainer: false
    },

    // 音頻配置（可選）
    audio: {
        disableWebAudio: false
    },

    // Banner 配置
    banner: {
        hidePhaser: true,  // 隱藏 Phaser 啟動 banner
        text: '#ffffff',
        background: [
            '#0a0e27',
            '#1a1e3e',
            '#00d9ff'
        ]
    }
};

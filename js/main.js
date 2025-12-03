/**
 * 智慧電網調度員
 * 主入口文件
 */

// 全域變數
let game = null;

/**
 * 初始化遊戲
 */
function initGame() {
    // 檢查瀏覽器支援
    if (!checkBrowserSupport()) {
        showUnsupportedBrowser();
        return;
    }

    // 創建 Phaser 遊戲實例
    game = new Phaser.Game(gameConfig);

    // 防止觸控縮放（移動裝置）
    preventTouchZoom();

    // 監聽視窗大小變化
    window.addEventListener('resize', handleResize);

    // 監聽可見性變化（切換分頁時暫停）
    document.addEventListener('visibilitychange', handleVisibilityChange);

    console.log('🎮 智慧電網調度員已啟動');
    console.log('📱 支援觸控操作');
    console.log('🖱️ 支援滑鼠操作');
}

/**
 * 檢查瀏覽器支援
 */
function checkBrowserSupport() {
    // 檢查 Canvas 支援
    const canvas = document.createElement('canvas');
    if (!canvas.getContext) {
        return false;
    }

    // 檢查 ES6 支援
    try {
        eval('const test = (x) => x + 1');
    } catch (e) {
        return false;
    }

    return true;
}

/**
 * 顯示不支援瀏覽器訊息
 */
function showUnsupportedBrowser() {
    document.getElementById('game-container').innerHTML = `
        <div style="
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            color: #ffffff;
            font-family: 'Microsoft JhengHei', Arial, sans-serif;
            text-align: center;
            padding: 20px;
        ">
            <h1 style="color: #ff0000; font-size: 32px;">⚠️ 瀏覽器不支援</h1>
            <p style="font-size: 18px; margin-top: 20px;">
                您的瀏覽器版本過舊，無法運行此遊戲。<br>
                請使用最新版本的 Chrome、Edge、Safari 或 Firefox。
            </p>
        </div>
    `;
}

/**
 * 防止觸控縮放
 */
function preventTouchZoom() {
    // 防止雙擊縮放
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (event) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);

    // 防止手勢縮放
    document.addEventListener('gesturestart', (event) => {
        event.preventDefault();
    });

    // 防止滾輪縮放（按住 Ctrl/Cmd）
    document.addEventListener('wheel', (event) => {
        if (event.ctrlKey) {
            event.preventDefault();
        }
    }, { passive: false });
}

/**
 * 處理視窗大小變化
 */
function handleResize() {
    if (game && game.scale) {
        game.scale.refresh();
    }
}

/**
 * 處理可見性變化
 */
function handleVisibilityChange() {
    if (!game) return;

    if (document.hidden) {
        // 頁面隱藏，暫停遊戲音效（如果有）
        if (game.sound) {
            game.sound.pauseAll();
        }
        console.log('⏸ 遊戲已暫停（頁面隱藏）');
    } else {
        // 頁面顯示，恢復音效
        if (game.sound) {
            game.sound.resumeAll();
        }
        console.log('▶️ 遊戲已恢復');
    }
}

/**
 * 清理資源
 */
function cleanupGame() {
    if (game) {
        game.destroy(true);
        game = null;
    }

    window.removeEventListener('resize', handleResize);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
}

/**
 * 錯誤處理
 */
window.addEventListener('error', (event) => {
    console.error('遊戲錯誤:', event.error);
    // 可以在這裡加入錯誤回報機制
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('未處理的 Promise 錯誤:', event.reason);
});

/**
 * 頁面載入完成後啟動遊戲
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
} else {
    initGame();
}

/**
 * 頁面卸載前清理
 */
window.addEventListener('beforeunload', cleanupGame);

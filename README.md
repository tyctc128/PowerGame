# 智慧電網調度員 ⚡

一款用於教育與展覽的 Web 互動遊戲，模擬電力供需平衡調度。

## 🎮 遊戲特色

- **純 Web 版本**：無需安裝，直接在瀏覽器中運行
- **觸控支援**：支援觸控螢幕操作（平板、手機）
- **多點觸控**：支援最多 6 個同時觸控點
- **響應式設計**：自動適應不同螢幕尺寸
- **6 個挑戰關卡**：從簡單到專家難度
- **真實模擬**：基於真實電網調度原理設計

## 🕹️ 遊戲玩法

### 目標
使供需差保持在 **±100 MW** 內，持續 **5 秒**即可過關。

### 操作方式
- 🔄 **旋轉轉盤**：滑動或觸控旋轉能源轉盤來調整發電量
- ⚡ **可控能源**：水力、燃煤、燃氣發電（可旋轉調整）
- 🌤️ **不可控能源**：風力、太陽能發電（受天氣影響）
- 💡 **需求側管理**：旋轉用戶節電轉盤降低用電需求

## 📦 技術架構

### 技術棧
- **前端框架**：Phaser 3.70.0（遊戲引擎）
- **語言**：純 JavaScript (ES6+)
- **樣式**：CSS3（霓虹藍科技風格）
- **無後端**：純前端運行

### 系統模組
- `EnergySystem`：能源管理系統
- `WeatherSystem`：天氣模擬系統
- `DemandSystem`：用電需求系統
- `BalanceSystem`：供需平衡檢核系統
- `EventSystem`：關卡事件系統
- `InputHandler`：觸控輸入處理器

### UI 組件
- `EnergyDial`：可旋轉的能源轉盤
- `Dashboard`：即時數據儀表板
- `EventMarquee`：事件提示跑馬燈

## 🚀 快速開始

### 方法 1：直接開啟 HTML
1. 將專案下載到本地
2. 使用瀏覽器開啟 `index.html`
3. 開始遊戲！

### 方法 2：使用本地伺服器（推薦）
```bash
# 使用 Python 3
python -m http.server 8000

# 使用 Node.js (需安裝 http-server)
npx http-server

# 使用 PHP
php -S localhost:8000
```

然後在瀏覽器中訪問 `http://localhost:8000`

## 🎯 關卡介紹

### 關卡 1：夏季用電尖峰 🌞
- **難度**：簡單
- **情境**：午後炎熱，用電激增
- **挑戰**：應對用電需求突然上升

### 關卡 2：午後雷雨 🌧️
- **難度**：中等
- **情境**：雷雨導致太陽能暴跌
- **挑戰**：快速調整其他能源補足缺口

### 關卡 3：強風特報 🍃
- **難度**：困難
- **情境**：強風造成風力發電劇烈波動
- **挑戰**：應對不穩定的再生能源

### 關卡 4：燃氣機組滿載 🔥
- **難度**：困難
- **情境**：燃氣發電上限受限
- **挑戰**：在資源受限下維持平衡

### 關卡 5：節電行動啟動 💡
- **難度**：中等
- **情境**：全國節電行動
- **挑戰**：善用需求側管理

### 關卡 6：突發事故 ⚠️
- **難度**：專家
- **情境**：多個機組同時故障
- **挑戰**：緊急調度應對危機

## 📱 支援平台

### 桌面瀏覽器
- ✅ Chrome 80+
- ✅ Edge 80+
- ✅ Firefox 75+
- ✅ Safari 13+

### 移動裝置
- ✅ iPad / iPad Pro
- ✅ Android 平板
- ✅ iPhone（建議橫屏）
- ✅ Android 手機（建議橫屏）

## 📂 專案結構

```
PowerGame/
├── index.html              # 主 HTML 檔案
├── css/
│   └── style.css          # 樣式表
├── js/
│   ├── data/
│   │   ├── energyData.js  # 能源資料配置
│   │   └── levelData.js   # 關卡資料配置
│   ├── systems/
│   │   ├── EnergySystem.js
│   │   ├── WeatherSystem.js
│   │   ├── DemandSystem.js
│   │   ├── BalanceSystem.js
│   │   └── EventSystem.js
│   ├── ui/
│   │   ├── EnergyDial.js
│   │   ├── Dashboard.js
│   │   └── EventMarquee.js
│   ├── input/
│   │   └── InputHandler.js
│   ├── scenes/
│   │   ├── BootScene.js
│   │   ├── MenuScene.js
│   │   ├── LevelSelectScene.js
│   │   ├── BriefingScene.js
│   │   ├── GameScene.js
│   │   └── ResultScene.js
│   ├── config.js          # Phaser 配置
│   └── main.js            # 主入口
└── README.md              # 說明文件
```

## 🔧 自訂與擴展

### 新增關卡
編輯 `js/data/levelData.js`，按照現有格式新增關卡資料：

```javascript
levelX: {
    id: X,
    name: '關卡名稱',
    description: '情境描述',
    icon: '🎯',
    difficulty: 'medium',
    initialConditions: { /* ... */ },
    events: [ /* ... */ ],
    winConditions: { /* ... */ }
}
```

### 調整能源參數
編輯 `js/data/energyData.js` 修改能源的輸出範圍、變化速率等。

### 修改 UI 風格
編輯 `css/style.css` 和各場景檔案中的顏色配置。

## 🎨 UI 設計

採用**深色背景 + 霓虹藍科技風格**：
- 主色調：`#00d9ff`（霓虹藍）
- 背景色：`#0a0e27` / `#1a1e3e`（深藍黑）
- 發光效果：使用 `box-shadow` 和 `text-shadow`

## 🐛 已知問題與限制

- Safari 部分版本的觸控事件可能有延遲
- 不支援 IE 瀏覽器
- 手機豎屏模式下 UI 可能過於擁擠（建議橫屏）

## 📈 未來改進

- [ ] 新增音效和背景音樂
- [ ] 增加成就系統
- [ ] 支援多語言
- [ ] 新增教學模式互動引導
- [ ] 統計資料視覺化圖表
- [ ] 關卡編輯器

## 📄 授權

本專案為教育展示用途。

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

## 📧 聯絡

如有問題或建議，歡迎聯繫。

---

**享受遊戲，體驗智慧電網調度的挑戰！** ⚡🎮

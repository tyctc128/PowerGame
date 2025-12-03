/**
 * 關卡資料配置
 * 包含6個關卡的完整事件腳本
 */

const LEVEL_DATA = {
    // 關卡 1：夏季用電尖峰
    level1: {
        id: 1,
        name: '夏季用電尖峰',
        nameEn: 'Summer Peak',
        description: '午後炎熱，用電激增，需緊急調度發電。',
        icon: '🌞',
        difficulty: 'easy',

        // 初始條件
        initialConditions: {
            baseDemand: 35000,  // 基礎用電量（高）
            weather: {
                sunIntensity: 90,  // 日照強度 %
                windSpeed: 50      // 風速 %
            },
            energyLimits: {}  // 無限制
        },

        // 事件腳本（時間單位：秒）
        events: [
            {
                time: 5,
                type: 'demand_change',
                value: 2000,
                message: '⚠️ 氣溫上升，用電增加 2000 MW'
            },
            {
                time: 20,
                type: 'weather',
                target: 'wind',
                value: -10,  // 下降10%
                message: '🍃 微風，風力下降 10%'
            },
            {
                time: 40,
                type: 'weather',
                target: 'solar',
                value: 20,  // 上升20%（90% -> 110%）
                message: '☀️ 日照增強，太陽能提升 20%'
            }
        ],

        // 過關條件
        winConditions: {
            balanceTolerance: 1000,  // ±1000 MW
            balanceDuration: 5      // 持續5秒
        }
    },

    // 關卡 2：午後雷雨
    level2: {
        id: 2,
        name: '午後雷雨',
        nameEn: 'Afternoon Thunderstorm',
        description: '午後雷雨造成太陽能瞬間崩跌。',
        icon: '🌧️',
        difficulty: 'medium',

        initialConditions: {
            baseDemand: 32000,
            weather: {
                sunIntensity: 95,  // 雷雨前日照強
                windSpeed: 60
            },
            energyLimits: {}
        },

        events: [
            {
                time: 10,
                type: 'weather',
                target: 'solar',
                value: -40,  // 下降40%
                message: '⛈️ 雷雨雲形成，太陽能下降 40%'
            },
            {
                time: 30,
                type: 'weather',
                target: 'solar',
                value: -20,  // 再下降20%
                message: '🌧️ 雨勢變大，太陽能再降 20%'
            },
            {
                time: 40,
                type: 'weather',
                target: 'solar',
                value: 15,  // 緩慢回升
                message: '⛅ 雷雨減弱，太陽能緩慢回升'
            },
            {
                time: 50,
                type: 'weather',
                target: 'solar',
                value: 25,  // 繼續回升
                message: '🌤️ 雨停雲散，太陽能持續恢復'
            }
        ],

        winConditions: {
            balanceTolerance: 1000,
            balanceDuration: 5
        }
    },

    // 關卡 3：強風特報
    level3: {
        id: 3,
        name: '強風特報',
        nameEn: 'Strong Wind Alert',
        description: '強風吹襲，全台風力發電大幅波動。',
        icon: '🍃',
        difficulty: 'hard',

        initialConditions: {
            baseDemand: 30000,
            weather: {
                sunIntensity: 70,
                windSpeed: 50
            },
            energyLimits: {}
        },

        events: [
            {
                time: 5,
                type: 'weather',
                target: 'wind',
                value: 30,  // 上升30%
                message: '💨 風速上升，風力 +30%'
            },
            {
                time: 12,
                type: 'weather',
                target: 'wind',
                value: -20,  // 亂流下降
                message: '🌪️ 亂流導致風力 -20%'
            },
            {
                time: 25,
                type: 'weather',
                target: 'wind',
                value: 40,  // 大幅提升
                message: '💨 風速再次提升 +40%'
            },
            {
                time: 35,
                type: 'weather',
                target: 'wind',
                value: -15,  // 微降
                message: '🍃 風速略降 -15%'
            },
            {
                time: 40,
                type: 'weather',
                target: 'wind',
                value: -5,  // 趨於穩定
                message: '🍃 風速穩定於 80%'
            }
        ],

        winConditions: {
            balanceTolerance: 1000,
            balanceDuration: 5
        }
    },

    // 關卡 4：燃氣機組滿載
    level4: {
        id: 4,
        name: '燃氣機組滿載',
        nameEn: 'Gas Turbine Full Load',
        description: '因維修與熱機限制，燃氣無法升滿。',
        icon: '🔥',
        difficulty: 'hard',

        initialConditions: {
            baseDemand: 33000,
            weather: {
                sunIntensity: 75,
                windSpeed: 55
            },
            energyLimits: {
                gas: 0.6  // 燃氣上限縮小為 60%
            }
        },

        events: [
            {
                time: 20,
                type: 'demand_change',
                value: 1500,
                message: '⚠️ 用電量增加 1500 MW'
            },
            {
                time: 35,
                type: 'demand_change',
                value: 1000,
                message: '⚠️ 持續高溫，用電再增 1000 MW'
            },
            {
                time: 50,
                type: 'weather',
                target: 'wind',
                value: -15,
                message: '🍃 風速下降 -15%'
            }
        ],

        winConditions: {
            balanceTolerance: 1000,
            balanceDuration: 5
        }
    },

    // 關卡 5：節電行動啟動
    level5: {
        id: 5,
        name: '節電行動啟動',
        nameEn: 'Demand Response Activated',
        description: '用戶大量參與節電，需操作"用戶節電"轉盤。',
        icon: '💡',
        difficulty: 'medium',

        initialConditions: {
            baseDemand: 36000,  // 高需求
            weather: {
                sunIntensity: 80,
                windSpeed: 60
            },
            energyLimits: {},
            demandResponseBoost: 1.3  // 節電上限提升30%
        },

        events: [
            {
                time: 10,
                type: 'system_message',
                message: '📢 全國節電行動生效，用戶節電上限 +30%'
            },
            {
                time: 25,
                type: 'demand_change',
                value: 2500,
                message: '🌡️ 高溫來襲，用電量 +2500 MW'
            },
            {
                time: 40,
                type: 'demand_response_boost',
                value: 1.5,  // 再提升20%（總計50%）
                message: '💡 節電效果提升 20%'
            },
            {
                time: 55,
                type: 'weather',
                target: 'solar',
                value: -25,
                message: '☁️ 雲層遮蔽，太陽能 -25%'
            }
        ],

        winConditions: {
            balanceTolerance: 1000,
            balanceDuration: 5
        }
    },

    // 關卡 6：突發事故
    level6: {
        id: 6,
        name: '突發事故',
        nameEn: 'Emergency Situation',
        description: '兩座大型機組跳脫，需全場緊急調度。',
        icon: '⚠️',
        difficulty: 'expert',

        initialConditions: {
            baseDemand: 34000,
            weather: {
                sunIntensity: 85,
                windSpeed: 65
            },
            energyLimits: {}
        },

        events: [
            {
                time: 5,
                type: 'energy_failure',
                target: 'coal',
                value: -30,  // 燃煤跳脫-30%
                message: '🚨 燃煤機組跳脫 −30%'
            },
            {
                time: 10,
                type: 'energy_failure',
                target: 'hydro',
                value: -25,  // 水力故障-25%
                message: '🚨 水力機組故障 −25%'
            },
            {
                time: 30,
                type: 'weather',
                target: 'wind',
                value: 20,
                message: '🍃 風力短暫上升 +20%'
            },
            {
                time: 45,
                type: 'demand_change',
                value: -1000,
                message: '🏭 企業停工，用電下降 −1000 MW'
            },
            {
                time: 55,
                type: 'energy_recovery',
                target: 'hydro',
                value: 15,  // 水力部分恢復
                message: '✅ 水力機組部分恢復 +15%'
            }
        ],

        winConditions: {
            balanceTolerance: 1000,
            balanceDuration: 5
        }
    }
};

/**
 * 關卡順序
 */
const LEVEL_ORDER = ['level1', 'level2', 'level3', 'level4', 'level5', 'level6'];

/**
 * 難度定義
 */
const DIFFICULTY_CONFIG = {
    easy: { color: 0x00ff00, label: '簡單' },
    medium: { color: 0xffaa00, label: '中等' },
    hard: { color: 0xff6600, label: '困難' },
    expert: { color: 0xff0000, label: '專家' }
};

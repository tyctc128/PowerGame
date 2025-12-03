/**
 * 能源資料配置
 * 定義六種能源的基本屬性
 */

const ENERGY_DATA = {
    hydro: {
        id: 'hydro',
        name: '水力發電',
        nameEn: 'Hydro',
        controlled: true,  // 可由玩家控制
        current: 8200,
        max: 14000,
        min: 2000,
        changeRate: 300,  // MW/秒（旋轉時的變化率）- 10倍速
        cost: 2.17,  // 元/度（kWh）
        color: 0x00bfff,  // 深天藍
        icon: '💧'
    },
    wind: {
        id: 'wind',
        name: '風力發電',
        nameEn: 'Wind',
        controlled: false,  // 不可控，受天氣影響
        current: 4500,
        max: 8000,
        min: 500,
        changeRate: 0,  // 由天氣系統控制
        volatility: 0.3,  // 波動性
        cost: 2.04,  // 元/度（kWh）
        color: 0x98fb98,  // 淺綠
        icon: '🍃'
    },
    solar: {
        id: 'solar',
        name: '太陽能發電',
        nameEn: 'Solar',
        controlled: false,  // 不可控，受天氣影響
        current: 6000,
        max: 9000,
        min: 0,
        changeRate: 0,  // 由天氣系統控制
        volatility: 0.4,  // 波動性較高
        cost: 5.01,  // 元/度（kWh）
        color: 0xffd700,  // 金黃
        icon: '☀️'
    },
    coal: {
        id: 'coal',
        name: '燃煤發電',
        nameEn: 'Coal',
        controlled: true,
        current: 12000,
        max: 20000,
        min: 4000,
        changeRate: 250,  // 變化較慢 - 10倍速
        cost: 2.56,  // 元/度（kWh）
        color: 0x8b4513,  // 深褐
        icon: '⚫'
    },
    gas: {
        id: 'gas',
        name: '燃氣發電',
        nameEn: 'Gas',
        controlled: true,
        current: 9000,
        max: 15000,
        min: 2000,
        changeRate: 400,  // 變化較快 - 10倍速
        cost: 3.00,  // 元/度（kWh）
        color: 0xff8c00,  // 深橙
        icon: '🔥'
    },
    demand: {
        id: 'demand',
        name: '用戶節電',
        nameEn: 'Demand Response',
        controlled: true,
        current: 0,  // 節電量（減少需求）
        max: 5000,  // 最大可節電量
        min: 0,
        changeRate: 350,  // 10倍速
        cost: 0,  // 節電無成本
        color: 0x9370db,  // 中紫
        icon: '💡',
        isDemandSide: true  // 標記為需求側
    }
};

/**
 * 能源類型陣列（用於遍歷）
 */
const ENERGY_TYPES = ['hydro', 'wind', 'solar', 'coal', 'gas', 'demand'];

/**
 * 供給側能源（發電）
 */
const SUPPLY_TYPES = ['hydro', 'wind', 'solar', 'coal', 'gas'];

/**
 * 可控能源
 */
const CONTROLLABLE_TYPES = ENERGY_TYPES.filter(type => ENERGY_DATA[type].controlled);

/**
 * 不可控能源（受天氣影響）
 */
const UNCONTROLLABLE_TYPES = ENERGY_TYPES.filter(type => !ENERGY_DATA[type].controlled && !ENERGY_DATA[type].isDemandSide);

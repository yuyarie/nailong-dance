import { Music, setSfxEnabled, sfxClick, sfxCoin, sfxMiss, ensureCtx, setMenuBgmVolume, setVoiceVolume, Preview } from "./audio.js";
import { Game, pauseGame } from "./game.js";
import { parseMalody, importMalodyFiles } from "./malody.js";
import { CustomStore } from "./customstore.js";
import { DEFAULT_KEYS, normalizeKeys, isBindableKey, keyLabel } from './keybindings.js';
const KEY = 'naiwa_dance_local_save_v1',
  DEFAULTS = {
    'coins': 0x15e,
    'owned': ["classic"],
    'equipped': "classic",
    'ownedAcc': [],
    'accEquipped': {
      'head': null,
      'body': null,
      'cape': null
    },
    'stats': {
      'plays': 0x0,
      'bestScore': 0x0,
      'maxCombo': 0x0,
      'totalPerfect': 0x0,
      'totalCoins': 0x0,
      'bestAcc': 0x0,
      'fullCombos': 0x0,
      'ssCount': 0x0,
      'totalMiss': 0x0,
      'totalGood': 0x0,
      'worstMiss': 0x0,
      'hardFc': 0x0,
      'endlessBestSec': 0x0,
      'endlessMaxRate': 0x0,
      'endlessLoops': 0x0,
      'climbCount': 0x0,
      'pokeCount': 0x0,
      'previewCount': 0x0,
      'uploadCount': 0x0,
      'mpPlays': 0x0,
      'loginStreak': 0x0,
      'lastPlayDate': ''
    },
    'ach': {},
    'scores': {
      'easy': [],
      'normal': [],
      'hard': []
    },
    'set': {
      'vol': 0.8,
      'sfx': 0x1,
      'offset': 0x0,
      'speed': 0x1,
      'keys': [...DEFAULT_KEYS],
      'quality': 0x1,
      'mpView': "quad",
      'pad': 0x1,
      'gap': 0x1,
      'swipe': 0x1,
      'climb': 0x1
    },
    'customSongs': [],
    'chartSongs': [],
    'saveAt': 0x0
  };
export const Store = {
  'data': null,
  'load'() {
    try {
      this.data = {
        ...structuredClone(DEFAULTS),
        ...(JSON.parse(localStorage.getItem(KEY)) || {})
      };
    } catch {
      this.data = structuredClone(DEFAULTS);
    }
    return this.data.stats = {
      ...DEFAULTS.stats,
      ...(this.data.stats || {})
    }, this.data.set = {
      ...DEFAULTS.set,
      ...(this.data.set || {})
    }, this.data.scores = {
      ...DEFAULTS.scores,
      ...(this.data.scores || {})
    }, this.data.set.keys = normalizeKeys(this.data.set.keys), this.data.usedCodes = this.data.usedCodes || [], void 0, this.data;
  },
  'save'() {
    this.data.saveAt = Date.now(), localStorage.setItem(KEY, JSON.stringify(this.data));
  },
  'reset'() {
    localStorage.removeItem(KEY), this.load();
  }
};
Store.load();
export const SKINS = [{
  'id': 'classic',
  'name': '经典奶黄',
  'desc': "出厂原味，奶香四溢",
  'price': 0x0,
  'colors': {
    'head': 0xffffff,
    'belly': 0xffffff
  }
}, {
  'id': "lemon",
  'name': "柠檬奶酸",
  'desc': '酸到皱眉，提神醒脑',
  'price': 0x32,
  'colors': {
    'head': 0xfff59e,
    'belly': 0xffe04a
  }
}, {
  'id': "mint",
  'name': "薄荷奶凉",
  'desc': "清清凉凉，夏日必备",
  'price': 0x32,
  'colors': {
    'head': 0xc8f0dc,
    'belly': 0x8ee6c0
  }
}, {
  'id': "sky",
  'name': "天空奶蓝",
  'desc': "蓝天白云，心情舒畅",
  'price': 0x50,
  'colors': {
    'head': 0xd6f0ff,
    'belly': 0x9dd8f5
  }
}, {
  'id': "peach",
  'name': "蜜桃奶粉",
  'desc': "粉嘟嘟，水嫩嫩",
  'price': 0x50,
  'colors': {
    'head': 0xffd6cc,
    'belly': 0xffb3a0
  }
}, {
  'id': "strawberry",
  'name': '草莓奶红',
  'desc': '红彤彤，甜丝丝，头上一点绿',
  'price': 0x96,
  'colors': {
    'head': 0xff7a8a,
    'belly': 0xff4d6a
  }
}, {
  'id': 'apple',
  'name': "苹果奶脆",
  'desc': '一天一苹果，奶娃远离我',
  'price': 0x96,
  'colors': {
    'head': 0xff6b6b,
    'belly': 0xe84444
  }
}, {
  'id': "orange",
  'name': "橙子奶VC",
  'desc': '满满维C，活力满满',
  'price': 0x96,
  'colors': {
    'head': 0xffc07a,
    'belly': 0xff9a3d
  }
}, {
  'id': "banana",
  'name': '香蕉奶黄',
  'desc': "弯弯的，甜甜的",
  'price': 0x96,
  'colors': {
    'head': 0xfff08a,
    'belly': 0xffd93d
  }
}, {
  'id': "matcha",
  'name': "抹茶奶绿",
  'desc': "微苦回甘，纯狱系奶娃",
  'price': 0x12c,
  'colors': {
    'head': 0xbfe8c0,
    'belly': 0x93d19a
  }
}, {
  'id': "berry",
  'name': "草莓奶昔",
  'desc': "粉粉嫩嫩，甜度拉满",
  'price': 0x12c,
  'colors': {
    'head': 0xffc2d4,
    'belly': 0xff9bbd
  }
}, {
  'id': "milktea",
  'name': "奶茶奶棕",
  'desc': "珍珠奶茶，续命神器",
  'price': 0x12c,
  'colors': {
    'head': 0xd9b896,
    'belly': 0xb8895a
  }
}, {
  'id': 'ocean',
  'name': "海盐奶蓝",
  'desc': '清爽冰凉，海洋之心',
  'price': 0x12c,
  'colors': {
    'head': 0xbfe6ff,
    'belly': 0x7fc9f2
  }
}, {
  'id': "choco",
  'name': "巧克力奶",
  'desc': "浓郁丝滑，热量爆炸",
  'price': 0x190,
  'colors': {
    'head': 0xb98a63,
    'belly': 0x8f6543
  }
}, {
  'id': 'grape',
  'name': "葡萄奶紫",
  'desc': "一串葡萄，酸中带甜",
  'price': 0x190,
  'colors': {
    'head': 0xc9a0e8,
    'belly': 0x9b59d0
  }
}, {
  'id': "blueberry",
  'name': "蓝莓奶靛",
  'desc': "小小一颗，花青素爆表",
  'price': 0x190,
  'colors': {
    'head': 0x7a8cd6,
    'belly': 0x4a5fb8
  }
}, {
  'id': 'cherry',
  'name': "樱桃奶红",
  'desc': "两颗樱桃，鸿运当头",
  'price': 0x190,
  'colors': {
    'head': 0xff5a7a,
    'belly': 0xd92d50
  }
}, {
  'id': "watermelon",
  'name': "西瓜奶皮",
  'desc': "绿皮红瓤，夏天的味道",
  'price': 0x1f4,
  'colors': {
    'head': 0x6fcf5c,
    'belly': 0xff5c6f
  }
}, {
  'id': 'tomato',
  'name': '西红柿奶酸',
  'desc': '糖拌西红柿，童年回忆',
  'price': 0x1f4,
  'colors': {
    'head': 0xff7a5c,
    'belly': 0xe8442a
  }
}, {
  'id': "taro",
  'name': '紫薯奶芋',
  'desc': "香芋本芋，奶紫奶紫的",
  'price': 0x1f4,
  'colors': {
    'head': 0xd9c2f2,
    'belly': 0xb99ae6
  }
}, {
  'id': "coconut",
  'name': "椰子奶香",
  'desc': "海南风味，椰奶飘香",
  'price': 0x1f4,
  'colors': {
    'head': 0xf0e6d0,
    'belly': 0x8b6f47
  }
}, {
  'id': "caramel",
  'name': '焦糖奶棕',
  'desc': "焦香四溢，甜而不腻",
  'price': 0x258,
  'colors': {
    'head': 0xd9a066,
    'belly': 0xa86a2a
  }
}, {
  'id': "honey",
  'name': "蜂蜜奶金",
  'desc': "纯天然，甜到心化",
  'price': 0x258,
  'colors': {
    'head': 0xffd966,
    'belly': 0xe8a820
  },
  'glow': 0xffaa00
}, {
  'id': "gold",
  'name': "黑金奶霸",
  'desc': '全场最贵，气场上分',
  'price': 0x29a,
  'colors': {
    'head': 0x3a3a3a,
    'belly': 0x1f1f1f
  },
  'glow': 0xffd257
}, {
  'id': "neon",
  'name': "霓虹奶龙",
  'desc': '赛博奶味，夜店之光',
  'price': 0x3e8,
  'colors': {
    'head': 0x36d1ff,
    'belly': 0xff3b6b
  },
  'glow': 0x7a4dff
}, {
  'id': "rainbow",
  'name': "彩虹奶糖",
  'desc': "七彩斑斓，幸运加成",
  'price': 0x5dc,
  'colors': {
    'head': 0xff9a9a,
    'belly': 0x9a9aff
  },
  'glow': 0xff66cc
}, {
  'id': "galaxy",
  'name': "星河奶宙",
  'desc': '把银河穿在身上',
  'price': 0x7d0,
  'colors': {
    'head': 0x4a3a8a,
    'belly': 0x1a1a4a
  },
  'glow': 0x6644ff
}, {
  'id': "fx_watermelon",
  'name': '🍉\x20西瓜太郎',
  'desc': "全身变身大西瓜，绿纹红瓤，头上还带叶",
  'price': 0x320,
  'emoji': '🍉',
  'fx': "watermelon",
  'colors': {
    'head': 0x86d46b,
    'belly': 0x54c24e,
    'armL': 0x4fb84a,
    'armR': 0x4fb84a,
    'legL': 0x3d9e42,
    'legR': 0x3d9e42
  }
}, {
  'id': 'fx_peach',
  'name': "🍑 水蜜桃精",
  'desc': "整个人变成水蜜桃，粉嘟嘟软乎乎",
  'price': 0x320,
  'emoji': '🍑',
  'fx': "peach",
  'colors': {
    'head': 0xffb39e,
    'belly': 0xffa288,
    'armL': 0xffb39e,
    'armR': 0xffb39e,
    'legL': 0xff9478,
    'legR': 0xff9478
  }
}, {
  'id': 'fx_strawberry',
  'name': "🍓 草莓朵朵",
  'desc': '全身草莓变身，一身小籽头顶绿叶',
  'price': 0x352,
  'emoji': '🍓',
  'fx': "strawberry",
  'colors': {
    'head': 0xff6a7d,
    'belly': 0xff4d6a,
    'armL': 0xff6a7d,
    'armR': 0xff6a7d,
    'legL': 0xe8405e,
    'legR': 0xe8405e
  }
}, {
  'id': "fx_dragon",
  'name': "🐉 火龙果侠",
  'desc': "粉红身体绿鳞片，甜到掉渣的大侠",
  'price': 0x384,
  'emoji': '🐉',
  'fx': 'dragonfruit',
  'colors': {
    'head': 0xff6fb0,
    'belly': 0xff4f9e,
    'armL': 0xff6fb0,
    'armR': 0xff6fb0,
    'legL': 0xe8408a,
    'legR': 0xe8408a
  }
}, {
  'id': "fx_pineapple",
  'name': "🍍 菠萝霸王",
  'desc': "金黄格纹满身，叶冠冲天，又酸又拽",
  'price': 0x384,
  'emoji': '🍍',
  'fx': "pineapple",
  'colors': {
    'head': 0xf5cd57,
    'belly': 0xf2b93c,
    'armL': 0xf5cd57,
    'armR': 0xf5cd57,
    'legL': 0xe0a020,
    'legR': 0xe0a020
  }
}, {
  'id': "fx_snow",
  'name': "⛄ 雪地奶娃",
  'desc': "围巾桶帽胡萝卜鼻，零下十度照样蹦",
  'price': 0x3e8,
  'emoji': '⛄',
  'fx': "snowman",
  'colors': {
    'head': 0xffffff,
    'belly': 0xf2f6ff,
    'armL': 0xffffff,
    'armR': 0xffffff,
    'legL': 0xe4ecf8,
    'legR': 0xe4ecf8
  }
}, {
  'id': "fx_tiger",
  'name': '🐯\x20虎皮奶娃',
  'desc': '嗷呜～虎年限定皮肤，王霸之气',
  'price': 0x3e8,
  'emoji': '🐯',
  'fx': "tiger",
  'colors': {
    'head': 0xffb36b,
    'belly': 0xffa64d,
    'armL': 0xffb36b,
    'armR': 0xffb36b,
    'legL': 0xf08c30,
    'legR': 0xf08c30
  }
}, {
  'id': 'fx_lava',
  'name': "🌋 熔岩煤球",
  'desc': "火山岩壳裂缝冒火，跳到哪里烧到哪里",
  'price': 0x4b0,
  'emoji': '🌋',
  'fx': 'lava',
  'colors': {
    'head': 0x3a3a42,
    'belly': 0x2e2e36,
    'armL': 0x3a3a42,
    'armR': 0x3a3a42,
    'legL': 0x24242c,
    'legR': 0x24242c
  },
  'glow': 0xff5a1e
}];
export const ACCESSORIES = [{
  'id': "acc-bunny",
  'name': '小兔叽',
  'slot': "head",
  'price': 0x78,
  'color': 0xffffff,
  'desc': "软萌小兔子坐头顶，蹦蹦跳跳",
  'icon': '🐰'
}, {
  'id': 'acc-chick',
  'name': "小鸡仔",
  'slot': "head",
  'price': 0x64,
  'color': 0xffe17a,
  'desc': "毛茸茸的小黄鸡，叽叽叽",
  'icon': '🐥'
}, {
  'id': "acc-cat",
  'name': "小奶猫",
  'slot': "head",
  'price': 0x78,
  'color': 0xffccaa,
  'desc': "傲娇小猫头顶趴，摸摸头",
  'icon': '🐱'
}, {
  'id': "acc-bee",
  'name': "小蜜蜂",
  'slot': "head",
  'price': 0x6e,
  'color': 0xffcc33,
  'desc': "嗡嗡嗡，采蜜的小蜜蜂",
  'icon': '🐝'
}, {
  'id': "acc-strawberry",
  'name': "大草莓",
  'slot': "head",
  'price': 0x50,
  'color': 0xff4d6d,
  'desc': "红彤彤草莓顶头上，超甜",
  'icon': '🍓'
}, {
  'id': "acc-watermelon",
  'name': "西瓜帽",
  'slot': 'head',
  'price': 0x64,
  'color': 0x3ddc84,
  'desc': "夏天必备，头顶一块西瓜",
  'icon': '🍉'
}, {
  'id': "acc-icecream",
  'name': "冰淇淋",
  'slot': "head",
  'price': 0x64,
  'color': 0xffd9e6,
  'desc': "甜筒冰淇淋，凉快又可爱",
  'icon': '🍦'
}, {
  'id': "acc-lollypop",
  'name': "棒棒糖",
  'slot': 'head',
  'price': 0x5a,
  'color': 0xff66cc,
  'desc': "彩虹棒棒糖，童年回忆",
  'icon': '🍭'
}, {
  'id': "acc-popsicle",
  'name': "冰棍儿",
  'slot': "head",
  'price': 0x50,
  'color': 0xa8e6ff,
  'desc': "清爽冰棍，咬一口嘎嘣脆",
  'icon': '🍧'
}, {
  'id': "acc-muffin",
  'name': "小松饼",
  'slot': "head",
  'price': 0x5a,
  'color': 0xd9a066,
  'desc': "圆滚滚的麦芬，香香的",
  'icon': '🧁'
}, {
  'id': "acc-donut",
  'name': "甜甜圈",
  'slot': "head",
  'price': 0x64,
  'color': 0xff99cc,
  'desc': "撒满糖珠的甜甜圈，想咬",
  'icon': '🍩'
}, {
  'id': 'acc-grapes',
  'name': '葡萄串',
  'slot': 'head',
  'price': 0x64,
  'color': 0x9966ff,
  'desc': "一串紫葡萄挂头顶",
  'icon': '🍇'
}, {
  'id': "acc-pancakes",
  'name': "松饼塔",
  'slot': "head",
  'price': 0x82,
  'color': 0xe8c39e,
  'desc': "三层松饼叠高高，超满足",
  'icon': '🥞'
}, {
  'id': 'body_burger',
  'name': "汉堡肚兜",
  'slot': "body",
  'price': 0x96,
  'desc': "胸前一个大汉堡，饿了就啃自己",
  'icon': '🍔',
  'color': 0xd9a066
}, {
  'id': "body_pizza",
  'name': "披萨胸甲",
  'slot': "body",
  'price': 0x96,
  'desc': '切角披萨挂胸口，意式风情',
  'icon': '🍕',
  'color': 0xff9933
}, {
  'id': 'body_taco',
  'name': '玉米卷腰带',
  'slot': "body",
  'price': 0x78,
  'desc': '腰间别着墨西哥卷，走路咔咔响',
  'icon': '🌮',
  'color': 0xffcc44
}, {
  'id': "body_sushi",
  'name': "寿司护心镜",
  'slot': 'body',
  'price': 0x8c,
  'desc': '一排寿司贴在胸口，行走的日料店',
  'icon': '🍣',
  'color': 0xffaaaa
}, {
  'id': "body_cookie",
  'name': "曲奇盾牌",
  'slot': "body",
  'price': 0x64,
  'desc': "大块曲奇饼干挡胸前，甜到掉渣",
  'icon': '🍪',
  'color': 0xc9966a
}, {
  'id': "cape_red",
  'name': "烈焰披风",
  'slot': 'cape',
  'price': 0xc8,
  'desc': "红色披风一甩，奶娃也能很飒",
  'icon': '🔴',
  'color': 0xff3333
}, {
  'id': "cape_gold",
  'name': '黄金斗篷',
  'slot': "cape",
  'price': 0xfa,
  'desc': '金闪闪的斗篷，全场最靓的崽',
  'icon': '🟡',
  'color': 0xffd700
}, {
  'id': "cape_dark",
  'name': "暗夜斗篷",
  'slot': 'cape',
  'price': 0xfa,
  'desc': "深紫斗篷带星光，神秘又帅气",
  'icon': '🟣',
  'color': 0x6644ff
}, {
  'id': "cape_rainbow",
  'name': "彩虹披风",
  'slot': "cape",
  'price': 0x12c,
  'desc': "七彩渐变的披风，走路带彩虹",
  'icon': '🌈',
  'color': 0xff66cc
}];
export const SONGS = [{
  id: 'default', name: 'ニニ', artist: 'テヅカxQayo',
  file: 'charts/default/1565767011.ogg', chartFile: 'charts/default/1565787429.mc',
  bpm: 174, version: '4K Normal Lv.17', desc: '4K Normal Lv.17 · 773 notes · 64 长条', previewStart: 103.104
}];
const ACHS = [{
  'id': 'first',
  'ic': '🕺',
  'name': "初次登台",
  'desc': '完成第一场演出',
  'goal': 0x1,
  'get': _0x437e82 => _0x437e82.stats.plays
}, {
  'id': 'p10',
  'ic': '🎪',
  'name': "舞池常客",
  'desc': "累计完成 10 场演出",
  'goal': 0xa,
  'get': _0x377ffa => _0x377ffa.stats.plays
}, {
  'id': "p30",
  'ic': '🎭',
  'name': "舞台老手",
  'desc': "累计完成 30 场演出",
  'goal': 0x1e,
  'get': _0x545c01 => _0x545c01.stats.plays
}, {
  'id': "p50",
  'ic': '🎤',
  'name': "驻唱歌手",
  'desc': "累计完成 50 场演出",
  'goal': 0x32,
  'get': _0x27d053 => _0x27d053.stats.plays
}, {
  'id': "p100",
  'ic': '👑',
  'name': "百场舞王",
  'desc': '累计完成\x20100\x20场演出',
  'goal': 0x64,
  'get': _0x2e5973 => _0x2e5973.stats.plays
}, {
  'id': "p200",
  'ic': '🎬',
  'name': "舞台是我家",
  'desc': "累计完成 200 场演出，工作人员都认识你了",
  'goal': 0xc8,
  'get': _0x9e5a80 => _0x9e5a80.stats.plays
}, {
  'id': "p500",
  'ic': '🏟️',
  'name': "五百场钉子户",
  'desc': '累计完成\x20500\x20场演出，舞池地砖都被你磨平',
  'goal': 0x1f4,
  'get': _0x17c096 => _0x17c096.stats.plays
}, {
  'id': "p1000",
  'ic': "🏔️",
  'name': '千场舞神',
  'desc': "累计完成 1000 场演出，传说中的奶娃本娃",
  'goal': 0x3e8,
  'get': _0x50b834 => _0x50b834.stats.plays
}, {
  'id': "c10",
  'ic': '🔥',
  'name': '小试牛刀',
  'desc': "单场连击达到 10",
  'goal': 0xa,
  'get': _0x5c215e => _0x5c215e.stats.maxCombo
}, {
  'id': "c30",
  'ic': '⚡',
  'name': '连击新秀',
  'desc': "单场连击达到 30",
  'goal': 0x1e,
  'get': _0xd03c6d => _0xd03c6d.stats.maxCombo
}, {
  'id': "c50",
  'ic': '💫',
  'name': "连击达人",
  'desc': "单场连击达到 50",
  'goal': 0x32,
  'get': _0x287e13 => _0x287e13.stats.maxCombo
}, {
  'id': "c80",
  'ic': '🌟',
  'name': "连击狂人",
  'desc': "单场连击达到 80",
  'goal': 0x50,
  'get': _0x35d512 => _0x35d512.stats.maxCombo
}, {
  'id': "c100",
  'ic': '💥',
  'name': '百连不破',
  'desc': "单场连击达到 100",
  'goal': 0x64,
  'get': _0x2a26ab => _0x2a26ab.stats.maxCombo
}, {
  'id': "c200",
  'ic': "🌪️",
  'name': '连击之神',
  'desc': "单场连击达到 200",
  'goal': 0xc8,
  'get': _0x51e13d => _0x51e13d.stats.maxCombo
}, {
  'id': "c300",
  'ic': '🌋',
  'name': "火山爆发",
  'desc': "单场连击达到 300，手已经不是自己的了",
  'goal': 0x12c,
  'get': _0x58773c => _0x58773c.stats.maxCombo
}, {
  'id': 'c500',
  'ic': '🌌',
  'name': "五百连击·手速成精",
  'desc': "单场连击达到 500",
  'goal': 0x1f4,
  'get': _0x2b1688 => _0x2b1688.stats.maxCombo
}, {
  'id': 's10k',
  'ic': '💯',
  'name': "万元户",
  'desc': "单场得分达到 10,000",
  'goal': 0x2710,
  'get': _0x102195 => _0x102195.stats.bestScore
}, {
  'id': "s30k",
  'ic': '💰',
  'name': "三万俱乐部",
  'desc': "单场得分达到 30,000",
  'goal': 0x7530,
  'get': _0x4d1ddd => _0x4d1ddd.stats.bestScore
}, {
  'id': "s50k",
  'ic': '🏆',
  'name': "五万分俱乐部",
  'desc': "单场得分达到 50,000",
  'goal': 0xc350,
  'get': _0x754f12 => _0x754f12.stats.bestScore
}, {
  'id': 's100k',
  'ic': '💎',
  'name': "十万大舞",
  'desc': '单场得分达到\x20100,000',
  'goal': 0x186a0,
  'get': _0x12f855 => _0x12f855.stats.bestScore
}, {
  'id': "s200k",
  'ic': '🚀',
  'name': "二十万传奇",
  'desc': "单场得分达到 200,000",
  'goal': 0x30d40,
  'get': _0x45eba3 => _0x45eba3.stats.bestScore
}, {
  'id': "s500k",
  'ic': '🌆',
  'name': "五十万霓虹之夜",
  'desc': "单场得分达到 500,000",
  'goal': 0x7a120,
  'get': _0x529450 => _0x529450.stats.bestScore
}, {
  'id': "s1m",
  'ic': '⚡',
  'name': "百万伏特",
  'desc': "单场得分突破 1,000,000",
  'goal': 0xf4240,
  'get': _0x188689 => _0x188689.stats.bestScore
}, {
  'id': "pf50",
  'ic': '🎯',
  'name': "准度初成",
  'desc': "累计 50 次 PERFECT",
  'goal': 0x32,
  'get': _0x4ebce4 => _0x4ebce4.stats.totalPerfect
}, {
  'id': "pf100",
  'ic': '🎯',
  'name': "完美主义",
  'desc': "累计 100 次 PERFECT",
  'goal': 0x64,
  'get': _0x24f3d8 => _0x24f3d8.stats.totalPerfect
}, {
  'id': "pf300",
  'ic': '🎯',
  'name': "完美大师",
  'desc': "累计 300 次 PERFECT",
  'goal': 0x12c,
  'get': _0x2b5334 => _0x2b5334.stats.totalPerfect
}, {
  'id': "pf500",
  'ic': '🎯',
  'name': '完美传说',
  'desc': "累计 500 次 PERFECT",
  'goal': 0x1f4,
  'get': _0x33761f => _0x33761f.stats.totalPerfect
}, {
  'id': "pf1000",
  'ic': '🎯',
  'name': "完美之神",
  'desc': "累计 1000 次 PERFECT",
  'goal': 0x3e8,
  'get': _0x2c1aeb => _0x2c1aeb.stats.totalPerfect
}, {
  'id': "pf2000",
  'ic': '🏹',
  'name': "两千发簪无虚发",
  'desc': "累计 2000 次 PERFECT",
  'goal': 0x7d0,
  'get': _0x52ffb2 => _0x52ffb2.stats.totalPerfect
}, {
  'id': "pf5000",
  'ic': '🔱',
  'name': "五线谱屠夫",
  'desc': "累计 5000 次 PERFECT",
  'goal': 0x1388,
  'get': _0x38d22c => _0x38d22c.stats.totalPerfect
}, {
  'id': "pf10000",
  'ic': '🛐',
  'name': "万 PERFECT 朝圣者",
  'desc': '累计\x2010000\x20次\x20PERFECT，建议挂号看看手',
  'goal': 0x2710,
  'get': _0x94bc34 => _0x94bc34.stats.totalPerfect
}, {
  'id': 'acc90',
  'ic': '📐',
  'name': "九成火候",
  'desc': '最佳准确率达到\x2090%',
  'goal': 0.9,
  'get': _0x3c71d8 => _0x3c71d8.stats.bestAcc
}, {
  'id': 'acc95',
  'ic': '🧊',
  'name': '冰稳',
  'desc': '最佳准确率达到\x2095%',
  'goal': 0.95,
  'get': _0x218295 => _0x218295.stats.bestAcc
}, {
  'id': "acc99",
  'ic': '🫠',
  'name': "逼死强迫症",
  'desc': "最佳准确率达到 99%——差一点点就全 PERFECT 了！",
  'goal': 0.99,
  'get': _0x35ff63 => _0x35ff63.stats.bestAcc
}, {
  'id': 'good100',
  'ic': '🌸',
  'name': "温柔判官",
  'desc': "累计打出 100 个 GOOD，手下留情",
  'goal': 0x64,
  'get': _0x575406 => _0x575406.stats.totalGood || 0x0
}, {
  'id': "good500",
  'ic': '🧘',
  'name': "佛系舞者",
  'desc': "累计 500 个 GOOD：能 PERFECT，但我偏不",
  'goal': 0x1f4,
  'get': _0x3f1050 => _0x3f1050.stats.totalGood || 0x0
}, {
  'id': "good2000",
  'ic': '☁️',
  'name': '老好人',
  'desc': "累计 2000 个 GOOD，箭头都被你感动了",
  'goal': 0x7d0,
  'get': _0x352f38 => _0x352f38.stats.totalGood || 0x0
}, {
  'id': "miss1",
  'ic': '🤭',
  'name': "脚滑初体验",
  'desc': "第一次 MISS，不丢人",
  'goal': 0x1,
  'get': _0x5c52d7 => _0x5c52d7.stats.totalMiss || 0x0
}, {
  'id': 'miss50',
  'ic': '🦥',
  'name': "地板艺术家",
  'desc': "累计 50 次 MISS，你跟地板挺熟？",
  'goal': 0x32,
  'get': _0x298c6c => _0x298c6c.stats.totalMiss || 0x0
}, {
  'id': "miss200",
  'ic': "🕳️",
  'name': "人体描边大师",
  'desc': '累计\x20200\x20次\x20MISS，箭箭擦身过',
  'goal': 0xc8,
  'get': _0x66dc48 => _0x66dc48.stats.totalMiss || 0x0
}, {
  'id': "miss500",
  'ic': '💀',
  'name': 'Miss\x20代言人',
  'desc': "累计 500 次 MISS，官方建议改玩连连看",
  'goal': 0x1f4,
  'get': _0x13ecf8 => _0x13ecf8.stats.totalMiss || 0x0
}, {
  'id': 'miss1000',
  'ic': '🪦',
  'name': "箭头终结者",
  'desc': '累计\x201000\x20次\x20MISS，箭头上辈子欠你的？',
  'goal': 0x3e8,
  'get': _0x3bba6b => _0x3bba6b.stats.totalMiss || 0x0
}, {
  'id': "worst30",
  'ic': '🤡',
  'name': "一场漏三十",
  'desc': "单场 MISS 30 个，眼睛：会了，手：没有",
  'goal': 0x1e,
  'get': _0x543283 => _0x543283.stats.worstMiss || 0x0
}, {
  'id': 'worst80',
  'ic': '🛌',
  'name': "你是不是睡着了",
  'desc': "单场 MISS 80 个，建议先把眼睛睁开",
  'goal': 0x50,
  'get': _0x39f676 => _0x39f676.stats.worstMiss || 0x0
}, {
  'id': "buy1",
  'ic': "🛍️",
  'name': "氪金第一步",
  'desc': "购买第一套涂装",
  'goal': 0x1,
  'get': _0xfa80ee => _0xfa80ee.owned.length - 0x1
}, {
  'id': "own4",
  'ic': '👕',
  'name': "时尚奶娃",
  'desc': "拥有 4 套涂装",
  'goal': 0x4,
  'get': _0xf97ef3 => _0xf97ef3.owned.length
}, {
  'id': "own8",
  'ic': '👔',
  'name': "衣帽间",
  'desc': "拥有 8 套涂装",
  'goal': 0x8,
  'get': _0x5b449e => _0x5b449e.owned.length
}, {
  'id': "own15",
  'ic': '🧥',
  'name': "穿搭博主",
  'desc': '拥有\x2015\x20套涂装',
  'goal': 0xf,
  'get': _0x77f728 => _0x77f728.owned.length
}, {
  'id': "ownall",
  'ic': '👑',
  'name': "涂装收藏家",
  'desc': "拥有全部涂装",
  'goal': SKINS.length,
  'get': _0x189a24 => _0x189a24.owned.length
}, {
  'id': "acc5",
  'ic': '🧢',
  'name': '小饰一桩',
  'desc': "拥有 5 件配饰",
  'goal': 0x5,
  'get': _0x255a97 => (_0x255a97.ownedAcc || []).length
}, {
  'id': "acc10",
  'ic': '🦸',
  'name': "花里胡哨",
  'desc': "拥有 10 件配饰，全身都挂满",
  'goal': 0xa,
  'get': _0xf3299 => (_0xf3299.ownedAcc || []).length
}, {
  'id': "accAll",
  'ic': '👛',
  'name': "行走的杂物间",
  'desc': "集齐全部配饰",
  'goal': ACCESSORIES.length,
  'get': _0x452ea6 => (_0x452ea6.ownedAcc || []).length
}, {
  'id': 'fc1',
  'ic': '✨',
  'name': "零失误",
  'desc': "完成一次全连（无 Miss）",
  'goal': 0x1,
  'get': _0x33a39c => _0x33a39c.stats.fullCombos
}, {
  'id': "fc5",
  'ic': '✨',
  'name': "稳定输出",
  'desc': '累计\x205\x20次全连',
  'goal': 0x5,
  'get': _0x1781e2 => _0x1781e2.stats.fullCombos
}, {
  'id': 'fc10',
  'ic': '🪩',
  'name': "全连机器",
  'desc': "累计 10 次全连",
  'goal': 0xa,
  'get': _0x52c172 => _0x52c172.stats.fullCombos
}, {
  'id': "fc30",
  'ic': '🧿',
  'name': "闭着眼也全连",
  'desc': "累计 30 次全连",
  'goal': 0x1e,
  'get': _0x18f054 => _0x18f054.stats.fullCombos
}, {
  'id': "ss1",
  'ic': '🏅',
  'name': "初露锋芒",
  'desc': '获得一次\x20SS\x20评级',
  'goal': 0x1,
  'get': _0x2dfbf2 => _0x2dfbf2.stats.ssCount
}, {
  'id': "ss5",
  'ic': '🥇',
  'name': "SS 专业户",
  'desc': '累计\x205\x20次\x20SS\x20评级',
  'goal': 0x5,
  'get': _0x16a01f => _0x16a01f.stats.ssCount
}, {
  'id': "ss20",
  'ic': '🧼',
  'name': "SS 洗手池",
  'desc': "累计 20 次 SS 评级，全是 SS",
  'goal': 0x14,
  'get': _0x310e0d => _0x310e0d.stats.ssCount
}, {
  'id': 'coin1k',
  'ic': '🪙',
  'name': "小富婆",
  'desc': "累计获得 1000 奶币",
  'goal': 0x3e8,
  'get': _0x1964d6 => _0x1964d6.stats.totalCoins
}, {
  'id': "coin5k",
  'ic': '🪙',
  'name': "大富翁",
  'desc': '累计获得\x205000\x20奶币',
  'goal': 0x1388,
  'get': _0x5bbd0f => _0x5bbd0f.stats.totalCoins
}, {
  'id': "coin10k",
  'ic': '🏦',
  'name': "奶币银行家",
  'desc': '累计获得\x201\x20万奶币',
  'goal': 0x2710,
  'get': _0x11a76f => _0x11a76f.stats.totalCoins
}, {
  'id': "coin50k",
  'ic': '🤑',
  'name': "见钱眼开",
  'desc': "累计获得 5 万奶币",
  'goal': 0xc350,
  'get': _0x3d21ed => _0x3d21ed.stats.totalCoins
}, {
  'id': "coin100k",
  'ic': '🐳',
  'name': "奶币巨鲸",
  'desc': '累计获得\x2010\x20万奶币',
  'goal': 0x186a0,
  'get': _0x29ec64 => _0x29ec64.stats.totalCoins
}, {
  'id': "climb1",
  'ic': '🧗',
  'name': "说你呢别爬了",
  'desc': "奶娃第一次被 MISS 到爬杆",
  'goal': 0x1,
  'get': _0x3bde46 => _0x3bde46.stats.climbCount || 0x0
}, {
  'id': "climb10",
  'ic': '🐒',
  'name': "爬杆常客",
  'desc': "奶娃累计爬杆 10 次，它是属猴的吧",
  'goal': 0xa,
  'get': _0x4fd085 => _0x4fd085.stats.climbCount || 0x0
}, {
  'id': "poke10",
  'ic': '👆',
  'name': "哄娃新手",
  'desc': "演出中点击奶娃安抚 10 次",
  'goal': 0xa,
  'get': _0x268416 => _0x268416.stats.pokeCount || 0x0
}, {
  'id': "poke50",
  'ic': '💆',
  'name': '奶娃按摩师',
  'desc': "演出中点击奶娃安抚 50 次",
  'goal': 0x32,
  'get': _0x8c7cf0 => _0x8c7cf0.stats.pokeCount || 0x0
}, {
  'id': 'pv30',
  'ic': '🎧',
  'name': "选择困难症",
  'desc': "试听歌曲 30 次，还没决定跳哪首？",
  'goal': 0x1e,
  'get': _0x1d023c => _0x1d023c.stats.previewCount || 0x0
}, {
  'id': 'up1',
  'ic': "🎚️",
  'name': "原创 DJ",
  'desc': "上传第一首自己的歌",
  'goal': 0x1,
  'get': _0x3cb774 => _0x3cb774.stats.uploadCount || 0x0
}, {
  'id': "streak3",
  'ic': '📅',
  'name': "三连打卡",
  'desc': "连续 3 天都来蹦迪",
  'goal': 0x3,
  'get': _0x18b8fa => _0x18b8fa.stats.loginStreak || 0x0
}, {
  'id': 'streak7',
  'ic': '📆',
  'name': "周末也蹦",
  'desc': "连续 7 天都来蹦迪",
  'goal': 0x7,
  'get': _0x44e8dd => _0x44e8dd.stats.loginStreak || 0x0
}, {
  'id': 'streak30',
  'ic': "🗓️",
  'name': "月度全勤舞者",
  'desc': "连续 30 天打卡，比上班还积极",
  'goal': 0x1e,
  'get': _0x2d0e29 => _0x2d0e29.stats.loginStreak || 0x0
}];
let sel = {
    'diff': "chart",
    'song': "default"
  },
  mainRef = null;
export function initUI(_0x35588b) {
  mainRef = _0x35588b;
  const _0x382c24 = Store.data;
  document.querySelectorAll('[data-scr]').forEach(_0x13f9c0 => {
    _0x13f9c0.addEventListener('click', () => {
      sfxClick();
      const _0x170e1a = _0x13f9c0.dataset.scr;
      if (curScr === 'scr-mp' && _0x170e1a !== "scr-mp") {}
      _0x170e1a === "scr-play" && (renderPlay(), void 0);
      if (_0x170e1a === "scr-shop") renderShop();
      if (_0x170e1a === "scr-ach") renderAch();
      if (_0x170e1a === 'scr-rank') renderRank();
      if (_0x170e1a === 'scr-home') renderHome();
      showScreen(_0x170e1a);
    });
  }), document.getElementById("btnGoPlay").addEventListener("click", () => {
    sfxClick(), renderPlay(), showScreen("scr-play");
  }), document.querySelectorAll("[data-back]").forEach(_0xdb0ae9 => {
    _0xdb0ae9.addEventListener("click", () => {
      sfxClick(), showScreen('scr-home'), renderHome();
    });
  }), bindSettings(), document.getElementById("btnRetry").addEventListener("click", () => {
    sfxClick(), startShow();
  }), document.getElementById('btnBackHome').addEventListener("click", () => {
    sfxClick(), showScreen("scr-home"), renderHome();
  }), document.getElementById("btnStart").addEventListener("click", () => {
    sfxClick(), ensureCtx(), startShow();
  });
  const _0x43727c = document.getElementById('btnPlayBack');
  if (_0x43727c) _0x43727c.addEventListener("click", () => {
    sfxClick(), showScreen('scr-home'), renderHome();
  });
  const _0x4b827f = document.getElementById("btnUploadSong"),
    _0xc14aea = document.getElementById("fileSong");
  _0x4b827f && _0x4b827f.addEventListener('click', () => {
    sfxClick(), openCustomModal();
  });
  _0xc14aea && _0xc14aea.addEventListener("change", async _0x15020 => {
    const _0x3fc9d5 = Array.from(_0x15020.target.files);
    _0x15020.target.value = '';
    if (_0x3fc9d5.length) await handleCustomUpload(_0x3fc9d5);
  });
  _0xc14aea && _0xc14aea.addEventListener('click', () => {
    sfxClick();
  });
  const _0x22fec2 = document.getElementById("cmClose");
  if (_0x22fec2) _0x22fec2.addEventListener("click", () => {
    sfxClick(), closeCustomModal();
  });
  const _0xdd6111 = document.getElementById('customModal');
  if (_0xdd6111) _0xdd6111.addEventListener('click', _0x5f1b66 => {
    if (_0x5f1b66.target === _0xdd6111) closeCustomModal();
  });
  document.getElementById("btnResume").addEventListener("click", () => {
    mainRef.resume(), document.getElementById("pauseOv").classList.remove('on');
  }), document.getElementById('btnRestart').addEventListener("click", async () => {
    const _0x42d844 = await askConfirm("确定重新开始吗？当前进度会清空");
    if (!_0x42d844) return;
    document.getElementById("pauseOv").classList.remove('on'), mainRef.resume(), startShow();
  }), document.getElementById('btnQuit').addEventListener("click", async () => {
    const _0xf2e7d8 = await askConfirm("确定退出演出吗？");
    if (!_0xf2e7d8) return;
    document.getElementById("pauseOv").classList.remove('on');
    if (mainRef.quitShow()) return;
    showScreen("scr-home"), renderHome();
  }), document.getElementById('btnPause').addEventListener("click", () => {
    const _0x2f0127 = document.getElementById("pauseOv");
    Game.paused ? (mainRef.resume(), _0x2f0127.classList.remove('on')) : (pauseGame(), _0x2f0127.classList.add('on'));
  }), document.getElementById("btnQuitDirect").addEventListener("click", async () => {
    const _0x19b22e = await askConfirm('确定退出演出吗？');
    if (!_0x19b22e) return;
    document.getElementById("pauseOv").classList.remove('on');
    if (mainRef.quitShow()) return;
    showScreen('scr-home'), renderHome();
  }), document.querySelectorAll("#rankTabs button").forEach(_0x5effc5 => {
    _0x5effc5.addEventListener("click", () => {
      document.querySelectorAll('#rankTabs\x20button').forEach(_0x5c5f36 => _0x5c5f36.classList.remove('cur')), _0x5effc5.classList.add('cur'), renderRank();
    });
  }), applyVolume(), applyPadSize(), applyPadGap(), applySwipeMode(), renderHome();
  const _0x158c38 = document.getElementById("songSearch");
  if (_0x158c38) _0x158c38.oninput = () => {
    songQ = _0x158c38.value, renderPlay();
  };
}
export function showScreen(_0x530cd8) {
  if (curScr === 'scr-play' && _0x530cd8 !== "scr-play") stopPreview();
  curScr = _0x530cd8, document.querySelectorAll(".screen").forEach(_0x8fcca8 => _0x8fcca8.classList.toggle("cur", _0x8fcca8.id === _0x530cd8)), document.querySelectorAll("#mainNav button").forEach(_0xa99b69 => _0xa99b69.classList.toggle("cur", _0xa99b69.dataset.scr === _0x530cd8)), requestAnimationFrame(updateQuickScroll);
}
let curScr = "scr-home",
  updateQuickScroll = () => {};
function initQuickScroll() {
  const _0x4a34e3 = document.getElementById("quickScroll");
  if (!_0x4a34e3) return;
  const _0x1aa260 = document.getElementById('qsTop'),
    _0x17fa31 = document.getElementById("qsBot");
  let _0x41bf9a = null,
    _0x1cd131 = false;
  function _0x5c73c7() {
    _0x1cd131 = false;
    const _0x551d1f = document.querySelector(".screen.cur");
    _0x41bf9a = _0x551d1f;
    const _0x226189 = document.getElementById("stageUI")?.["classList"]["contains"]('on');
    if (!_0x551d1f || _0x226189) {
      _0x4a34e3.classList.remove('on');
      return;
    }
    const _0x26662e = _0x551d1f.scrollHeight - _0x551d1f.clientHeight;
    if (_0x26662e < 0x28) {
      _0x4a34e3.classList.remove('on');
      return;
    }
    _0x4a34e3.classList.add('on'), _0x1aa260.classList.toggle("dim", _0x551d1f.scrollTop < 0x8), _0x17fa31.classList.toggle("dim", _0x551d1f.scrollTop > _0x26662e - 0x8);
  }
  const _0xb887cb = () => {
    !_0x1cd131 && (_0x1cd131 = true, requestAnimationFrame(_0x5c73c7));
  };
  document.addEventListener("scroll", _0xb887cb, true);
  if (window.ResizeObserver) {
    const _0x3e3092 = new ResizeObserver(_0xb887cb);
    document.querySelectorAll('.screen').forEach(_0x55bc75 => _0x3e3092.observe(_0x55bc75));
  }
  _0x1aa260.addEventListener('click', () => {
    sfxClick(), _0x41bf9a && _0x41bf9a.scrollTo({
      'top': 0x0,
      'behavior': "smooth"
    }), _0x1687f3();
  }), _0x17fa31.addEventListener('click', () => {
    sfxClick(), _0x41bf9a && _0x41bf9a.scrollTo({
      'top': _0x41bf9a.scrollHeight,
      'behavior': "smooth"
    }), _0x1687f3();
  });
  function _0x1687f3() {
    _0xb887cb(), setTimeout(_0xb887cb, 0x15e), setTimeout(_0xb887cb, 0x320);
  }
  updateQuickScroll = _0x5c73c7, _0xb887cb();
}
export function showUIRoot(_0x4d9257) {
  document.getElementById('uiRoot').classList.toggle('on', _0x4d9257);
}
export function showStageUI(_0x430416) {
  document.getElementById('stageUI').classList.toggle('on', _0x430416);
}
export function renderHome() {
  const _0x2810c1 = Store.data.stats;
  document.getElementById("stPlays").textContent = _0x2810c1.plays, document.getElementById('stBest').textContent = _0x2810c1.bestScore.toLocaleString(), document.getElementById('stCombo').textContent = _0x2810c1.maxCombo, document.getElementById("stPerf").textContent = _0x2810c1.totalPerfect, document.getElementById("coinNum").textContent = Store.data.coins.toLocaleString();
  const _0x3e9e27 = document.getElementById('homePlayerId');
  if (_0x3e9e27) _0x3e9e27.textContent = Store.data.playerId || '------';
  const _0x5a171c = document.getElementById("homeTier");
  if (_0x5a171c) {
    const _0x4f43bd = seasonTier();
    _0x5a171c.textContent = _0x4f43bd.icon + '\x20' + _0x4f43bd.name;
  }
  const _0x448653 = document.getElementById('seasonBanner');
  if (_0x448653) {
    const _0xe2b34f = seasonTier();
    _0x448653.textContent = "🏆 本赛季「" + _0xe2b34f.seasonName + "」 · " + _0xe2b34f.range;
  }
}
function allChartSongs() { return [...SONGS, ...(Store.data.chartSongs || [])]; }
function renderPlay() {
  document.getElementById('playKeyTip').textContent = Store.data.set.keys.map((code, index) => 'key' + (index + 1) + ': ' + keyLabel(code)).join(' · ') + ' · 长条按住至结束 · 设置中可修改键位和判定延迟';
  const grid = document.getElementById('songGrid');
  grid.innerHTML = '';
  const query = songQ.trim().toLowerCase();
  const songs = allChartSongs().filter(song => (song.name + ' ' + song.artist + ' ' + (song.version || '')).toLowerCase().includes(query));
  for (const song of songs) {
    const card = document.createElement('div');
    card.className = 'theme-card song-card' + (sel.song === song.id ? ' sel' : '');
    card.style.background = song.chartFile ? 'linear-gradient(135deg,#7a4dffcc,#36d1ffcc)' : 'linear-gradient(135deg,#ff6b6bcc,#ffa751cc)';
    card.innerHTML = '<div class="tname">🎵 ' + escHtml(song.name) + '</div><div class="tdesc">' + escHtml(song.artist) + ' · ' + song.bpm + ' BPM<br>' + escHtml(song.desc) + '</div><div class="cs-actions"><button class="pv-btn' + (pvSongId === song.id ? ' on' : '') + '" data-pv="' + song.id + '">' + (pvSongId === song.id ? '⏸ 正在播放' : '▶ 试听') + '</button>' + (song.chartFile ? '' : '<button class="cs-del" title="删除谱面">🗑</button>') + '</div>' + (sel.song === song.id ? '<span class="tag">✓ 已选</span>' : '');
    card.onclick = () => { sfxClick(); stopPreview(); sel.song = song.id; renderPlay(); };
    card.querySelector('[data-pv]').onclick = event => { event.stopPropagation(); previewSong(song); };
    const del = card.querySelector('.cs-del');
    if (del) del.onclick = async event => { event.stopPropagation(); await deleteChart(song); };
    grid.appendChild(card);
  }
  if (!songs.length) grid.innerHTML = '<div class="rank-empty">没有匹配的谱面</div>';
}
async function deleteChart(song) {
  if (!await askConfirm('删除导入的谱面「' + song.name + '」？')) return;
  await CustomStore.remove(song.id);
  Store.data.chartSongs = (Store.data.chartSongs || []).filter(item => item.id !== song.id);
  Store.save(); if (sel.song === song.id) sel.song = SONGS[0].id;
  stopPreview(); renderPlay(); renderCustomList(); toast('已删除谱面');
}
let pvSongId = null, songQ = '';
async function previewSong(_0x4f8d72) {
  if (pvSongId === _0x4f8d72.id) {
    sfxClick(), stopPreview();
    return;
  }
  sfxClick(), pvSongId = _0x4f8d72.id, Store.data.stats.previewCount = (Store.data.stats.previewCount || 0x0) + 0x1, Store.save();
  let _0x53ffd9 = _0x4f8d72.file;
  if (/^chart_/.test(_0x4f8d72.id)) {
    const _0x8a69ff = await CustomStore.get(_0x4f8d72.id);
    if (pvSongId !== _0x4f8d72.id) return;
    if (!_0x8a69ff) {
      pvSongId = null, toast("歌曲文件缺失，请重新上传");
      return;
    }
    _0x53ffd9 = _0x8a69ff.dataUrl;
  }
  setMenuBgmVolume(0.08), Preview.play(_0x53ffd9, _0x4f8d72.id, _0x4f8d72.previewStart, () => {
    pvSongId = null, setMenuBgmVolume(Store.data.set.vol), document.querySelectorAll("[data-pv]").forEach(_0x5543cd => {
      _0x5543cd.classList.remove('on'), _0x5543cd.textContent = '▶\x20试听';
    });
  }), document.querySelectorAll('[data-pv]').forEach(_0x3c0a90 => {
    const _0xbe45b8 = _0x3c0a90.dataset.pv === _0x4f8d72.id;
    _0x3c0a90.classList.toggle('on', _0xbe45b8), _0x3c0a90.textContent = _0xbe45b8 ? "⏸ 正在播放" : '▶\x20试听';
  });
}
function stopPreview() {
  if (pvSongId) Preview.stop();
}
export function getSelection() {
  return sel;
}
let startingShow = false;
const builtinCharts = new Map();
export async function startShow() {
  if (startingShow) return;
  startingShow = true; stopPreview();
  try {
    const song = allChartSongs().find(item => item.id === sel.song) || SONGS[0];
    let chart, audio;
    if (song.chartFile) {
      if (!builtinCharts.has(song.id)) {
        const response = await fetch(song.chartFile);
        if (!response.ok) throw new Error('默认谱面读取失败');
        builtinCharts.set(song.id, parseMalody(await response.text()));
      }
      chart = builtinCharts.get(song.id); audio = song.file;
    } else {
      const stored = await CustomStore.get(song.id);
      if (!stored?.chart) throw new Error('谱面文件缺失，请重新导入');
      chart = stored.chart; audio = stored.dataUrl;
    }
    await mainRef.startShow(song, audio, chart);
  } catch (error) { toast(error.message || '谱面加载失败'); }
  finally { startingShow = false; }
}
function openCustomModal() {
  const _0x332164 = document.getElementById('customModal');
  if (!_0x332164) return;
  renderCustomList(), _0x332164.classList.add('on');
}
function closeCustomModal() {
  const _0xac118f = document.getElementById("customModal");
  if (_0xac118f) _0xac118f.classList.remove('on');
}
function renderCustomList() {
  const list = document.getElementById('cmList');
  if (!list) return;
  list.innerHTML = '';
  const songs = Store.data.chartSongs || [];
  if (!songs.length) { list.innerHTML = '<div class="cm-empty">还没有导入谱面，同时选择 .mc 和它对应的音乐文件吧～</div>'; return; }
  songs.forEach(song => {
    const item = document.createElement('div'); item.className = 'cm-item';
    item.innerHTML = '<div class="cm-info"><div class="cm-name">🎵 ' + escHtml(song.name) + '</div><div class="cm-meta">' + escHtml(song.desc) + '</div></div><button class="cm-use">选它</button><button class="cm-del">🗑</button>';
    item.querySelector('.cm-use').onclick = () => { sel.song = song.id; closeCustomModal(); renderPlay(); };
    item.querySelector('.cm-del').onclick = () => deleteChart(song);
    list.appendChild(item);
  });
}
async function handleCustomUpload(files) {
  const input = document.getElementById('fileSong');
  const progress = document.getElementById('cmProgress');
  const pick = document.getElementById('cmPick');
  input.disabled = true; pick.classList.add('busy'); progress.classList.add('on');
  progress.querySelector('.cm-label').textContent = '读取谱面与配套音乐中…';
  progress.querySelector('.cm-bar').style.width = '35%';
  try {
    const imported = await importMalodyFiles(files);
    for (const entry of imported) {
      const chart = entry.chart;
      const id = 'chart_' + Array.from(crypto.getRandomValues(new Uint8Array(16)), byte => byte.toString(16).padStart(2, '0')).join('');
      const meta = { id, name: chart.name, artist: chart.artist, bpm: chart.bpm,
        version: chart.version, dur: entry.duration, previewStart: chart.previewStart,
        desc: chart.version + ' · ' + chart.notes.length + ' notes · ' + chart.notes.filter(note => note.len).length + ' 长条' };
      await CustomStore.saveChart(meta, entry.dataUrl, chart);
      Store.data.chartSongs = Store.data.chartSongs || []; Store.data.chartSongs.push(meta);
      Store.data.stats.uploadCount = (Store.data.stats.uploadCount || 0) + 1;
      sel.song = id; Store.save();
    }
    renderCustomList(); renderPlay(); sfxCoin(); toast('已导入 ' + imported.length + ' 个 4Key 谱面');
  } catch (error) { toast('导入失败：' + error.message); }
  finally { input.disabled = false; pick.classList.remove('busy'); progress.classList.remove('on'); }
}
const SHOP_CATEGORIES = [
  { id: 'paint', name: '🎨 身体涂装', tip: '改变奶娃的身体颜色', items: () => SKINS.filter(item => !item.fx) },
  { id: 'transform', name: '✨ 全身变身', tip: '从头到脚换一个造型', items: () => SKINS.filter(item => item.fx) },
  { id: 'head', name: '👑 头部配饰', tip: '戴在奶娃头上的小装饰', items: () => ACCESSORIES.filter(item => item.slot === 'head') },
  { id: 'body', name: '🛡️ 身体配饰', tip: '挂在奶娃身上的装饰', items: () => ACCESSORIES.filter(item => item.slot === 'body') },
  { id: 'cape', name: '🦸 披风斗篷', tip: '给奶娃披上一个新造型', items: () => ACCESSORIES.filter(item => item.slot === 'cape') }
];
let shopCategory = 'paint';
function renderShop() {
  const _0x154392 = document.getElementById('shopGrid');
  const _0x56ffd6 = Store.data;
  const category = SHOP_CATEGORIES.find(item => item.id === shopCategory);
  const tabs = document.getElementById('shopTabs');
  tabs.innerHTML = '';
  SHOP_CATEGORIES.forEach(item => {
    const tab = document.createElement('button');
    tab.id = 'shop-tab-' + item.id;
    tab.type = 'button';
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', 'shopGrid');
    tab.setAttribute('aria-selected', String(item.id === shopCategory));
    tab.tabIndex = item.id === shopCategory ? 0 : -1;
    tab.className = 'shop-tab' + (item.id === shopCategory ? ' cur' : '');
    tab.innerHTML = item.name + '<span class="shop-count">' + item.items().length + '</span>';
    tab.onclick = () => {
      sfxClick(); shopCategory = item.id; renderShop();
      document.getElementById(tab.id).focus();
    };
    tab.onkeydown = event => {
      const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
      if (!step && event.key !== 'Home' && event.key !== 'End') return;
      event.preventDefault();
      const index = SHOP_CATEGORIES.findIndex(entry => entry.id === item.id);
      shopCategory = SHOP_CATEGORIES[event.key === 'Home' ? 0 : event.key === 'End' ? SHOP_CATEGORIES.length - 1 : (index + step + SHOP_CATEGORIES.length) % SHOP_CATEGORIES.length].id;
      renderShop(); document.getElementById('shop-tab-' + shopCategory).focus();
    };
    tabs.appendChild(tab);
  });
  document.getElementById('shopCategoryName').textContent = category.name;
  document.getElementById('shopCategoryTip').textContent = category.tip;
  _0x154392.setAttribute('aria-labelledby', 'shop-tab-' + shopCategory);
  _0x154392.innerHTML = '';
  if (shopCategory === 'paint' || shopCategory === 'transform') {
    category.items().forEach(_0x22fc73 => {
    const _0x36c7ee = _0x56ffd6.owned.includes(_0x22fc73.id),
      _0x4ba352 = _0x56ffd6.equipped === _0x22fc73.id,
      _0x35360e = document.createElement('div');
    _0x35360e.className = "card skin-card";
    const _0x25188f = '#' + _0x22fc73.colors.head.toString(0x10).padStart(0x6, '0'),
      _0x1d5347 = '#' + _0x22fc73.colors.belly.toString(0x10).padStart(0x6, '0'),
      _0x103de9 = _0x22fc73.glow ? "0 0 18px #" + _0x22fc73.glow.toString(0x10).padStart(0x6, '0') + 'aa,' : '',
      _0x42e75f = _0x22fc73.emoji ? "<span style=\"position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:34px;filter:drop-shadow(0 2px 3px #0008)\">" + _0x22fc73.emoji + "</span>" : '',
      _0x1d5a34 = "<div class=\"preview-ball\" style=\"position:relative;background:radial-gradient(circle at 35% 30%," + _0x25188f + ',' + _0x1d5347 + ");box-shadow:" + _0x103de9 + "inset 0 -6px 14px #00000044\">" + _0x42e75f + '</div>';
    let _0x104e73;
    if (_0x4ba352) _0x104e73 = '<button\x20class=\x22buy\x20use\x22\x20disabled>✓\x20使用中</button>';else _0x36c7ee ? _0x104e73 = '<button\x20class=\x22buy\x20use\x22\x20data-act=\x22equip\x22\x20data-id=\x22' + _0x22fc73.id + "\">装备</button>" : _0x104e73 = "<button class=\"buy\" data-act=\"buy\" data-id=\"" + _0x22fc73.id + "\">🪙 " + _0x22fc73.price + " 购买</button>";
    _0x35360e.innerHTML = "\n      " + (_0x4ba352 ? "<div class=\"ribbon\">已装备</div>" : '') + "\n      " + _0x1d5a34 + '\x0a\x20\x20\x20\x20\x20\x20<div\x20class=\x22sname\x22>' + _0x22fc73.name + "</div>\n      <div class=\"sdesc\">" + _0x22fc73.desc + "</div>\n      " + _0x104e73 + "\n    ", _0x154392.appendChild(_0x35360e);
  });
  } else {
    const _0x3e554e = category;
    category.items().forEach(_0x39fed2 => {
      const _0x301933 = _0x56ffd6.ownedAcc.includes(_0x39fed2.id),
        _0x3e98f8 = _0x56ffd6.accEquipped[_0x3e554e.id] === _0x39fed2.id,
        _0x29f351 = document.createElement("div");
      _0x29f351.className = "card acc-card";
      const _0x3a1190 = '#' + (_0x39fed2.color ?? 0x888888).toString(0x10).padStart(0x6, '0'),
        _0x4a4f8e = "<div class=\"acc-icon\" style=\"background:" + _0x3a1190 + "22;border:2px solid " + _0x3a1190 + '\x22>' + _0x39fed2.icon + '</div>';
      let _0x219278;
      if (_0x3e98f8) _0x219278 = "<button class=\"buy use\" disabled>✓ 已装备</button>";else _0x301933 ? _0x219278 = "<button class=\"buy use\" data-act=\"acc-equip\" data-id=\"" + _0x39fed2.id + '\x22\x20data-slot=\x22' + _0x3e554e.id + "\">装备</button>" : _0x219278 = '<button\x20class=\x22buy\x22\x20data-act=\x22acc-buy\x22\x20data-id=\x22' + _0x39fed2.id + "\">🪙 " + _0x39fed2.price + " 购买</button>";
      _0x29f351.innerHTML = "\n        " + (_0x3e98f8 ? "<div class=\"ribbon\">已装备</div>" : '') + "\n        " + _0x4a4f8e + "\n        <div class=\"sname\">" + _0x39fed2.name + '</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22sdesc\x22>' + _0x39fed2.desc + '</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + _0x219278 + "\n      ", _0x154392.appendChild(_0x29f351);
    });
  }
  document.querySelectorAll("#scr-shop button[data-act]").forEach(_0x13e6cc => {
    _0x13e6cc.onclick = () => {
      const _0x553ec8 = _0x13e6cc.dataset.id,
        _0x4198c8 = _0x13e6cc.dataset.act;
      if (_0x4198c8 === 'buy') {
        const _0x5ad0a6 = SKINS.find(_0x3756f4 => _0x3756f4.id === _0x553ec8);
        if (!_0x5ad0a6) return;
        if (Store.data.coins < _0x5ad0a6.price) {
          toast('奶币不足，还差\x20' + (_0x5ad0a6.price - Store.data.coins) + " 🪙"), sfxMiss();
          return;
        }
        Store.data.coins -= _0x5ad0a6.price, Store.data.owned.push(_0x553ec8), Store.save(), sfxCoin(), toast("🛍️ 购入「" + _0x5ad0a6.name + '」！'), renderShop(), renderHome();
      } else {
        if (_0x4198c8 === 'equip') {
          const _0x4ece68 = SKINS.find(_0x5bdf48 => _0x5bdf48.id === _0x553ec8);
          if (!_0x4ece68) return;
          Store.data.equipped = _0x553ec8, Store.save();
          if (mainRef.applySkin) mainRef.applySkin(_0x4ece68);
          sfxClick(), toast("👕 已换装：" + _0x4ece68.name), renderShop();
        } else {
          if (_0x4198c8 === 'acc-buy') {
            const _0x5beb1c = ACCESSORIES.find(_0x50b8e5 => _0x50b8e5.id === _0x553ec8);
            if (!_0x5beb1c) return;
            if (Store.data.coins < _0x5beb1c.price) {
              toast("奶币不足，还差 " + (_0x5beb1c.price - Store.data.coins) + " 🪙"), sfxMiss();
              return;
            }
            Store.data.coins -= _0x5beb1c.price, Store.data.ownedAcc.push(_0x553ec8), Store.save(), sfxCoin(), toast('🛍️\x20购入「' + _0x5beb1c.name + '」！'), renderShop(), renderHome();
          } else {
            if (_0x4198c8 === "acc-equip") {
              const _0xd3b55e = ACCESSORIES.find(_0x6c72f => _0x6c72f.id === _0x553ec8);
              if (!_0xd3b55e) return;
              Store.data.accEquipped[_0x13e6cc.dataset.slot] = _0x553ec8, Store.save();
              if (mainRef.applyAccessories) mainRef.applyAccessories();
              sfxClick(), toast("🎀 已装备：" + _0xd3b55e.name), renderShop();
            } else {
              {
                if (_0x4198c8 === 'clear-look') {
                  Store.data.equipped = SKINS[0x0].id, Store.data.accEquipped = {
                    'head': null,
                    'body': null,
                    'cape': null
                  }, Store.save();
                  if (mainRef.applySkin) mainRef.applySkin(SKINS[0x0]);
                  if (mainRef.applyAccessories) mainRef.applyAccessories();
                  sfxClick(), toast("🚫 已清空装扮，恢复奶娃本色"), renderShop(), renderHome();
                }
              }
            }
          }
        }
      }
    };
  });
}
function renderAch() {
  const _0x2ff825 = document.getElementById("achList");
  _0x2ff825.innerHTML = '';
  const _0xa447ec = Store.data;
  ACHS.forEach(_0x560eb1 => {
    const _0x56ac67 = Math.min(_0x560eb1.get(_0xa447ec), _0x560eb1.goal),
      _0x23195f = _0x56ac67 >= _0x560eb1.goal,
      _0x3b23df = _0x560eb1.goal > 0x0 && _0x560eb1.goal <= 0x1,
      _0x39e8da = _0x39272a => _0x3b23df ? Math.round(_0x39272a * 0x64) + '%' : Math.floor(_0x39272a).toLocaleString(),
      _0x312b93 = document.createElement("div");
    _0x312b93.className = "ach-item" + (_0x23195f ? " done" : ''), _0x312b93.innerHTML = "\n      <div class=\"ai\">" + _0x560eb1.ic + "</div>\n      <div class=\"amid\">\n        <div class=\"aname\">" + _0x560eb1.name + '\x20' + (_0x23195f ? '✓' : '') + "</div>\n        <div class=\"adesc\">" + _0x560eb1.desc + '</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22abar\x22><i\x20style=\x22width:' + _0x56ac67 / _0x560eb1.goal * 0x64 + "%\"></i></div>\n      </div>\n      <div class=\"aright\">" + (_0x23195f ? '已完成' : _0x39e8da(_0x56ac67) + " / " + _0x39e8da(_0x560eb1.goal)) + "</div>", _0x2ff825.appendChild(_0x312b93);
  });
}
const songName = id => (allChartSongs().find(song => song.id === id) || {}).name || id;
function displayName() {
  return Store.data.name || '奶娃' + (Store.data.playerId || "XXXXXX").slice(-0x4);
}
function renderRank() {
  const tabs = document.getElementById('rankTabs');
  tabs.innerHTML = '';
  allChartSongs().forEach((song, index) => {
    const button = document.createElement('button'); button.textContent = song.name + ' · ' + (song.version || '4Key');
    button.dataset.d = song.id; if (!index) button.classList.add('cur');
    button.onclick = () => { tabs.querySelectorAll('button').forEach(item => item.classList.remove('cur')); button.classList.add('cur'); renderRankList(song.id); };
    tabs.appendChild(button);
  });
  renderRankList(SONGS[0].id);
}
function renderRankList(_0x79265a) {
  const _0x2f7c90 = document.getElementById("rankList");
  _0x2f7c90.innerHTML = '';
  const _0x286fc6 = [...(Store.data.chartScores?.[_0x79265a] || [])].sort((_0x23e78f, _0x41a903) => _0x41a903.score - _0x23e78f.score).slice(0x0, 0x5);
  if (!_0x286fc6.length) {
    _0x2f7c90.innerHTML = "<div class=\"rank-empty\">暂无纪录 —— 上去就是第一名！</div>";
    return;
  }
  _0x286fc6.forEach((_0x500199, _0x4402ff) => {
    const _0x1b7333 = document.createElement("div");
    _0x1b7333.className = "rank-row" + (_0x4402ff === 0x0 ? " top1" : ''), _0x1b7333.innerHTML = "<div class=\"no\">" + (_0x4402ff === 0x0 ? '🥇' : _0x4402ff === 0x1 ? '🥈' : _0x4402ff === 0x2 ? '🥉' : _0x4402ff + 0x1) + "</div>\n      <div class=\"rsc\">" + _0x500199.score.toLocaleString() + '</div>\x0a\x20\x20\x20\x20\x20\x20<div\x20class=\x22rmeta\x22>连击\x20×' + _0x500199.combo + " · " + _0x500199.date + "</div>\n      <div class=\"rrank\">" + _0x500199.rank + "</div>", _0x2f7c90.appendChild(_0x1b7333);
  });
}
function escHtml(_0x1d4457) {
  return String(_0x1d4457).replace(/[&<>"']/g, _0x18c845 => ({
    '&': "&amp;",
    '<': "&lt;",
    '>': "&gt;",
    '\x22': "&quot;",
    '\x27': "&#39;"
  })[_0x18c845]);
}
function bindKeySettings() {
  const buttons = [...document.querySelectorAll('[data-key-slot]')];
  const tip = document.getElementById('keyBindingTip');
  const help = '从左到右对应 key1～key4。点击按钮后按下新键，Esc 取消；键位自动保存。';
  let listening = null;
  const render = () => buttons.forEach((button, index) => {
    button.querySelector('b').textContent = listening === index ? '请按键…' : keyLabel(Store.data.set.keys[index]);
    button.classList.toggle('listening', listening === index);
  });
  buttons.forEach((button, index) => {
    button.onclick = () => { listening = index; tip.textContent = '正在绑定 key' + (index + 1) + '，请按一个新键（Esc 取消）'; render(); };
    button.onblur = () => { if (listening === index) { listening = null; tip.textContent = help; render(); } };
    button.onkeydown = event => {
      if (listening !== index) return;
      event.preventDefault(); event.stopPropagation();
      if (event.repeat) return;
      if (event.code === 'Escape') { listening = null; tip.textContent = help; render(); return; }
      if (event.ctrlKey || event.altKey || event.metaKey || !isBindableKey(event.code)) {
        tip.textContent = '请选择普通单键；Esc、Tab 和组合键不用于轨道绑定。'; return;
      }
      const occupied = Store.data.set.keys.indexOf(event.code);
      if (occupied !== -1 && occupied !== index) {
        tip.textContent = '这个键已绑定 key' + (occupied + 1) + '，请换一个键。'; return;
      }
      Store.data.set.keys[index] = event.code; Store.save(); listening = null;
      tip.textContent = 'key' + (index + 1) + ' 已绑定为 ' + keyLabel(event.code); render();
    };
  });
  render();
}
function bindSettings() {
  bindKeySettings();
  const _0x224649 = Store.data.set,
    _0x3f3ed7 = _0x41e1a3 => document.getElementById(_0x41e1a3),
    _0x2ea597 = _0x3f3ed7('setVol'),
    _0x5e54ac = _0x3f3ed7('setOffset');
  _0x2ea597.value = _0x224649.vol * 0x64, _0x3f3ed7("setVolV").textContent = Math.round(_0x224649.vol * 0x64) + '%', _0x5e54ac.value = _0x224649.offset, _0x3f3ed7("setOffsetV").textContent = _0x224649.offset + 'ms', _0x3f3ed7("setSfx").value = String(_0x224649.sfx), _0x3f3ed7('setSpeed').value = String(_0x224649.speed || 0x1), _0x3f3ed7('setSpeedV').textContent = (_0x224649.speed || 0x1).toFixed(0x1) + '×', _0x3f3ed7("setQuality").value = String(_0x224649.quality), _0x3f3ed7("setPad").value = String(_0x224649.pad == null ? 0x1 : _0x224649.pad), _0x3f3ed7('setGap').value = String(_0x224649.gap == null ? 0x1 : _0x224649.gap), _0x3f3ed7("setSwipe").value = String(_0x224649.swipe == null ? 0x1 : _0x224649.swipe), _0x3f3ed7("setClimb").value = String(_0x224649.climb == null ? 0x1 : _0x224649.climb), _0x2ea597.oninput = () => {
    _0x224649.vol = _0x2ea597.value / 0x64, _0x3f3ed7('setVolV').textContent = _0x2ea597.value + '%', applyVolume(), Store.save();
  }, _0x5e54ac.oninput = () => {
    _0x224649.offset = +_0x5e54ac.value, _0x3f3ed7("setOffsetV").textContent = _0x5e54ac.value + 'ms', Store.save();
  }, _0x3f3ed7("setSfx").onchange = _0x209ded => {
    _0x224649.sfx = +_0x209ded.target.value, setSfxEnabled(!!_0x224649.sfx), Store.save();
  }, _0x3f3ed7('setSpeed').oninput = _0x2ec6c0 => {
    _0x224649.speed = +_0x2ec6c0.target.value, _0x3f3ed7("setSpeedV").textContent = _0x224649.speed.toFixed(0x1) + '×', Store.save();
  }, _0x3f3ed7("setQuality").onchange = _0xad444e => {
    _0x224649.quality = +_0xad444e.target.value, mainRef.applyQuality(_0x224649.quality), Store.save();
  }, _0x3f3ed7("setPad").onchange = _0x4540e2 => {
    _0x224649.pad = +_0x4540e2.target.value, applyPadSize(), Store.save();
  }, _0x3f3ed7("setGap").onchange = _0x26f0ee => {
    _0x224649.gap = +_0x26f0ee.target.value, applyPadGap(), Store.save();
  }, _0x3f3ed7("setSwipe").onchange = _0x2d29c => {
    _0x224649.swipe = +_0x2d29c.target.value, applySwipeMode(), Store.save();
  }, _0x3f3ed7("setClimb").onchange = _0x565e1e => {
    _0x224649.climb = +_0x565e1e.target.value, Store.save(), toast(_0x224649.climb ? "🧗 抓奶娃惩罚已开启" : "😴 抓奶娃惩罚已关闭");
  };
  _0x3f3ed7("btnReset").onclick = () => {
    confirm('确定清空全部进度？此操作不可恢复！') && (Store.reset(), applyVolume(), renderHome(), toast('存档已清空'));
  }, initQuickScroll(), window.addEventListener("baby-climb-start", () => {
    Store.data.stats.climbCount = (Store.data.stats.climbCount || 0x0) + 0x1, Store.save();
  }), window.addEventListener("baby-poke", () => {
    Store.data.stats.pokeCount = (Store.data.stats.pokeCount || 0x0) + 0x1, Store.save();
  }), touchLoginStreak();
}
function applyVolume() {
  Music.setVolume(Store.data.set.vol), setMenuBgmVolume(Store.data.set.vol), setVoiceVolume(Store.data.set.vol);
}
function applyPadSize() {
  document.documentElement.style.setProperty('--padScale', Store.data.set.pad || 0x1);
}
function applyPadGap() {
  document.documentElement.style.setProperty("--padGap", Store.data.set.gap || 0x1);
}
function applySwipeMode() {
  document.body.classList.toggle("swipeOn", !!(Store.data.set.swipe == null ? 0x1 : Store.data.set.swipe));
}
function dayKey(_0x24ec9e) {
  return _0x24ec9e.getFullYear() + '-' + (_0x24ec9e.getMonth() + 0x1) + '-' + _0x24ec9e.getDate();
}
export function touchLoginStreak() {
  const _0xb6ff7c = Store.data.stats,
    _0x4dd558 = dayKey(new Date()),
    _0x30d089 = dayKey(new Date(Date.now() - 0x5265c00));
  if (_0xb6ff7c.lastPlayDate === _0x4dd558) return;
  _0xb6ff7c.loginStreak = _0xb6ff7c.lastPlayDate === _0x30d089 ? (_0xb6ff7c.loginStreak || 0x0) + 0x1 : 0x1, _0xb6ff7c.lastPlayDate = _0x4dd558;
}
export function showResult(_0x406697, _0x2225dc) {
  const _0x5d5cb4 = Store.data.stats;
  _0x5d5cb4.plays++, _0x5d5cb4.totalPerfect += _0x406697.cnt.perfect, _0x5d5cb4.totalCoins += _0x406697.coin, _0x5d5cb4.totalMiss = (_0x5d5cb4.totalMiss || 0x0) + _0x406697.cnt.miss, _0x5d5cb4.totalGood = (_0x5d5cb4.totalGood || 0x0) + _0x406697.cnt.good, _0x5d5cb4.worstMiss = Math.max(_0x5d5cb4.worstMiss || 0x0, _0x406697.cnt.miss);
  if (_0x406697.score > _0x5d5cb4.bestScore) _0x5d5cb4.bestScore = _0x406697.score;
  if (_0x406697.maxCombo > _0x5d5cb4.maxCombo) _0x5d5cb4.maxCombo = _0x406697.maxCombo;
  if (_0x406697.acc > _0x5d5cb4.bestAcc) _0x5d5cb4.bestAcc = _0x406697.acc;
  if (_0x406697.cnt.miss === 0x0 && _0x406697.cnt.perfect + _0x406697.cnt.good > 0x0) {
    _0x5d5cb4.fullCombos++;
  }
  if (_0x406697.rank === 'SS') _0x5d5cb4.ssCount++;
  Store.data.chartScores = Store.data.chartScores || {};
  touchLoginStreak(), Store.data.coins += _0x406697.coin, Store.data.chartScores[_0x406697.songId] = Store.data.chartScores[_0x406697.songId] || [], Store.data.chartScores[_0x406697.songId].push({
    'score': _0x406697.score,
    'combo': _0x406697.maxCombo,
    'rank': _0x406697.rank,
    'date': new Date().toLocaleDateString()
  }), Store.data.chartScores[_0x406697.songId].sort((_0x35425b, _0x174063) => _0x174063.score - _0x35425b.score), Store.data.chartScores[_0x406697.songId] = Store.data.chartScores[_0x406697.songId].slice(0x0, 0xa), Store.save(), document.getElementById('resRank').textContent = _0x406697.rank, document.getElementById('resScore').textContent = _0x406697.score.toLocaleString(), document.getElementById("resPerfect").textContent = _0x406697.cnt.perfect, document.getElementById("resGood").textContent = _0x406697.cnt.good, document.getElementById('resMiss').textContent = _0x406697.cnt.miss, document.getElementById("resCombo").textContent = _0x406697.maxCombo, document.getElementById("resCoin").textContent = _0x406697.coin, document.getElementById("resNew").style.display = _0x2225dc ? '' : "none", showResultQuote(_0x406697), drawReplayStrip(_0x406697.replay || [], _0x406697.sec || 0x0), renderSeasonBadge(), showScreen("scr-result"), renderHome(), renderAch();
}
function drawReplayStrip(_0x5aa868, _0x4e95fe) {
  const _0x553fdb = document.getElementById("replayStrip");
  if (!_0x553fdb) return;
  if (!_0x5aa868.length) {
    _0x553fdb.innerHTML = '';
    return;
  }
  const _0x31efd9 = Math.max(_0x4e95fe, _0x5aa868[_0x5aa868.length - 0x1].t, 0x1);
  let _0x13c4bc = '';
  for (const _0x3b9ffb of _0x5aa868) {
    const _0x278f2c = (_0x3b9ffb.t / _0x31efd9 * 0x64).toFixed(0x2),
      _0x4a3c10 = _0x3b9ffb.q === "miss" ? "#ff5b7f" : _0x3b9ffb.q === "perfect" ? "#4fe3ff" : '#ffe17a',
      _0x16bc52 = 0xa + _0x3b9ffb.lane * 0x4;
    _0x13c4bc += '<i\x20style=\x22left:' + _0x278f2c + "%;bottom:" + _0x16bc52 + "px;background:" + _0x4a3c10 + "\"></i>";
  }
  _0x553fdb.innerHTML = _0x13c4bc + '<span\x20class=\x22rp-tip\x22>判定时间轴（蓝P\x20黄G\x20红M）</span>';
}
const SEASON_TIERS = [{
    'min': 0x0,
    'name': "奶瓶练习生",
    'icon': '🍼'
  }, {
    'min': 0x7530,
    'name': '软糖摇摆人',
    'icon': '🍬'
  }, {
    'min': 0x13880,
    'name': '踩点狂魔',
    'icon': '⚡'
  }, {
    'min': 0x249f0,
    'name': "奶龙本龙",
    'icon': '🐉'
  }, {
    'min': 0x3d090,
    'name': "天降奶皇",
    'icon': '🌟'
  }, {
    'min': 0x55730,
    'name': "奶中之帝",
    'icon': '👑'
  }],
  SEASON_NAMES = ["奶娃传奇", "布丁狂想曲", "草莓千层", "焦糖布丁夜", "抹茶旋风", "芝士熔岩", '提拉米苏', "芋泥啵啵", "芒果班戟", '巧克力喷泉', "蜜桃气泡", "椰香糯米糍"];
export function seasonTier() {
  const _0x3a6829 = Store.data.scores || {};
  let _0xcdeb9b = 0x0;
  for (const _0x460d8c of [...Object.values(_0x3a6829), ...Object.values(Store.data.chartScores || {})].flat()) _0xcdeb9b = Math.max(_0xcdeb9b, _0x460d8c.score || 0x0);
  let _0x70e3bd = SEASON_TIERS[0x0];
  for (const _0x1407b1 of SEASON_TIERS) if (_0xcdeb9b >= _0x1407b1.min) _0x70e3bd = _0x1407b1;
  const _0x5cbd10 = new Date(),
    _0x167838 = _0x5cbd10.getMonth() + 0x1 + '.1',
    _0x2b7f16 = _0x5cbd10.getMonth() + 0x1 + '.' + new Date(_0x5cbd10.getFullYear(), _0x5cbd10.getMonth() + 0x1, 0x0).getDate();
  return {
    ..._0x70e3bd,
    'best': _0xcdeb9b,
    'range': _0x167838 + '\x20~\x20' + _0x2b7f16,
    'seasonName': SEASON_NAMES[_0x5cbd10.getMonth()]
  };
}
function renderSeasonBadge() {
  const _0x4d378d = seasonTier(),
    _0xd1c10a = document.getElementById("seasonBadge");
  if (_0xd1c10a) _0xd1c10a.textContent = _0x4d378d.icon + '\x20' + _0x4d378d.name;
  const _0x5413e0 = document.getElementById("seasonInfo");
  if (_0x5413e0) _0x5413e0.textContent = "本赛季 " + _0x4d378d.range + " · 最高纪录 " + _0x4d378d.best.toLocaleString() + " 分 · 段位 " + _0x4d378d.icon + _0x4d378d.name;
}
const SONG_QUOTES = {
    'dk1': "升空的烟火，从下面看还是从侧面看？",
    'new-dzyg': "多远都要在一起，多难都要全连击",
    'new-zoo': "淡季的动物园，奶龙包场了",
    'new-yuai': "雨爱的秘密，能一直延续",
    'new-xiaoji': "小鸡小鸡，蹦跶起飞",
    'new-love119': "119 吗？这里有人着火了（被帅的）",
    'new-baby': "Baby baby baby oh~",
    'new-stay': "留下来，再跳一首",
    'wj1': "不浪漫罪名？这舞步明明很浪漫",
    'tf1': "心动节拍，少年感拉满",
    'leo1': '向着星光，起跳！',
    'cy1': "超甜预警，糖分超标",
    'new-qianrang': "谦让是美德，抢拍是事故",
    'new-yaoban': "摇摆，摇摆，一起摇摆",
    'new-eyes': "你的眼睛，像星星亮晶晶",
    'new-back': 'BACK\x20SEAT\x20也要抢\x20C\x20位',
    'new-wakeup': '醒醒！该跳舞了',
    'new-wanan': '打完这首，晚安好梦',
    'new-plainj': "压迫感？我只感受到节奏感",
    'new-cyn': '甜心出击，biu~',
    'new-huidao': "回到过去，再跳一遍",
    'new-confid': "自信放光芒",
    'new-mentu': "门徒已就位",
    'new-niurou': "牛肉面加辣，手感加倍",
    'new-xiexia': '在遐想里，继续起舞',
    'new-gzdx': "跟着节奏，别停下"
  },
  RANDOM_QUOTES = ["吃了吗？", "睡了吗？", "麻婆豆腐来一份", '红烧排骨来一份', "糖醋里脊来一份", "宫保鸡丁来一份", '鱼香肉丝来一份', "小笼包来一笼", "火锅安排一下", "奶茶加珍珠，谢谢", "螺蛳粉加酸笋", "烤串二十串，微辣", '这手速，不去食堂抢饭可惜了', "打完这首，泡面都泡好了", "手指已冒烟，请求支援", "楼下大妈说这节奏不错"];
function showResultQuote(_0xff1fad) {
  const _0x45266d = document.getElementById('resQuote');
  if (!_0x45266d) return;
  const _0x336bcb = SONG_QUOTES[_0xff1fad.songId] ? [SONG_QUOTES[_0xff1fad.songId]] : RANDOM_QUOTES;
  _0x45266d.textContent = _0x336bcb[Math.floor(Math.random() * _0x336bcb.length)];
}
let toastT = 0x0;
export function toast(_0x1b8282) {
  const _0x1319c1 = document.getElementById("toast");
  _0x1319c1.textContent = _0x1b8282, _0x1319c1.classList.add('on'), clearTimeout(toastT), toastT = setTimeout(() => _0x1319c1.classList.remove('on'), 0x708);
}
export function askConfirm(_0xcbac77, _0x46449f = {}) {
  const {
    yesText = '确定',
    noText = '取消',
    danger = true
  } = _0x46449f;
  return new Promise(_0x1cfc05 => {
    const _0x2cc86f = document.createElement("div");
    _0x2cc86f.className = "cf-mask";
    const _0x36c733 = document.createElement('div');
    _0x36c733.className = 'cf-box', _0x36c733.innerHTML = "\n      <div class=\"cf-msg\">" + _0xcbac77 + "</div>\n      <div class=\"cf-btns\">\n        <button class=\"cf-no\">" + noText + "</button>\n        <button class=\"cf-yes" + (danger ? " danger" : '') + '\x22>' + yesText + '</button>\x0a\x20\x20\x20\x20\x20\x20</div>', _0x2cc86f.appendChild(_0x36c733), document.body.appendChild(_0x2cc86f), requestAnimationFrame(() => _0x2cc86f.classList.add('in'));
    let _0x442681 = false;
    const _0x32292b = _0x6d391e => {
      if (_0x442681) return;
      _0x442681 = true, _0x2cc86f.classList.remove('in'), setTimeout(() => _0x2cc86f.remove(), 0xb4), _0x1cfc05(_0x6d391e);
    };
    _0x36c733.querySelector(".cf-no").onclick = () => _0x32292b(false), _0x36c733.querySelector(".cf-yes").onclick = () => _0x32292b(true), _0x2cc86f.addEventListener("click", _0x3bae4e => {
      if (_0x3bae4e.target === _0x2cc86f) _0x32292b(false);
    });
  });
}
export function checkAch() {
  const _0x2226a7 = Store.data,
    _0x331476 = [];
  ACHS.forEach(_0x59c8b3 => {
    !_0x2226a7.ach[_0x59c8b3.id] && _0x59c8b3.get(_0x2226a7) >= _0x59c8b3.goal && (_0x2226a7.ach[_0x59c8b3.id] = 0x1, _0x331476.push(_0x59c8b3));
  });
  if (_0x331476.length) Store.save();
  return _0x331476;
}

let language = 'en_us';

let textData = {
    "translate_warn": {
        "en_us": "ENGLISH",
        "fr": "(Remarque: Certaines traductions\npeuvent être inexactes)",
        "zh_tw": "中文",
        "zh_cn": "中文",
        "ru": "Русский",
        "es": "",
        "jp": ""
    },
    "credits": {
        "en_us": "CREDITS",
        "fr": "CRÉDITS",
        "zh_tw": "制作名单",
        "zh_cn": "制作名单",
        "ru": "Кредиты",
        "es": "",
        "jp": "。"
    },
    "instructions": {
        "en_us": "INSTRUCTIONS",
        "zh_cn": "游戏说明",
        "ru": "ИНСТРУКЦИИ",
    },
    "goal": {
        "en_us": "GOAL: Set all\npins in place to\nunlock the lock",
        "zh_cn": "目标：将所有\n插销固定到位\n打开锁",
        "ru": "ЦЕЛЬ: Установить\nвсе штифты на\nместо, чтобы\nотпереть замок",
    },

    "new_game": {
        "en_us": "NEW GAME",
        "fr": "NOUVEAU JEU",
        "zh_tw": "新遊戲",
        "zh_cn": "新游戏",
        "ru": "НОВАЯ ИГРА",
        "es": "NUEVO JUEGO",
        "jp": "新しいゲーム"
    },
    "post_fight_continue": {
        "en_us": "CONTINUE",
        "fr": "CONTINUER",
        "zh_tw": "繼續",
        "zh_cn": "继续",
        "ru": "ПРОДОЛЖАТЬ",
        "es": "CONTINUAR",
        "jp": "続ける"
    },
    "lvl_select": {
        "en_us": "LVL SELECT",
        "zh_tw": "等級選擇",
        "zh_cn": "级别选择",
        "ru": "ВЫБОР УРОВНЯ",
    },
    "level_select": {
        "en_us": "LEVEL SELECT",
        "zh_tw": "等級選擇",
        "zh_cn": "级别选择",
        "ru": "ВЫБОР УРОВНЯ",
    },
    "retry": {
        "en_us": "RETRY",
        "zh_tw": "重試",
        "zh_cn": "重试",
        "ru": "ПОВТОРИТЬ",
    },

    "continue": {
        "en_us": "CONTINUE",
        "zh_tw": "繼續",
        "zh_cn": "继续",
        "ru": "ПРОДОЛЖАТЬ",
    },
    "nextlvl": {
        "en_us": "NEXT LEVEL",
        "zh_tw": "下一級",
        "zh_cn": "下一级",
        "ru": "СЛЕДУЮЩИЙ УРОВЕНЬ",
    },


    "exit": {
        "en_us": "EXIT",
        "fr": "QUITTER",
        "zh_tw": "退出",
        "zh_cn": "退出",
        "ru": "ПОКИДАТЬ",
        "es": "ABANDONAR",
        "jp": "やめる"
    },
    "back": {
        "en_us": "BACK",
        "fr": "RETOUR",
        "zh_tw": "返回",
        "zh_cn": "返回",
        "ru": "ОТМЕНА",
        "es": "CANCELAR",
        "jp": "キャンセル"
    },
    "main_menu": {
        "en_us": "MAIN MENU?",
        "fr": "MENU PRINCIPAL?",
        "zh_tw": "主選單",
        "zh_cn": "主菜单",
        "ru": "ГЛАВНОЕ МЕНЮ?",
        "es": "MENÚ PRINCIPAL?",
        "jp": "メインメニュー？"
    },
    "controls": {
        "en_us": "CONTROLS:",
        "zh_cn": "控件:",
        "ru": "КОНТРОЛЬ:",
    },
    "level": {
        "en_us": "Level",
        "zh_cn": "关卡",
        "ru": "Уровень",
    },
    "move_pick": {
        "en_us": "Move pick",
        "zh_cn": "移动撬锁工具",
        "ru": "сдвиг отмычка",
    },
    "lift_pin": {
        "en_us": "Lift pin",
        "zh_cn": "提销",
        "ru": "подъемный штифт",
    },
    "set_pin": {
        "en_us": "Space/Enter to set pin",
        "zh_cn": "按“回车”键在锁顶设置销",
        "ru": "Пробел/Enter для установки пин-кода",
    },
    "pins_can_only": {
        "en_us": "Pins can only be set at the top\nof the lock, or else the lockpick breaks.",
        "zh_cn": "",
        "ru": "",
    },

    "lock_pin": {
        "en_us": "                 / Enter to set pin\nwhen at top of lock",
        "zh_cn": "                 / 按“回车”键在锁顶设置销。",
        "ru": "                 / Нажми \"Enter\" для\nустановки штифта в верхней части замка.",
    },

    "picks_left": {
        "en_us": "PICKS LEFT: ",
        "zh_cn": "剩余撬锁工具: ",
        "ru": "ОТМЫЧКИ: ",
    },
    "room0": {
        "en_us": "TRAINING",
        "zh_cn": "训练",
        "ru": "Обучение",
    },
    "room1": {
        "en_us": "LOCKBOX",
        "zh_cn": "密码箱",
        "ru": "ЯЩИК",
    },
    "room2": {
        "en_us": "TAVERN",
        "zh_cn": "酒馆",
        "ru": "ТАВЕРНА",
    },
    "room3": {
        "en_us": "SEWER",
        "zh_cn": "下水道",
        "ru": "КАНАЛИЗАЦИЯ",
    },
    "room4": {
        "en_us": "ENCHANTED GATE",
        "zh_cn": "魔法之门",
        "ru": "ЗАЧАРОВАННЫЕ ВОРОТА",
    },
    "room5": {
        "en_us": "PALACE DOOR",
        "zh_cn": "宫殿之门",
        "ru": "ДВОРЦОВАЯ ДВЕРЬ",
    },
    "room6": {
        "en_us": "SEALED SCROLL",
        "zh_cn": "封印卷轴",
        "ru": "ЗАПЕЧАТАННЫЙ СВИТОК",
    },
    "room7": {
        "en_us": "CHALLENGE!",
        "zh_cn": "挑战！",
        "ru": "ИСПЫТАНИЕ!",
    },


    "story1": {
        "en_us": "I prowl the Imperial City's underground,\nneeding coin to fund my heist after\nhearing rumors of a valuable scroll with\na very generous payout.\n\nMy eyes notice an abandoned lockbox\nthat tempts me with easy pickings.",
        "zh_cn": "我在帝国城的地下潜行，听到\n传言说有一卷价值连城的卷轴，\n报酬非常丰厚，我需要资金来支持\n我的抢劫计划。我的眼睛注意到\n一个废弃的锁箱，诱惑我去轻松拾取。",
        "ru": "Я крадусь по подземельям Имперского\nгорода, нуждаясь в деньгах для\nфинансирования ограбления, после слухов\nо ценном свитке с щедрой наградой.\n\nМои глаза замечают заброшенный сейф,\nкоторый манит лёгкой добычей.",
    },
    "story2": {
        "en_us": "With some spare coin and a seat at the\ntavern, I get information on the scroll's\nwhereabouts, but I need maps to help\nnavigate the way.\n\nThe tavern's backrooms contain\nsmuggler goods, only loosely guarded\nto anyone with the finesse to take\nits contents.",
        "zh_cn": "带着一些闲钱在酒馆找了个座位，\n我打听到了卷轴下落的消息，\n但需要地图来指引方向。\n\n酒馆的后室藏着走私者的货物，\n只需稍有技巧就能轻松取走里面\n的东西。",
        "ru": "С несколькими лишними монетами\nи местом в таверне я узнаю о\nместонахождении свитка, но мне\nнужны карты, чтобы найти путь.\n\nВ задних комнатах таверны хранятся\nтовары контрабандистов, слабо\nохраняемые для тех,у кого хватает\nловкости, чтобы забрать их содержимое.",
    },
    "story3": {
        "en_us": "The scroll lies within the Imperial\nPalace, reachable through the sewers,\nbut a rusted grate bars the way.\n\nThe lock on it is sturdy but familiar, and\nshould yield as long as I'm careful.",
        "zh_cn": "卷轴藏在帝国宫殿内，可通过\n下水道到达，但一道生锈的栅\n栏挡住了去路。\n\n栅栏上的锁坚固但熟悉，只要我\n小心操作，应该能打开。",
        "ru": "Свиток находится в Имперском дворце,\nкуда можно попасть через канализацию,\nно путь преграждает ржавая решётка.\n\nЗамок на ней крепкий, но знакомый,\nи должен поддаться, если я буду\nосторожен.",
    },
    "story4": {
        "en_us": "I've reached the end of the sewers,\nbut a strange gate adorned with the\nroyal crest blocks my path.\n\nThe lock on this gate looks simple but\nI notice the glow of an enchantment.\nI'll have to be careful with this one.",
        "zh_cn": "我到达了下水道的尽头，但一\n道装饰着皇家徽章的奇怪大门\n挡住了我的去路。\n\n大门上的锁看起来简单，但我注意\n到一股魔法的光芒。\n\n我得小心处理这个。",
        "ru": "Я добрался до конца канализации,\nно странные ворота, украшенные\nкоролевским гербом, преграждают мне\nпуть.\n\nЗамок на этих воротах выглядит\nпростым, но я замечаю сияние чар.\nС этим нужно быть осторожным.",
    },
    "story5": {
        "en_us": "The vault-like door to the inner Palace\nstands before me, its locks a masterpiece\nof craftsmanship and enchantment.\n\nEvery known safeguard protects this\nbarrier, testing my skill to its limit.",
        "zh_cn": "通往宫殿内部的保险库般的大门\n矗立在我面前，其锁是工艺与魔\n法的杰作。\n\n每一种已知的防护措施都在保护\n这道屏障，考验着我的技能极限。",
        "ru": "Передо мной стоит дверь в виде\nсейфа, ведущая во внутренний дворец,\nеё замки — шедевр мастерства и чар.\n\n" +
            "Каждая известная мера защиты\nохраняет эту преграду, испытывая мои\nнавыки до предела.",
    },
    "story6": {
        "en_us": "I've finally reached the royal library,\na chamber of ancient tomes guarded\nby blind monks.\n\nI spot the scroll right away but a\nstar-shaped seal secures its contents.\n\nI sense this scroll hides secrets greater\nthan any treasure, but I've come too\nfar to stop now.",
        "zh_cn": "我终于到达了皇家图书馆，这是\n一间由盲僧守护的古老书籍密室。\n\n我立刻发现了那卷轴，但它被一个\n星形封印保护着。我感觉到这卷轴\n隐藏的秘密比任何宝藏都要珍贵，\n但我已经走了太远，无法停下。",
        "ru": "Я наконец-то добрался до королевской\nбиблиотеки, зала древних томов,\nохраняемого слепыми монахами.\n\nЯ сразу замечаю свиток, но его\nсодержимое защищено звездчатой\nпечатью. Я чувствую, что этот\nсвиток скрывает тайны, превосходящие\nлюбые сокровища, но я зашёл слишком\nдалеко, чтобы останавливаться.",
    },
    "story7": {
        "en_us": "After much drinking and bragging about\nmy latest heist, a rival locksmith presents\nto me a contraption so complex it could\nbarely be called a lock anymore.\n\nThere's something devious about this\ndevice but my prior boasting prevents\nme from withdrawing from this\nchallenge.\n\nI'll bring extra picks just in case.",
        "zh_cn": "在畅饮和夸耀我最近的抢劫之后，\n一个敌对的锁匠向我展示了一个\n复杂得几乎不能再称为锁的装置。\n\n这个装置有种狡诈的感觉，但我之\n前的夸口让我无法退出这个挑战。\n\n我会多带几把撬锁工具以防万一。",
        "ru": "После обильного застолья и хвастовства\nо моём последнем ограблении,\nсоперник-слесарь показывает мне\nустройство, настолько сложное, что\nего едва ли можно назвать замком.\n\nВ этом механизме есть что-то\nковарное, но мои прежние\nпохвалы не позволяют мне\nотказаться от вызова.\n\nЯ возьму с собой лишние\nотмычки на всякий случай.",
    },

    "skullkey": {
        "en_us": "USE SKULL KEY?",
        "zh_cn": "使用骷髅钥匙？",
        "ru": "ИСПОЛЬЗОВАТЬ\nКЛЮЧ ЧЕРЕПА?",
    },
    "skullkeyinfo": {
        "en_us": "A special lockpick themed after the legendary\nSkeleton Key. This tool is a lot more durable\nthan your normal lockpick.\n\nAllows you to \"auto-attempt\" the lock.",
        "zh_cn": "一把以传奇骷髅钥匙为主\n题的特殊开锁工具。这种\n工具比普通开锁器耐用\n得多。\n\n允许你“自动尝试”开锁。",
        "ru": "Особый отмычка, оформленная в стиле\nлегендарного Ключа Черепа. Этот инструмент\nгораздо прочнее обычной отмычки.\n\nПозволяет \"автоматически пытаться\"\nоткрыть замок.",
    },

}


function getLangText(textName) {
    if (!textData[textName]) {
        console.error("Missing text name ", textName);
        return "MISSING TEXT";
    }
    return textData[textName][language];
}

function getBasicText(textName) {
    if (!textData[textName]) {
        console.error("Missing text name ", textName);
        return "MISSING TEXT";
    }
    return textData[textName];
}

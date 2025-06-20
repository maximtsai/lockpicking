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
    "translate_warn": {
        "en_us": " ",
        "fr": "(Remarque: Certaines traductions\npeuvent être inexactes)",
        "zh_tw": "(註：有些翻譯可能不準確)",
        "zh_cn": "(注：有些翻译可能不准确)",
        "ru": "(Предупреждение: некоторые переводы могут содержать неточности)",
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
        "es": "CONTINUAR",
        "jp": "続ける"
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

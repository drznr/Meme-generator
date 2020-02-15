'use strict';

var gTrans = {
    nav1: {
        en: 'Gallery',
        he: 'גלריה'
    },
    nav2: {
        en: 'Memes',
        he: 'ממים'
    },
    nav3: {
        en: 'About',
        he: 'עלינו'
    },
    galleryInp: {
        en: 'Search',
        he: 'חפש'
    },
    btnMore: {
        en: 'More',
        he: 'עוד'
    },
    key1: {
        en: 'man',
        he: 'איש'
    },
    key2: {
        en: 'woman',
        he: 'אישה'
    },
    key3: {
        en: 'cute',
        he: 'חמוד'
    },
    key4: {
        en: 'funny',
        he: 'מצחיק'
    },
    key5: {
        en: 'comic',
        he: 'קומי'
    },
    key6: {
        en: 'smile',
        he: 'חיוך'
    },
    key7: {
        en: 'kids',
        he: 'ילדים'
    },
    memeInp: {
        en: 'Your text here...',
        he: 'כתוב כאן...'
    },
    btnFontPlus: {
        en: 'A+',
        he: 'ג+'
    },
    btnFontMinus: {
        en: 'A-',
        he: 'ג-'
    },
    btnSave: {
        en: 'Save',
        he: 'שמור'
    },
    btnDownload: {
        en: 'Download',
        he: 'הורד'
    },
    btnShare: {
        en: 'Share',
        he: 'שתף'
    },
    popupHead: {
        en: 'Meme saved successfully!',
        he: 'המם נשמר בהצלחה!'
    },
    popupTxt: {
        en: 'You can check out your saved memes in the Memes page.',
        he: 'התמונה זמינה עבורך בעמוד הממים.'
    },
    upload: {
        en: 'Uplaod Image',
        he: 'העלאת תמונה'
    },
    removeLine: {
        en: 'Remove line',
        he: 'מחק שורה'
    },
    addLine: {
        en: 'Add line',
        he: 'הוסף שורה'
    },
    switchLines: {
        en: 'Switch line',
        he: 'החלף בין שורות'
    },
    moveDown: {
        en: 'Move down',
        he: 'הזז למטה'
    },
    moveUp: {
        en: 'Move up',
        he: 'הזז למעלה'
    }
}
var gCurrLang = 'en';



function doTrans() {
    var els = document.querySelectorAll('[data-trans]');
    els.forEach(el => {
        var txt = getTrans(el.dataset.trans);

        if (el.placeholder) el.placeholder = txt;
        else if (el.title) el.title = txt;
        else el.innerText = txt;
    });
}
function getTrans(transKey) {
    var langMap = gTrans[transKey];

    if (!langMap) return 'UNKNOWN';
    var txt = langMap[gCurrLang];

    if (!txt) txt = langMap['en'];
    return txt;
}

function setLang(lang) {
    gCurrLang = lang;
}
function getCurrLang() {
    return gCurrLang;
}
'use strict';

const STORAGE_KEY = 'memes';
const KEYS_IN_ROW = 3;
var gMemes = [];
var gCurrKeysRow = 1;
var gKeywords = {
    'man': 1,
    'woman': 2,
    'cute': 3,
    'funny': 2,
    'comic': 1,
    'smile': 1,
    'kids': 2
};
var gImgs = _createImgs();
var gMeme = {
    selectedImgId: '',
    selectedLineIdx: 0,
    selectedEmojiIdx: 0,
    lines: [
        {
            txt: 'YOUR TEXT HERE...',
            size: 20,
            font: 'Impact, sans-serif',
            align: 'left',
            color: '#000000',
            stroke: '#000000',
            offsetY: 10,
            offsetX: 10
        }
    ],
    emojis: []
}
var gFilter = '';



function resetEmojiFocus() {
    gMeme.selectedEmojiIdx = 0;
}
function resetLineFocus() {
    gMeme.selectedLineIdx = 0;
}
function unToggleEmoji() {
    gMeme.selectedEmojiIdx = -1;
}
function unToggleLine() {
    gMeme.selectedLineIdx = -1;
}
function addEmoji(elSpan) {
    let newEmoji = {
        content: elSpan.innerText,
        size: 50,
        offsetY: 50,
        offsetX: 50
    }
    gMeme.emojis.push(newEmoji);
}
function doUploadImg(elForm, onSuccess) {
    var formData = new FormData(elForm);
    fetch('http://ca-upload.com/here/upload.php', {
        method: 'POST',
        body: formData
    })
    .then(function (res) {
        return res.text()
    })
    .then(onSuccess)
    .catch(function (err) {
        console.error(err)
    })
}
function saveMeme(memeData) {
   var memes = getFromLocalStorage(STORAGE_KEY);
   if (memes) memes.push(memeData);
   else memes = [memeData];
   saveToLocalStorage(STORAGE_KEY, memes);
}
function changeKeywords(diff) {
    gCurrKeysRow += diff;
    var lastRow = Math.ceil(Object.keys(gKeywords).length / KEYS_IN_ROW);

    if (gCurrKeysRow > lastRow) gCurrKeysRow = 1;
    else if (gCurrKeysRow < 1) gCurrKeysRow = lastRow;
}
function removeLine() {
    if (gMeme.lines.length) {
        gMeme.lines.splice(gMeme.selectedLineIdx, 1);
        gMeme.selectedLineIdx--;
    }
}
function createNewLine(canvasHeight, canvasWidth) {
    let offsetY = (gMeme.lines.length === 0) ? 10 : (gMeme.lines.length === 1) ? (canvasHeight - 20) : (canvasHeight / 2);
    let offsetX = (gMeme.lines[gMeme.selectedLineIdx].align === 'center') ? (canvasWidth / 2) : (gMeme.lines[gMeme.selectedLineIdx].align === 'left') ? 10 : (canvasWidth - 2);

    let newLine = {
        txt: 'YOUR TEXT HERE...',
        size: 20,
        font: 'Impact, sans-serif',
        align: 'left',
        color: '#000000',
        stroke: '#000000',
        offsetY: (offsetY - 10),
        offsetX: offsetX
    }
    gMeme.lines.push(newLine);
}
function moveLine(val) {
    let line = gMeme.lines[gMeme.selectedLineIdx];
    if (line) {
        if (val < 0 && line.offsetY <= line.offsetY || val > 0 && line.offsetY >= (gCanvas.height - line.size - line.offsetY)) return;
        line.offsetY += val;
    }
}
function dragLine(val) {
    if (gMeme.selectedLineIdx < 0) return;
    let line = gMeme.lines[gMeme.selectedLineIdx];
    if (line) {
        if (val < 0 || val > (gCanvas.height - line.size)) return;
        line.offsetY = val;
    }
}
function dragEmoji(y, x) {
    if (gMeme.selectedEmojiIdx < 0) return;
    let emoji = gMeme.emojis[gMeme.selectedEmojiIdx];
    if (emoji) {
        if (y < 0 || y > (gCanvas.height - emoji.size) || x < 0 || x > (gCanvas.width - emoji.size)) return;
        emoji.offsetY = y;
        emoji.offsetX = x;
    }
}
function setTxtOpts(elem) {
    let line = gMeme.lines[gMeme.selectedLineIdx];
    switch (elem.dataset.name) {
        case 'size':
            line[elem.dataset.name] += (+elem.dataset.value);
            break;
        case 'align':
            if (elem.dataset.value === 'center') line.offsetX = (gCanvas.width / 2);
            else if (elem.dataset.value === 'left') line.offsetX = 10;
            else line.offsetX = (gCanvas.width - 10);
            line[elem.dataset.name] = elem.dataset.value;
            break;
        case 'font':
        case 'color':
        case 'stroke':
            line[elem.dataset.name] = elem.value;
            break;
        default:
            break;
    }
}
function updateCurrLine() {
    if (gMeme.selectedLineIdx < (gMeme.lines.length - 1)) gMeme.selectedLineIdx++;
    else gMeme.selectedLineIdx = 0;
    return gMeme.lines[gMeme.selectedLineIdx];
}
function changeCurrLine(idx) {
    gMeme.selectedLineIdx = idx;
}
function changeTxt(txt) {
    var currLine = gMeme.lines[gMeme.selectedLineIdx];
    currLine.txt = txt;
}
// function typeTxt(letter) {
//     var currLine = gMeme.lines[gMeme.selectedLineIdx];
//     if (currLine.txt === '') currLine.txt = letter;
//     else currLine.txt += letter;
// }
function setCurrMeme(elImg) {
    gMeme.selectedImgId = elImg.dataset.id;
    gMeme.selectedLineIdx = 0;
    gMeme.selectedEmojiIdx = 0;
    gMeme.lines = [
        {
            txt: 'YOUR TEXT HERE...',
            size: 20,
            font: 'Impact, sans-serif',
            align: 'left',
            color: '#000000',
            stroke: '#000000',
            offsetY: 10,
            offsetX: 10
        }
    ];
    gMeme.emojis = [];
}
function getCurrLine() {
    return gMeme.lines[gMeme.selectedLineIdx];
}
function getCurrEmoji() {
    return gMeme.emojis[gMeme.selectedEmojiIdx];
}
function getEmojis() {
    return gMeme.emojis;
}
function setSelectedEmoji(idx) {
    gMeme.selectedEmojiIdx = idx;
}
function getKeywords() {
    var from = (gCurrKeysRow - 1) * KEYS_IN_ROW;
    var to = from + KEYS_IN_ROW;
    return Object.keys(gKeywords).slice(from, to);
}
function getAllKeywords() {
    return gKeywords;
}
function setFilter(filterBy) {
    gFilter = (filterBy) ? filterBy : '';
}
function getImgsToDisplay() {
    let imgsToDisplay = [];
    if (gFilter) imgsToDisplay = gImgs.filter(gImg => gImg.keywords.includes(gFilter));
    else imgsToDisplay = [...gImgs];
    return imgsToDisplay;
}
function getLines() {
    return gMeme.lines;
}
function _createImgs() {
    const urls = [
        'images/memes/2.jpg', 'images/memes/003.jpg', 'images/memes/004.jpg', 'images/memes/005.jpg',
        'images/memes/5.jpg', 'images/memes/006.jpg', 'images/memes/8.jpg', 'images/memes/9.jpg'
    ];
    const keywords = [
        ['woman', 'smile'], ['man', 'funny', 'comic'], ['animals', 'cute'],
        ['animals', 'cute', 'kids'], ['comic', 'smile', 'kids'], ['animals', 'cute'],
        ['man', 'comic', 'smile'], ['kids', 'comic', 'funny']
    ]
    let imgs = []
    for (let i = 0; i < urls.length; i++) {
        imgs.push(_createImg(urls[i], ...keywords[i]));
    }
    return imgs;
}
function _createImg(url, ...keywords) {
    return {
        id: generatePass(10),
        url: url,
        keywords: keywords
    }
}
'use strict';


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
    lines: [
        {
            txt: 'YOUR TEXT HERE...',
            size: 20,
            font: 'Impact, sans-serif',
            align: 'center',
            color: '#000000',
            stroke: '#000000',
            offsetY: 10
        }
    ]
}





function removeLine() {
    if (gMeme.lines.length) {
        gMeme.lines.splice(gMeme.selectedLineIdx, 1);
        gMeme.selectedLineIdx--;
    }
}
function createNewLine(offsetY) {
    offsetY = (gMeme.lines.length === 0) ? 10 : (gMeme.lines.length === 1) ? (gCanvas.height - 20) : (gCanvas.height / 2);

    let newLine = {
        txt: 'YOUR TEXT HERE...',
        size: 20,
        font: 'Impact, sans-serif',
        align: 'center',
        color: '#000000',
        stroke: '#000000',
        offsetY: offsetY
    }
    gMeme.lines.push(newLine);
}
function moveLine(val) {
    let line = gMeme.lines[gMeme.selectedLineIdx];
    if (val < 0 && line.offsetY <= line.offsetY || val > 0 && line.offsetY >= (gCanvas.height - line.size - line.offsetY)) return;
    line.offsetY += val;
}
function setTxtOpts(elem) {
    let line = gMeme.lines[gMeme.selectedLineIdx];
    switch (elem.dataset.name) {
        case 'size':
            line[elem.dataset.name] += (+elem.dataset.value);
            break;
        case 'align':
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
function changeTxt(txt) {
    var currLine = gMeme.lines[gMeme.selectedLineIdx];
    currLine.txt = txt;
}
function setCurrMeme(elImg) {
    gMeme.selectedImgId = elImg.dataset.id;
}
function getCurrLine() {
    return gMeme.lines[gMeme.selectedLineIdx];
}
function getKeywords() {
    return gKeywords;
}
function getImgs() {
    return gImgs;
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
'use strict';

var gCanvas, gCtx;



function onLineRemoved() {
    removeLine();
    var elImg = document.querySelector(`[data-id="${gMeme.selectedImgId}"]`);
    drawImg(elImg);
}
function onLineAdded() {
    createNewLine(gCanvas.height);
    var elImg = document.querySelector(`[data-id="${gMeme.selectedImgId}"]`);
    drawImg(elImg);
}
function onLineMove(val) {
    moveLine(val);
    var elImg = document.querySelector(`[data-id="${gMeme.selectedImgId}"]`);
    drawImg(elImg);
}
function onLineFocus() {
    var currLine = updateCurrLine();
    _setFormValues(currLine);
    var elImg = document.querySelector(`[data-id="${gMeme.selectedImgId}"]`);
    drawImg(elImg);
}
function onTxtChange(txt) {
    changeTxt(txt);
    var elImg = document.querySelector(`[data-id="${gMeme.selectedImgId}"]`);
    drawImg(elImg);
}

function onTxtEdit(elem) {
    setTxtOpts(elem);
    var elImg = document.querySelector(`[data-id="${gMeme.selectedImgId}"]`);
    drawImg(elImg);
}
function drawImg(elImg) {
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
    var img = new Image();
    img.src = elImg.src;
    _resizeCanvas(elImg);

    let lines = getLines();
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
        lines.forEach(line => {
            _drawText(line);
        });
    }
}

function _drawText(line) {
    let currLine = getCurrLine();
    if (currLine === line) {
        gCtx.shadowBlur = 4;
        gCtx.shadowColor = 'rgba(57, 255, 20, .75)';   ////// USE SOMETHING ELSE NOT THIS SHIT TEXT SHADOW!!!!!
    } else {
        gCtx.shadowBlur = 0;
        gCtx.shadowColor = 'none';
    }

    gCtx.strokeStyle = line.stroke;
    gCtx.fillStyle = line.color;
    gCtx.font = `${line.size}px ${line.font}`;
    gCtx.textAlign = line.align;
    gCtx.textBaseline = 'top';
    gCtx.fillText(line.txt.toUpperCase(), gCanvas.width / 2, line.offsetY);
    gCtx.strokeText(line.txt.toUpperCase(), gCanvas.width / 2, line.offsetY);
}

function initCanvas() {
    gCanvas = document.querySelector('#memeCanvas');
    gCtx = gCanvas.getContext('2d');
}

function _setFormValues(line) {
    var elTxtInp = document.querySelector('.controls-panel .txt');
    var elFontSelect = document.querySelector('.txt-controls select');
    var elStrokeInp = document.querySelector('#strokeColorInp');
    var elColorInp = document.querySelector('#colorInp');

    elTxtInp.value = '';
    elTxtInp.placeholder = line.txt;
    elFontSelect.value = line.font;
    elStrokeInp.value = line.stroke;
    elColorInp.value = line.color;
}
function _resizeCanvas(elImg) {
    gCanvas.width = elImg.naturalWidth
    gCanvas.height = elImg.naturalHeight
}
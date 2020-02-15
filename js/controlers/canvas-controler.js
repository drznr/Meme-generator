'use strict';

var gCanvas, gCtx;





function onEmojiAdded(elSpan) {
    addEmoji(elSpan);
    drawImg();
}
function hidePopup() {
    document.querySelector('.popup').classList.remove('active');
}
function onImageShared(elForm, ev) {
    ev.preventDefault();
    document.getElementById('imgData').value = gCanvas.toDataURL("image/png", 1);

    function onSuccess(uploadedImgUrl) {
        uploadedImgUrl = encodeURIComponent(uploadedImgUrl)
        let link = document.createElement('a');
        link.href = `https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}`;
        link.target = '_blank';
        link.click();
        link.remove();
    }
    doUploadImg(elForm, onSuccess);
}
function onImageSaved() {
    cleanHighlightedLine();
    setTimeout(() => {
        const data = gCanvas.toDataURL('image/png', 1);
        let link = document.createElement('a');
        link.href = data;
        link.download = 'meme.png';
        link.click();
        link.remove();
    }, 0);
}
function onCanvasSave() {
    cleanHighlightedLine();
    setTimeout(() => {
        let memeData = gCanvas.toDataURL();
        gMemes.selectedLineIdx = 0;
        saveMeme(memeData);
        document.querySelector('.popup').classList.add('active');
    }, 0);
}
function onLineRemoved() {
    if (removeLine()) drawImg();
}
function onLineAdded() {
    createNewLine(gCanvas.height, gCanvas.width);
    drawImg();
}
function onDragLine(val) {
    dragLine(val);
    drawImg();
}
function onDragEmoji(y, x) {
    dragEmoji(y, x);
    drawImg();
}
function onLineMove(val) {
    if (moveLine(val)) drawImg();
}
function onLineFocus() {
    var currLine = updateCurrLine();
    setFormValues(currLine);
    drawImg();
}
function onTxtChange(txt) {
    changeTxt(txt);
    drawImg();
}
function onTxtEdit(elem) {
    if (setTxtOpts(elem)) drawImg();
}
function drawImg(elImg = document.querySelector(`[data-id="${gMeme.selectedImgId}"]`)) {
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
    var img = new Image();
    img.src = elImg.src;
    _resizeCanvas(elImg);

    let lines = getLines();
    let emojis = getEmojis();
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
        lines.forEach(line => {
            _drawText(line);
        });
        emojis.forEach(emoji => {
            _drawEmoji(emoji);
        });
    }
}

function _drawEmoji(emoji) {
    gCtx.font = `${emoji.size}px Impact`;
    gCtx.fillText(emoji.content, emoji.offsetX, emoji.offsetY);
}

function _drawText(line) {
    let currLine = getCurrLine();
    if (currLine === line) {
        _drawRect(10, currLine.offsetY);
    }

    gCtx.strokeStyle = line.stroke;
    gCtx.fillStyle = line.color;
    gCtx.font = `${line.size}px ${line.font}`;
    gCtx.textAlign = line.align;
    gCtx.textBaseline = 'top';
    gCtx.fillText(line.txt.toUpperCase(), line.offsetX, line.offsetY);
    gCtx.strokeText(line.txt.toUpperCase(), line.offsetX, line.offsetY);
}

function initCanvas() {
    gCanvas = document.querySelector('#memeCanvas');
    gCtx = gCanvas.getContext('2d');
}

function _drawRect(x, y) {
    gCtx.beginPath();
    gCtx.rect(x, y, (gCanvas.width - 20), (getCurrLine().size));
    gCtx.strokeStyle = 'red';
    gCtx.stroke();
}

function setFormValues(line) {
    var elTxtInp = document.querySelector('.controls-panel .txt');
    var elFontSelect = document.querySelector('.txt-controls select');
    var elStrokeInp = document.querySelector('#strokeColorInp');
    var elColorInp = document.querySelector('#colorInp');

    if (line) {
        elTxtInp.value = '';
        elTxtInp.placeholder = line.txt;
        elFontSelect.value = line.font;
        elStrokeInp.value = line.stroke;
        elColorInp.value = line.color;
    } else {
        elTxtInp.value = '';
        elTxtInp.placeholder = (getCurrLang() === 'en') ? 'Your text here...' : 'כתוב כאן...';
        elFontSelect.value = 'Impact, sans serif';
        elStrokeInp.value = '#000000';
        elColorInp.value = '#000000';
    }
}
function handleKeyEvent() {
    window.addEventListener('keyup', (ev) => {
        if (!document.querySelector('.modal-container').classList.contains('open')) return;
        let line = getCurrLine();
        if (!line) return;
        
        if (ev.key === 'Backspace') line.txt = line.txt.substring(0, line.txt.length - 1);
        else if (ev.key === 'Enter') unToggleLine();
        else if (ev.key.length === 1) line.txt += ev.key;
        else return;

        drawImg();
    });
}
function handleDragEvents() {
    gCanvas.addEventListener('touchstart', (ev) => {
        let offsetX = ev.targetTouches[0].pageX;
        let offsetY = ev.targetTouches[0].pageY;
        onLineClicked(offsetX, offsetY);
        onEmojiClicked(offsetX, offsetY);
    });
    gCanvas.addEventListener('touchmove', (ev) => {
        ev.preventDefault();
        let offsetY = ev.targetTouches[0].pageY;
        let offsetX = ev.targetTouches[0].pageX;
        onDragLine(offsetY);
        onDragEmoji(offsetY, offsetX);
    });

    gCanvas.addEventListener('mousedown', (ev) => {
        let { offsetX, offsetY } = ev;
        onLineClicked(offsetX, offsetY);
        onEmojiClicked(offsetX, offsetY);

        gCanvas.onmousemove = (ev) => {
            let { offsetX, offsetY } = ev;
            document.querySelector('#memeCanvas').style.cursor = 'grabbing';
            onDragLine(offsetY);
            onDragEmoji(offsetY, offsetX);
        }
    });
    gCanvas.addEventListener('mouseup', () => {
        gCanvas.onmousemove = null;
        document.querySelector('#memeCanvas').style.cursor = 'grab';
    });
    gCanvas.addEventListener('mouseleave', () => {
        gCanvas.onmousemove = null;
        document.querySelector('#memeCanvas').style.cursor = 'grab';
    });
}
function onLineClicked(offsetX, offsetY) {
    let noLineClicked = true;
    let currLines = getLines();
    currLines.forEach((line, idx) => {
        if ((offsetY >= line.offsetY && offsetY <= (line.offsetY + line.size)) && (offsetX >= 10 && offsetX <= (gCanvas.width - 10))) {
            noLineClicked = false;
            changeCurrLine(idx);
            setFormValues(getCurrLine());
            unToggleEmoji();
            drawImg();
        }
    });
    if (noLineClicked) cleanHighlightedLine();
}
function onEmojiClicked(offsetX, offsetY) {
    let noEmijiClicked = true;
    let emojis = getEmojis();
    emojis.forEach((emoji, idx) => {
        if ((offsetY >= emoji.offsetY && offsetY <= (emoji.offsetY + emoji.size)) && (offsetX >= emoji.offsetX && offsetX <= (emoji.offsetX + emoji.size))) {
            noEmijiClicked = false;
            setSelectedEmoji(idx);
            unToggleLine();
        }
    });
    if (noEmijiClicked) unToggleEmoji();
}
function cleanHighlightedLine() {
    unToggleLine();
    drawImg();
}
function _resizeCanvas(elImg) {
    var elContainer = document.querySelector('.modal-container');

    gCanvas.width = (elImg.naturalWidth > elContainer.offsetWidth) ? (elContainer.offsetWidth - 20) : elImg.naturalWidth;
    gCanvas.height = elImg.naturalHeight;
}
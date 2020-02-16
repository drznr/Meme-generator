'use strict';


var gKeys = [];

function onInit() {
    _setKeywords();
    _setAutoComp();
    _populateGallery();
    initCanvas();
    handleDragEvents();
    handleKeyEvent();
    showCurrPage();
}



function onFileUploaded(ev) {
    let files = ev.target.files;
    for (let i = 0; i < files.length; i++) {
        let img = new Image();
        img.src = files[i];
        img.src = URL.createObjectURL(files[i]);
        let imgData = _createImg(img.src);
        addNewImage(imgData);
        _populateGallery();
    }
}
function onSetLang(lang) {
    setLang(lang);

    if (lang === 'he') document.body.classList.add('rtl');
    else document.body.classList.remove('rtl');

    doTrans();
}
function showCurrPage() {
    let elLinks = document.querySelectorAll('.nav-link');
    elLinks.forEach(elLink => {
        if (window.location.pathname.includes(elLink.dataset.page)) elLink.classList.add('active');
        else elLink.classList.remove('active');
    });
}
function toggleMenu() {
    document.querySelector('.nav').classList.toggle('open');
}
function onFilterChange(elKey, filterBy) {
    let keywordsMap = getAllKeywords();
    if (typeof elKey === 'object') {
        keywordsMap[filterBy]++;
        _setKeywords();
    }
    setFilter(filterBy);
    _populateGallery();
}
function closeModal() {
    document.querySelector('.modal-container').classList.remove('open');
    document.querySelector('.gallery').classList.remove('hide');;
}
function openModal(elImg) {
    setCurrMeme(elImg);
    setFormValues();
    drawImg(elImg);
    _resizeCanvas(elImg);
    createNewLine(gCanvas.height, gCanvas.width);
    document.querySelector('.modal-container').classList.add('open');
    document.querySelector('.gallery').classList.add('hide');
}
function onKeysAdd(diff) {
    changeKeywords(diff);
    _setKeywords();
}
function _populateGallery() {
    var imgs = getImgsToDisplay();
    let strHTML = '';
    imgs.forEach(img => {
        strHTML += `<img src="${img.url}" data-id="${img.id}" onclick="openModal(this)" />`
    });

    const elGallery = document.querySelector('.gallery');
    elGallery.innerHTML = strHTML;
}
function _setKeywords() {
    const elKeysContainer = document.querySelector('.keys');
    let strHTML = '';

    let newKeys = getKeywords();
    let objMap = getAllKeywords();
    if (!gKeys.includes(...newKeys)) gKeys = [...gKeys, ...newKeys];

    gKeys.forEach((key, idx) => {
        strHTML += `<span class="keyword" data-trans="key${idx + 1}" style="font-size:${16 + objMap[key]}px;" onclick="onFilterChange(this, '${key}')">${key}</span>`;
    });
    strHTML += '\n';
    elKeysContainer.innerHTML = strHTML;
}
function _setAutoComp() {
    let autoCompHTML = '';
    const elAutoComplete = document.querySelector('#keywords');

    let keys = getAllKeywords();
    Object.keys(keys).forEach((key, idx) => {
        autoCompHTML += `<option data-trans="key${idx + 1}" value="${key}" />`;
    });
    elAutoComplete.innerHTML = autoCompHTML;
}
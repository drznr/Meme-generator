'use strict';


var gKeys = [];

function onInit() {
    _setKeywords();
    _setAutoComp();
    _populateGallery();
    initCanvas();
    handleDragEvents();
    //setKeyEvent()
    showCurrPage();
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
        let diff = keywordsMap[elKey.innerText];
        diff++;
        if (!elKey.style.fontSize) elKey.style.fontSize = (16 + diff) + 'px';
        else {
            elKey.style.fontSize = (+elKey.style.fontSize.split('px')[0] + diff) + 'px';
        }
    }
    setFilter(filterBy);
    _populateGallery();
}
function closeModal() {
    document.querySelector('.modal-container').classList.remove('open');
}
function openModal(elImg) {
    setCurrMeme(elImg);
    setFormValues();
    drawImg(elImg);
    document.querySelector('.modal-container').classList.add('open');
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

    var newKeys = getKeywords();
    if (!gKeys.includes(...newKeys)) gKeys = [...gKeys, ...newKeys];

    gKeys.forEach(key => {
        strHTML += `<span class="keyword" onclick="onFilterChange(this, '${key}')">${key}</span>`;
    });
    strHTML += '\n';
    elKeysContainer.innerHTML = strHTML;
}
function _setAutoComp() {
    let autoCompHTML = '';
    const elAutoComplete = document.querySelector('#keywords');

    let keys = getAllKeywords();
    Object.keys(keys).forEach(key => {
        autoCompHTML += `<option value="${key}" />`;
    });
    elAutoComplete.innerHTML = autoCompHTML;
}
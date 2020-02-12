'use strict';

function onInit() {
    _setKeywords();
    _populateGallery();
    initCanvas();
}






function closeModal() {
    document.querySelector('.modal-container').classList.remove('open');
}
function openModal(elImg) {
    setCurrMeme(elImg);
    drawImg(elImg);
    document.querySelector('.modal-container').classList.add('open');
}
function _populateGallery() {
    var imgs = getImgs();
    let strHTML = '';
    imgs.forEach(img=> {
        strHTML += `<img src="${img.url}" data-id="${img.id}" onclick="openModal(this)" />`
    });

    const elGallery = document.querySelector('.gallery');
    elGallery.innerHTML = strHTML;
}
function _setKeywords() {
    const elKeysContainer = document.querySelector('.keys');
    const elAutoComplete = document.querySelector('#keywords');
    let strHTML = ''; 
    let autoCompHTML = '';

    Object.keys(getKeywords()).forEach(key => {
        strHTML += `<span class="keyword">${key}</span>`;
        autoCompHTML += `<option value="${key}" />`;
    });
    elKeysContainer.innerHTML = strHTML;
   elAutoComplete.innerHTML = autoCompHTML;
}
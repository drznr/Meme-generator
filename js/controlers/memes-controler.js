'use strict';

function OnInit() {
    var memes = getFromLocalStorage(STORAGE_KEY);
    var strHTML = '';
    if (memes) {
        memes.forEach(meme => {
            strHTML += `<img src="${meme}" class="meme" />`;
        });
    }
    var elContainer = document.querySelector('.main-container');
    elContainer.innerHTML = strHTML;

    
    showCurrPage();
}
function toggleMenu() {
    document.querySelector('.nav').classList.toggle('open');
}
function showCurrPage() {
    let elLinks = document.querySelectorAll('.nav-link');
    elLinks.forEach(elLink => {
        if (window.location.pathname.includes(elLink.dataset.page)) elLink.classList.add('active');
        else elLink.classList.remove('active');
    });
}
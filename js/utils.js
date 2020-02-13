'use strict';

function generatePass(passLength) {
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var pass = '';

    for (let i = 0; i < passLength; i++) {
        pass += characters.charAt(Math.round(Math.random() * characters.length));
    }
    return pass;
}

function getFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}
function saveToLocalStorage(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
}
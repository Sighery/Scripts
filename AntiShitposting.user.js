// ==UserScript==
// @name         AntiShitposting Script
// @author       Sighery
// @description  Hide all shitposts in SG
// @version      0.2.2
// @icon         https://raw.githubusercontent.com/Sighery/Scripts/master/favicon.ico
// @updateURL    https://raw.githubusercontent.com/Sighery/Scripts/master/AntiShitposting.meta.js
// @downloadURL  https://raw.githubusercontent.com/Sighery/Scripts/master/AntiShitposting.user.js
// @supportURL   https://www.steamgifts.com/discussion/3PVwH/
// @namespace    Sighery
// @match        http://www.steamgifts.com/discussions*
// ==/UserScript==

function checkLst(value) {
    if (shitposters.indexOf(value) == -1) {
        return false;
    }
    else {
        return true;
    }
}

if (window.location.href.match(".steamgifts.com/discussions") !== null){
    //To use, set inside the brackets below the exact (uppercase matters) nicks of the users
    //between quotes and each name separated by a comma, for example: "Sighery", "Sighery2"
    var shitposters = [];

    var possibleNames = document.getElementsByClassName('table__column__secondary-link');

    for (var key in possibleNames) {
        if ((possibleNames[key].parentNode.parentNode.parentNode.getAttribute('class') == "table__row-inner-wrap" || possibleNames[key].parentNode.parentNode.parentNode.getAttribute('class') == "table__row-inner-wrap is-faded") && checkLst(possibleNames[key].innerHTML)) {
            possibleNames[key].parentNode.parentNode.parentNode.parentNode.style.cssText = "display:none; border-bottom = 0; box-shadow = 0 0;";
        }
    }
}

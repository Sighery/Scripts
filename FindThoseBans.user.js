// ==UserScript==
// @name         Find Those Bans
// @author       Sighery
// @description  Finds who is suspended and adds it to the blacklist and whitelist page
// @version      0.3.6
// @icon         https://raw.githubusercontent.com/Sighery/Scripts/master/favicon.ico
// @downloadURL  https://raw.githubusercontent.com/Sighery/Scripts/master/FindThoseBans.user.js
// @updateURL    https://raw.githubusercontent.com/Sighery/Scripts/master/FindThoseBans.meta.js
// @supportURL   https://www.steamgifts.com/discussion/nV9XP/
// @namespace    Sighery
// @match        https://www.steamgifts.com/account/manage/blacklist*
// @match        https://www.steamgifts.com/account/manage/whitelist*
// @grant        GM_xmlhttpRequest
// @connect      steamgifts.com
// ==/UserScript==

var rows = getRows();
for (var i = 0; i < rows.length; i++) {
    importPage(rows[i].children[1].children[0].href, i);
}
injectRemoveAll();
addLastOnlineHeader();



function importPage(link, number) {
    GM_xmlhttpRequest({
        method: "GET",
        url: link,
        onload: function(response) {
            var tempElem = document.createElement("div");
            tempElem.innerHTML = response.responseText;
            var suspension = tempElem.getElementsByClassName("sidebar__suspension");

            if (suspension.length > 0) {
                suspension = suspension[0];
                if (suspension.textContent.trim().toLowerCase() == "banned") {
                    injectMessage(rows[number], 0);
                } else if (suspension.textContent.trim().toLowerCase() == "suspended") {
                    var suspensionTime = tempElem.getElementsByClassName("sidebar__suspension-time")[0];

                    if (suspensionTime.children.length == 1) {
                        suspensionTime = suspensionTime.children[0].textContent;
                    } else {
                        suspensionTime = suspensionTime.textContent.toLowerCase();
                    }

                    if (suspensionTime == "permanent") {
                        injectMessage(rows[number], 1);
                    } else {
                        injectMessage(rows[number], 2, /^(.*?)\sremaining/.exec(suspensionTime)[1]);
                    }
                }
            }
            var lastOnline = tempElem.getElementsByClassName("featured__table")[0].children[0].children[1].children[1];

            if (lastOnline.children[0].children.length === 0) {
                addLastOnlineDate(rows[number], lastOnline.children[0].textContent);
            } else {
                addLastOnlineDate(rows[number], "Online Now");
            }
        }
    });
}

function injectRemoveAll() {
    var newElem = document.createElement("a");
    newElem.innerHTML = "Remove all permanently suspended";
    newElem.href = "javascript:void(0)";
    document.getElementsByClassName("table__heading")[0].insertBefore(newElem, document.getElementsByClassName("table__heading")[0].children[1]);

    newElem.addEventListener("click", function() {
        var elements = document.getElementsByClassName("FTB-Permanent");

        for (var i = 0; i < elements.length; i++) {
            nParent = elements[i].parentElement.children.length;
            elements[i].parentElement.children[nParent - 1].children[0].children[0].click();
        }
    });
}

function addLastOnlineHeader() {
    var newElem = document.createElement("div");
    newElem.innerHTML = "Last online";
    newElem.style.width = "105px";
    document.getElementsByClassName("table__heading")[0].insertBefore(newElem, document.getElementsByClassName("table__heading")[0].children[1]);
}

function addLastOnlineDate(elem, time) {
    var message = document.createElement("div");
    message.innerHTML = time;

    if (elem.getElementsByClassName("FTB").length > 0) {
        message.style.paddingRight = "100px";
    } else {
        message.style.paddingRight = "250px";
    }

    elem.insertBefore(message, elem.children[2]);
}

function injectMessage(elem, type, time) {
    /*Types:
        0. Ban
        1. Permanent suspension
        2. Temporary suspension
    */

    var message = document.createElement("div");
    message.style.color = "red";
    message.style.width = "150px";

    if (type === 0) {
        message.innerHTML = "Banned";
        message.className = "FTB FTB-Permanent";
    } else if (type === 1) {
        message.innerHTML = "Permanently suspended";
        message.className = "FTB FTB-Permanent";
    } else if (type === 2) {
        message.innerHTML = "Suspended for " + time;
        message.className = "FTB FTB-Temporary";
    }

    elem.insertBefore(message, elem.children[2]);
}

function getRows() {
    return document.getElementsByClassName("table__row-inner-wrap");
}

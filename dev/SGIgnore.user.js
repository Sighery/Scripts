// ==UserScript==
// @name         SGIgnore
// @author       Sighery
// @description  Implements full-fledged ignore feature for SG
// @version      0.21
// @icon         https://raw.githubusercontent.com/Sighery/Scripts/master/favicon.ico
// @downloadURL  https://www.github.com/Sighery/Scripts/raw/master/dev/SGIgnore.user.js
// @updateURL    https://www.github.com/Sighery/Scripts/raw/master/dev/SGIgnore.meta.js
// @supportURL   https://www.steamgifts.com/discussion/PLACEHOLDER/
// @namespace    Sighery
// @match        https://www.steamgifts.com/*
// ==/UserScript==

//The every list, that means everything from him/her will be hidden:
var ignoreLst = ["fyantastic", "combatbeard", "foe", "sickteddybear", "endlesshorizon",
"cifudux", "tzaar", "wallister", "lostsoulvl", "phucmm1125", "brokesmile", "rockyy",
"shindo", "linerax", "beatness", "dimaleth", "murattheinfidel"];
//Some of these things not working yet
//The ignore GAs by an user list:
var ignoreGALst;
//The ignore discussions by an user list:
var ignoreDiscussionLst;
//The ignore trades by an user list:
var ignoreTradeLst;
//The ignore comments by an user list:
var ignoreCommentLst;
//The ignore inbox comments by an user list, not planning to implement it for the moment:
var ignoreInboxLst = [];
//The ignore specific thread list:
var threadsLst = ["O9jSA"];
//The ignore specific comment list, not planning to implement it for the moment:
var commentsLst = [];
//The ignore specific GA list:
var giveawaysLst = [];
//The ignore specific trade list:
var tradesLst = [];
//The list for blacklisted users, in case the user wants to import those:
var blacklistedLst = [];

start();

function retrieveLocal(element) {
    console.log("Retrieving: " + element);
    var retrieved = localStorage.getItem(element);
    console.log("Retrieved: " + retrieved);
    if (retrieved !== null) {
        return JSON.parse(retrieved);
    } else {
        return [];
    }
}

function injectInterface() {
    injectRow();
    injectDialog();
    injectDlgStyle();
    injectFunctions();
}

function injectDialog() {
    var dlgBox = document.createElement('div');
    dlgBox.setAttribute('id', 'SGIgnore-dlgbox');
    dlgBox.appendChild(document.createElement('div'));
    dlgBox.appendChild(document.createElement('div'));
    document.body.insertBefore(dlgBox, document.body.children[0]);

    var blackbg = document.createElement('div');
    blackbg.setAttribute('id', 'SGIgnore-black-background');
    document.body.insertBefore(blackbg, dlgBox);

    var dlgHeader = dlgBox.children[0];
    dlgHeader.setAttribute('id', 'SGIgnore-dlg-header');
    dlgHeader.appendChild(document.createElement('div'));
    dlgHeader.children[0].setAttribute('id', 'SGIgnore-dlg-header-title');
    dlgHeader.children[0].innerHTML = "SGIgnore";
    dlgHeader.appendChild(document.createElement('button'));
    dlgHeader.children[1].setAttribute('id', 'SGIgnore-close');
    dlgHeader.children[1].appendChild(document.createElement('i'));
    dlgHeader.children[1].children[0].setAttribute('class', 'fa fa-times');
    dlgHeader.children[1].children[0].style.fontSize = "25px";
    dlgHeader.children[1].children[0].style.marginTop = "-6px";

    var dlgBody = dlgBox.children[1];
    dlgBody.setAttribute('id', 'SGIgnore-dlg-body');
    dlgBody.appendChild(document.createElement("input"));
    dlgBody.children[0].placeholder = "Add nick and click the button with the list you want to add to";
    dlgBody.children[0].style.marginBottom = "2px";
    dlgBody.children[0].id = "SGIgnore-AddUser";

    dlgBody.appendChild(document.createElement("button"));
    dlgBody.children[1].className = "SGIgnore-button";
    dlgBody.children[1].innerHTML = "Every";
    dlgBody.children[1].id = "SGIgnore-AddUser-Every";

    dlgBody.appendChild(document.createElement("button"));
    dlgBody.children[2].className = "SGIgnore-button";
    dlgBody.children[2].innerHTML = "Giveaways";
    dlgBody.children[2].id = "SGIgnore-AddUser-Giveaways";

    dlgBody.appendChild(document.createElement("button"));
    dlgBody.children[3].className = "SGIgnore-button";
    dlgBody.children[3].innerHTML = "Discussions";
    dlgBody.children[3].id = "SGIgnore-AddUser-Discussions";

    dlgBody.appendChild(document.createElement("button"));
    dlgBody.children[4].className = "SGIgnore-button";
    dlgBody.children[4].innerHTML = "Trades";
    dlgBody.children[4].id = "SGIgnore-AddUser-Trades";

    dlgBody.appendChild(document.createElement("button"));
    dlgBody.children[5].className = "SGIgnore-button";
    dlgBody.children[5].innerHTML = "Comments";
    dlgBody.children[5].id = "SGIgnore-AddUser-Comments";

    dlgBody.appendChild(document.createElement("br"));
    dlgBody.appendChild(document.createElement("br"));

    dlgBody.appendChild(document.createElement("input"));
    dlgBody.children[8].placeholder = "Add nick and click the button with the list you want to remove from";
    dlgBody.children[8].style.marginBottom = "2px";
    dlgBody.children[8].id = "SGIgnore-RemoveUser";

    dlgBody.appendChild(document.createElement("button"));
    dlgBody.children[9].className = "SGIgnore-button";
    dlgBody.children[9].innerHTML = "Every";
    dlgBody.children[9].id = "SGIgnore-RemoveUser-Every";

    dlgBody.appendChild(document.createElement("button"));
    dlgBody.children[10].className = "SGIgnore-button";
    dlgBody.children[10].innerHTML = "Giveaways";
    dlgBody.children[10].id = "SGIgnore-RemoveUser-Giveaways";

    dlgBody.appendChild(document.createElement("button"));
    dlgBody.children[11].className = "SGIgnore-button";
    dlgBody.children[11].innerHTML = "Discussions";
    dlgBody.children[11].id = "SGIgnore-RemoveUser-Discussions";

    dlgBody.appendChild(document.createElement("button"));
    dlgBody.children[12].className = "SGIgnore-button";
    dlgBody.children[12].innerHTML = "Trades";
    dlgBody.children[12].id = "SGIgnore-RemoveUser-Trades";

    dlgBody.appendChild(document.createElement("button"));
    dlgBody.children[13].className = "SGIgnore-button";
    dlgBody.children[13].innerHTML = "Comments";
    dlgBody.children[13].id = "SGIgnore-RemoveUser-Comments";

    dlgBody.appendChild(document.createElement("br"));
    dlgBody.appendChild(document.createElement("br"));

    dlgBody.appendChild(document.createElement("p"));
    dlgBody.children[16].innerHTML = "OPTIONS";
    dlgBody.children[16].style.color = "rgb(62, 56, 56)";
    dlgBody.children[16].style.float = "right";
    dlgBody.children[16].style.fontWeight = "bold";
    dlgBody.children[16].style.fontSize = "25px";

    dlgBody.appendChild(document.createElement("input"));
    dlgBody.children[17].type = "checkbox";
    dlgBody.children[17].id = "SGIgnore-Options-Giveaways";
    dlgBody.children[17].className = "SGIgnore-Options-Checkbox";

    dlgBody.appendChild(document.createElement("label"));
    dlgBody.children[18].htmlFor = "SGIgnore-Options-Giveaways";
    dlgBody.children[18].innerHTML = "Hide giveaways ";
    dlgBody.children[18].className = "SGIgnore-Options-Label";

    dlgBody.appendChild(document.createElement("br"));

    dlgBody.appendChild(document.createElement("input"));
    dlgBody.children[20].type = "checkbox";
    dlgBody.children[20].id = "SGIgnore-Options-Discussions";
    dlgBody.children[20].className = "SGIgnore-Options-Checkbox";

    dlgBody.appendChild(document.createElement("label"));
    dlgBody.children[21].htmlFor = "SGIgnore-Options-Discussions";
    dlgBody.children[21].innerHTML = "Hide discussions ";
    dlgBody.children[21].className = "SGIgnore-Options-Label";

    dlgBody.appendChild(document.createElement("br"));

    dlgBody.appendChild(document.createElement("input"));
    dlgBody.children[23].type = "checkbox";
    dlgBody.children[23].id = "SGIgnore-Options-Trades";
    dlgBody.children[23].className = "SGIgnore-Options-Checkbox";

    dlgBody.appendChild(document.createElement("label"));
    dlgBody.children[24].htmlFor = "SGIgnore-Options-Trades";
    dlgBody.children[24].innerHTML = "Hide trades ";
    dlgBody.children[24].className = "SGIgnore-Options-Label";

    dlgBody.appendChild(document.createElement("br"));

    dlgBody.appendChild(document.createElement("input"));
    dlgBody.children[26].type = "checkbox";
    dlgBody.children[26].id = "SGIgnore-Options-InboxComments";
    dlgBody.children[26].className = "SGIgnore-Options-Checkbox";

    dlgBody.appendChild(document.createElement("label"));
    dlgBody.children[27].htmlFor = "SGIgnore-Options-InboxComments";
    dlgBody.children[27].innerHTML = "Hide inbox comments ";
    dlgBody.children[27].className = "SGIgnore-Options-Label";

    dlgBody.appendChild(document.createElement("br"));

    dlgBody.appendChild(document.createElement("input"));
    dlgBody.children[29].type = "checkbox";
    dlgBody.children[29].id = "SGIgnore-Options-GiveawayComments";
    dlgBody.children[29].className = "SGIgnore-Options-Checkbox";

    dlgBody.appendChild(document.createElement("label"));
    dlgBody.children[30].htmlFor = "SGIgnore-Options-GiveawayComments";
    dlgBody.children[30].innerHTML = "Hide giveaway comments ";
    dlgBody.children[30].className = "SGIgnore-Options-Label";

    dlgBody.appendChild(document.createElement("br"));

    dlgBody.appendChild(document.createElement("input"));
    dlgBody.children[32].type = "checkbox";
    dlgBody.children[32].id = "SGIgnore-Options-DiscussionComments";
    dlgBody.children[32].className = "SGIgnore-Options-Checkbox";

    dlgBody.appendChild(document.createElement("label"));
    dlgBody.children[33].htmlFor = "SGIgnore-Options-DiscussionComments";
    dlgBody.children[33].innerHTML = "Hide discussion comments ";
    dlgBody.children[33].className = "SGIgnore-Options-Label";

    dlgBody.appendChild(document.createElement("br"));

    dlgBody.appendChild(document.createElement("input"));
    dlgBody.children[35].type = "checkbox";
    dlgBody.children[35].id = "SGIgnore-Options-TradeComments";
    dlgBody.children[35].className = "SGIgnore-Options-Checkbox";

    dlgBody.appendChild(document.createElement("label"));
    dlgBody.children[36].htmlFor = "SGIgnore-Options-TradeComments";
    dlgBody.children[36].innerHTML = "Hide trade comments";
    dlgBody.children[36].className = "SGIgnore-Options-Label";

    dlgBody.appendChild(document.createElement("br"));

    dlgBody.appendChild(document.createElement("input"));
    dlgBody.children[38].type = "checkbox";
    dlgBody.children[38].id = "SGIgnore-Options-DeletedComments";
    dlgBody.children[38].className = "SGIgnore-Options-Checkbox";

    dlgBody.appendChild(document.createElement("label"));
    dlgBody.children[39].htmlFor = "SGIgnore-Options-DeletedComments";
    dlgBody.children[39].innerHTML = "Hide deleted comments with no children";
    dlgBody.children[39].className = "SGIgnore-Options-Label";

    dlgBody.appendChild(document.createElement("br"));

    dlgBody.appendChild(document.createElement("input"));
    dlgBody.children[41].type = "checkbox";
    dlgBody.children[41].id = "SGIgnore-Options-MarkRead";
    dlgBody.children[41].className = "SGIgnore-Options-Checkbox";

    dlgBody.appendChild(document.createElement("label"));
    dlgBody.children[42].htmlFor = "SGIgnore-Options-MarkRead";
    dlgBody.children[42].innerHTML = "Mark as read automatically";
    dlgBody.children[42].className = "SGIgnore-Options-Label";

    dlgBody.appendChild(document.createElement("a"));
    dlgBody.children[43].href = "https://www.steamgifts.com/discussion/PLACEHOLDER/";
    dlgBody.children[43].innerHTML = "Thread";
    dlgBody.children[43].style.color = "rgb(62, 56, 56)";
    dlgBody.children[43].style.float = "right";
    dlgBody.children[43].style.fontStyle = "italic";
    dlgBody.children[43].style.textDecoration = "underline";
    dlgBody.children[43].style.fontSize = "20px";

    document.getElementById('SGIgnore-close').addEventListener('click', function() {
        var blackbg = document.getElementById('SGIgnore-black-background');
        var dlg = document.getElementById('SGIgnore-dlgbox');

        blackbg.style.display = 'none';
        dlg.style.display = 'none';
        //console.log("Clicked the closeRC button. Hiding of the interface was succesful.");
    });

    blackbg.addEventListener('click', function() {
        var blackbg = document.getElementById('SGIgnore-black-background');
        var dlg = document.getElementById('SGIgnore-dlgbox');

        blackbg.style.display = "none";
        dlg.style.display = "none";
        //console.log("Clicked the black background. Hiding of the interface was succesful.");
    });

    function getIndex(value, array) {
        var index = array.indexOf(value);
        return index;
    }

    dlgBody.children[1].addEventListener("click", function() {
        var value = document.getElementById("SGIgnore-AddUser").value;
        value = value.trim();
        value = value.toLowerCase();
        var retrieved = localStorage.getItem("SGIgnore-AddUser-Every");
        if (retrieved === null) {
            var array = [value];
            localStorage.setItem("SGIgnore-AddUser-Every", JSON.stringify(array));
        } else {
            var retrievedParsed = JSON.parse(retrieved);
            if (getIndex(value, retrievedParsed) == -1) {
                retrievedParsed.push(value);
                localStorage.setItem("SGIgnore-AddUser-Every", JSON.stringify(retrievedParsed));
            } else {
                alert("The user is already on this list");
            } document.getElementById("SGIgnore-AddUser").value = "";
        }
    });

    dlgBody.children[2].addEventListener("click", function() {
        var value = document.getElementById("SGIgnore-AddUser").value;
        value = value.trim();
        value = value.toLowerCase();
        var retrieved = localStorage.getItem("SGIgnore-AddUser-Giveaways");
        if (retrieved === null) {
            var array = [value];
            localStorage.setItem("SGIgnore-AddUser-Giveaways", JSON.stringify(array));
        } else {
            var retrievedParsed = JSON.parse(retrieved);
            if (getIndex(value, retrievedParsed) == -1) {
                retrievedParsed.push(value);
                localStorage.setItem("SGIgnore-AddUser-Giveaways", JSON.stringify(retrievedParsed));
            } else {
                alert("The user is already on this list");
            } document.getElementById("SGIgnore-AddUser").value = "";
        }
    });

    dlgBody.children[3].addEventListener("click", function() {
        var value = document.getElementById("SGIgnore-AddUser").value;
        value = value.trim();
        value = value.toLowerCase();
        var retrieved = localStorage.getItem("SGIgnore-AddUser-Discussions");
        if (retrieved === null) {
            var array = [value];
            localStorage.setItem("SGIgnore-AddUser-Discussions", JSON.stringify(array));
        } else {
            var retrievedParsed = JSON.parse(retrieved);
            if (getIndex(value, retrievedParsed) == -1) {
                retrievedParsed.push(value);
                localStorage.setItem("SGIgnore-AddUser-Discussions", JSON.stringify(retrievedParsed));
            } else {
                alert("The user is already on this list");
            } document.getElementById("SGIgnore-AddUser").value = "";
        }
    });

    dlgBody.children[4].addEventListener("click", function() {
        var value = document.getElementById("SGIgnore-AddUser").value;
        value = value.trim();
        value = value.toLowerCase();
        var retrieved = localStorage.getItem("SGIgnore-AddUser-Trades");
        if (retrieved === null) {
            var array = [value];
            localStorage.setItem("SGIgnore-AddUser-Trades", JSON.stringify(array));
        } else {
            var retrievedParsed = JSON.parse(retrieved);
            if (getIndex(value, retrievedParsed) == -1) {
                retrievedParsed.push(value);
                localStorage.setItem("SGIgnore-AddUser-Trades", JSON.stringify(retrievedParsed));
            } else {
                alert("The user is already on this list");
            } document.getElementById("SGIgnore-AddUser").value = "";
        }
    });

    dlgBody.children[5].addEventListener("click", function() {
        var value = document.getElementById("SGIgnore-AddUser").value;
        value = value.trim();
        value = value.toLowerCase();
        var retrieved = localStorage.getItem("SGIgnore-AddUser-Comments");
        if (retrieved === null) {
            var array = [value];
            localStorage.setItem("SGIgnore-AddUser-Comments", JSON.stringify(array));
        } else {
            var retrievedParsed = JSON.parse(retrieved);
            if (getIndex(value, retrievedParsed) == -1) {
                retrievedParsed.push(value);
                localStorage.setItem("SGIgnore-AddUser-Comments", JSON.stringify(retrievedParsed));
            } else {
                alert("The user is already on this list");
            } document.getElementById("SGIgnore-AddUser").value = "";
        }
    });

    dlgBody.children[9].addEventListener("click", function() {
        var value = document.getElementById("SGIgnore-RemoveUser").value;
        value = value.trim();
        value = value.toLowerCase();
        var retrieved = localStorage.getItem("SGIgnore-AddUser-Every");
        if (retrieved !== null) {
            var retrievedParsed = JSON.parse(retrieved);
            var index = getIndex(value, retrievedParsed);
            if (index != -1) {
                retrievedParsed.splice(index, 1);
                localStorage.setItem("SGIgnore-AddUser-Every", JSON.stringify(retrievedParsed));
            }
            document.getElementById("SGIgnore-RemoveUser-Every").className = "SGIgnore-button";
            document.getElementById("SGIgnore-RemoveUser-Every").removeAttribute("title");
            document.getElementById("SGIgnore-AddUser-Every").className = "SGIgnore-button";
            document.getElementById("SGIgnore-AddUser-Every").removeAttribute("title");
            document.getElementById("SGIgnore-RemoveUser").value = "";
        }
    });

    dlgBody.children[10].addEventListener("click", function() {
        var value = document.getElementById("SGIgnore-RemoveUser").value;
        value = value.trim();
        value = value.toLowerCase();
        var retrieved = localStorage.getItem("SGIgnore-AddUser-Giveaways");
        if (retrieved !== null) {
            var retrievedParsed = JSON.parse(retrieved);
            var index = getIndex(value, retrievedParsed);
            if (index != -1) {
                retrievedParsed.splice(index, 1);
                localStorage.setItem("SGIgnore-AddUser-Giveaways", JSON.stringify(retrievedParsed));
            }
            document.getElementById("SGIgnore-RemoveUser-Giveaways").className = "SGIgnore-button";
            document.getElementById("SGIgnore-RemoveUser-Giveaways").removeAttribute("title");
            document.getElementById("SGIgnore-AddUser-Giveaways").className = "SGIgnore-button";
            document.getElementById("SGIgnore-AddUser-Giveaways").removeAttribute("title");
            document.getElementById("SGIgnore-RemoveUser").value = "";
        }
    });

    dlgBody.children[11].addEventListener("click", function() {
        var value = document.getElementById("SGIgnore-RemoveUser").value;
        value = value.trim();
        value = value.toLowerCase();
        var retrieved = localStorage.getItem("SGIgnore-AddUser-Discussions");
        if (retrieved !== null) {
            var retrievedParsed = JSON.parse(retrieved);
            var index = getIndex(value, retrievedParsed);
            if (index != -1) {
                retrievedParsed.splice(index, 1);
                localStorage.setItem("SGIgnore-AddUser-Discussions", JSON.stringify(retrievedParsed));
            }
            document.getElementById("SGIgnore-RemoveUser-Discussions").className = "SGIgnore-button";
            document.getElementById("SGIgnore-RemoveUser-Discussions").removeAttribute("title");
            document.getElementById("SGIgnore-AddUser-Discussions").className = "SGIgnore-button";
            document.getElementById("SGIgnore-AddUser-Discussions").removeAttribute("title");
            document.getElementById("SGIgnore-RemoveUser").value = "";
        }
    });

    dlgBody.children[12].addEventListener("click", function() {
        var value = document.getElementById("SGIgnore-RemoveUser").value;
        value = value.trim();
        value = value.toLowerCase();
        var retrieved = localStorage.getItem("SGIgnore-AddUser-Trades");
        if (retrieved !== null) {
            var retrievedParsed = JSON.parse(retrieved);
            var index = getIndex(value, retrievedParsed);
            if (index != -1) {
                retrievedParsed.splice(index, 1);
                localStorage.setItem("SGIgnore-AddUser-Trades", JSON.stringify(retrievedParsed));
            }
            document.getElementById("SGIgnore-RemoveUser-Trades").className = "SGIgnore-button";
            document.getElementById("SGIgnore-RemoveUser-Trades").removeAttribute("title");
            //document.getElementById("SGIgnore-RemoveUser-Trades").removeAttribute("aria-describedby");
            document.getElementById("SGIgnore-AddUser-Trades").className = "SGIgnore-button";
            document.getElementById("SGIgnore-AddUser-Trades").removeAttribute("title");
            document.getElementById("SGIgnore-RemoveUser").value = "";
        }
    });

    dlgBody.children[13].addEventListener("click", function() {
        var value = document.getElementById("SGIgnore-RemoveUser").value;
        value = value.trim();
        value = value.toLowerCase();
        var retrieved = localStorage.getItem("SGIgnore-AddUser-Comments");
        if (retrieved !== null) {
            var retrievedParsed = JSON.parse(retrieved);
            var index = getIndex(value, retrievedParsed);
            if (index != -1) {
                retrievedParsed.splice(index, 1);
                localStorage.setItem("SGIgnore-AddUser-Comments", JSON.stringify(retrievedParsed));
            }
            document.getElementById("SGIgnore-RemoveUser-Comments").className = "SGIgnore-button";
            //document.getElementById("SGIgnore-RemoveUser-Comments").removeAttribute("title");
            document.getElementById("SGIgnore-AddUser-Comments").className = "SGIgnore-button";
            document.getElementById("SGIgnore-AddUser-Comments").removeAttribute("title");
            document.getElementById("SGIgnore-RemoveUser").value = "";
            document.getElementById("SGIgnore-RemoveUser-Comments").removeAttribute("title");
        }
    });

    dlgBody.children[17].addEventListener("click", function() {
        var value = dlgBody.children[17].checked;
        if (value) {
            localStorage.setItem("SGIgnore-Options-Giveaways", true);
        } else {
            localStorage.removeItem("SGIgnore-Options-Giveaways");
        }
    });

    dlgBody.children[20].addEventListener("click", function() {
        var value = dlgBody.children[20].checked;
        if (value) {
            localStorage.setItem("SGIgnore-Options-Discussions", true);
        } else {
            localStorage.removeItem("SGIgnore-Options-Discussions");
        }
    });

    dlgBody.children[23].addEventListener("click", function() {
        var value = dlgBody.children[23].checked;
        if (value) {
            localStorage.setItem("SGIgnore-Options-Trades", true);
        } else {
            localStorage.removeItem("SGIgnore-Options-Trades");
        }
    });

    dlgBody.children[26].addEventListener("click", function() {
        var value = dlgBody.children[26].checked;
        if (value) {
            localStorage.setItem("SGIgnore-Options-InboxComments", true);
        } else {
            localStorage.removeItem("SGIgnore-Options-InboxComments");
        }
    });

    dlgBody.children[29].addEventListener("click", function() {
        var value = dlgBody.children[29].checked;
        if (value) {
            localStorage.setItem("SGIgnore-Options-GiveawayComments", true);
        } else {
            localStorage.removeItem("SGIgnore-Options-GiveawayComments");
        }
    });

    dlgBody.children[32].addEventListener("click", function() {
        var value = dlgBody.children[32].checked;
        if (value) {
            localStorage.setItem("SGIgnore-Options-DiscussionComments", true);
        } else {
            localStorage.removeItem("SGIgnore-Options-DiscussionComments");
        }
    });

    dlgBody.children[35].addEventListener("click", function() {
        var value = dlgBody.children[35].checked;
        if (value) {
            localStorage.setItem("SGIgnore-Options-TradeComments", true);
        } else {
            localStorage.removeItem("SGIgnore-Options-TradeComments");
        }
    });

    dlgBody.children[38].addEventListener("click", function() {
        var value = dlgBody.children[38].checked;
        if (value) {
            localStorage.setItem("SGIgnore-Options-DeletedComments", true);
            console.log("SGIgnore-Options-DeletedComments set to true");
        } else {
            localStorage.removeItem("SGIgnore-Options-DeletedComments");
            console.log("SGIgnore-Options-DeletedComments deleted from localStorage");
        }
    });

    dlgBody.children[41].addEventListener("click", function() {
        var value = dlgBody.children[41].checked;
        if (value) {
            localStorage.setItem("SGIgnore-Options-MarkRead", true);
        } else {
            localStorage.removeItem("SGIgnore-Options-MarkRead");
        }
    });
}

function injectFunctions() {
    var scriptcode = [
        "function SGIgnoreRetrieveChecked() {",
        "    if (localStorage.getItem('SGIgnore-Options-Giveaways') == 'true') {",
        "        document.getElementById('SGIgnore-Options-Giveaways').checked = true;",
        "    }",
        "    if (localStorage.getItem('SGIgnore-Options-Discussions') == 'true') {",
        "        document.getElementById('SGIgnore-Options-Discussions').checked = true;",
        "    }",
        "    if (localStorage.getItem('SGIgnore-Options-Trades') == 'true') {",
        "        document.getElementById('SGIgnore-Options-Trades').checked = true;",
        "    }",
        "    if (localStorage.getItem('SGIgnore-Options-InboxComments') == 'true') {",
        "        document.getElementById('SGIgnore-Options-InboxComments').checked = true;",
        "    }",
        "    if (localStorage.getItem('SGIgnore-Options-GiveawayComments') == 'true') {",
        "        document.getElementById('SGIgnore-Options-GiveawayComments').checked = true;",
        "    }",
        "    if (localStorage.getItem('SGIgnore-Options-DiscussionComments') == 'true') {",
        "        document.getElementById('SGIgnore-Options-DiscussionComments').checked = true;",
        "    }",
        "    if (localStorage.getItem('SGIgnore-Options-TradeComments') == 'true') {",
        "        document.getElementById('SGIgnore-Options-TradeComments').checked = true;",
        "    }",
        "    if (localStorage.getItem('SGIgnore-Options-DeletedComments') == 'true') {",
        "        document.getElementById('SGIgnore-Options-DeletedComments').checked = true;",
        "    }",
        "    if (localStorage.getItem('SGIgnore-Options-MarkRead') == 'true') {",
        "        document.getElementById('SGIgnore-Options-MarkRead').checked = true;",
        "    }",
        "}",
        "",
        "SGIgnoreRetrieveChecked();"
    ].join("\n");
    var node = document.createElement('script');
    node.type = "text/javascript";
    node.appendChild(document.createTextNode(scriptcode));
    document.head.appendChild(node);
}

function injectDlgStyle() {
    var dialogCSS = [
            "#SGIgnore-black-background {",
            "  display: none;",
            "  width: 100%;",
            "  height: 100%;",
            "  position: fixed;",
            "  top: 0px;",
            "  left: 0px;",
            "  background-color: rgba(0, 0, 0, 0.75);",
            "  z-index: 8888;",
            "}",
            "#SGIgnore-dlgbox{",
            "  display: none;",
            "  position: fixed;",
            "  width: 500px;",
            "  z-index: 9999;",
            "  border-radius: 10px;",
            "  background-color: #7c7d7e;",
            "}",
            "#SGIgnore-dlg-header {",
            "  background-color: #6D84B4;",
            "  padding: 10px;",
            "  padding-bottom: 30px;",
            "  margin: 10px 10px 10px 10px;",
            "  color: white;",
            "  font-size: 20px;",
            "}",
            "#SGIgnore-dlg-header-title {",
            "  float: left;",
            "}",
            "#SGIgnore-dlg-body{",
            "  clear: both;",
            "  background-color: #C3C3C3;",
            "  color: white;",
            "  font-size: 14px;",
            "  padding: 10px;",
            "  margin: 0px 10px 10px 10px;",
            "}",
            "#SGIgnore-close {",
            "  background-color: transparent;",
            "  color: white;",
            "  float: right;",
            "  border: none;",
            "  font-size: 25px;",
            "  margin-top: -5px;",
            "  opacity: 0.7;",
            "}",
            ".SGIgnore-button{",
            "  margin-right: 4px;",
            "  background-color: #fff;",
            "  border: 2px solid #333;",
            "  box-shadow: 1px 1px 0 #333,",
            "              2px 2px 0 #333,",
            "              3px 3px 0 #333,",
            "              4px 4px 0 #333,",
            "              5px 5px 0 #333;",
            "  color: #333;",
            "  display: inline-block;",
            "  padding: 4px 6px;",
            "  position: relative;",
            "  text-decoration: none;",
            "  text-transform: uppercase;",
            "  -webkit-transition: .1s;",
            "     -moz-transition: .1s;",
            "      -ms-transition: .1s;",
            "       -o-transition: .1s;",
            "          transition: .1s;",
            "}",
            ".SGIgnore-button:hover {",
            "  background-color: #edd;",
            "}",
            ".SGIgnore-button:active {",
            "  box-shadow: 1px 1px 0 #333;",
            "  left: 4px;",
            "  top: 4px;",
            "}",
            ".SGIgnore-button-highlighted {",
            "  margin-right: 4px;",
            "  background-color: #000000;",
            "  border: 2px solid #333;",
            "  box-shadow: 1px 1px 0 #333,",
            "              2px 2px 0 #333,",
            "              3px 3px 0 #333,",
            "              4px 4px 0 #333,",
            "              5px 5px 0 #333;",
            "  color: #FFFFFF;",
            "  display: inline-block;",
            "  padding: 4px 6px;",
            "  position: relative;",
            "  text-decoration: none;",
            "  text-transform: uppercase;",
            "  -webkit-transition: .1s;",
            "     -moz-transition: .1s;",
            "      -ms-transition: .1s;",
            "       -o-transition: .1s;",
            "          transition: .1s;",
            "}",
            ".SGIgnore-button-highlighted:hover {",
            "  background-color: #635757;",
            "}",
            ".SGIgnore-button-highlighted:active {",
            "  box-shadow: 1px 1px 0 #333;",
            "  left: 4px;",
            "  top: 4px;",
            "}",
            ".SGIgnore-Options-Checkbox {",
            "  width: initial;",
            "  margin-bottom: 5px;",
            "}",
            ".SGIgnore-Options-Label {",
            "  color: rgb(62, 56, 56);",
            "}"
    ].join("\n");
    var node = document.createElement('style');
    node.type = "text/css";
    node.appendChild(document.createTextNode(dialogCSS));
    document.getElementsByTagName('head')[0].appendChild(node);
}

function injectRow() {
    var accountTabDropdown = document.getElementsByClassName("nav__right-container")[0].children[3].children[2].children[0];

    nElementsDropdown = accountTabDropdown.children.length;

    var row = document.createElement("a");
    row.className = "nav__row";
    row.href = "javascript:void(0)";

    row.appendChild(document.createElement("i"));
    row.children[0].className = "icon-red fa fa-fw fa-user-times";

    row.appendChild(document.createElement("div"));
    row.children[1].className = "nav__row__summary";

    row.children[1].appendChild(document.createElement("p"));
    row.children[1].children[0].className = "nav__row__summary__name";
    row.children[1].children[0].innerHTML = "SGIgnore";

    row.children[1].appendChild(document.createElement("p"));
    row.children[1].children[1].className = "nav__row__summary__description";
    row.children[1].children[1].innerHTML = "Change the options for the script.";

    //Needs proper handing, checking and more research, FIX NEEDED BEFORE RELEASE:
    accountTabDropdown.insertBefore(row, accountTabDropdown.getElementsByClassName("fa fa-fw fa-sign-out")[0].parentNode);
    /*if (nElementsDropdown < 3) {
        accountTabDropdown.insertBefore(row, accountTabDropdown.children[nElementsDropdown - 1]);
    } else {
        accountTabDropdown.insertBefore(row, accountTabDropdown.children[2]);
    }*/

    row.addEventListener('click', function() {
        var blackbg = document.getElementById('SGIgnore-black-background');
        var dlg = document.getElementById('SGIgnore-dlgbox');
        blackbg.style.display = 'block';
        dlg.style.display = 'block';

        var winWidth = window.innerWidth;
        var winHeight = window.innerHeight;

        dlg.style.left = (winWidth/2) - 500/2 + 'px';
        dlg.style.top = '150px';
        //console.log("Clicked the injected row. Showing the interface was succesful");
    });
}

function start() {
    var comments;
    var i;
    var commentsLen;
    var threads;
    var giveaways;

    ignoreLst = retrieveLocal("SGIgnore-AddUser-Every");
    ignoreDiscussionLst = retrieveLocal("SGIgnore-AddUser-Discussions");
    ignoreGALst = retrieveLocal("SGIgnore-AddUser-Giveaways");
    ignoreTradeLst = retrieveLocal("SGIgnore-AddUser-Trades");
    ignoreCommentLst = retrieveLocal("SGIgnore-AddUser-Comments");
    giveawaysLst = retrieveLocal("SGIgnore-SpecificIgnore-Giveaways");
    threadsLst = retrieveLocal("SGIgnore-SpecificIgnore-Discussions");
    tradesLst = retrieveLocal("SGIgnore-SpecificIgnore-Trades");

    injectInterface();

    if (window.location.href.match(".steamgifts.com/discussion/") !== null && checkOption("SGIgnore-Options-DeletedComments") && checkOption("SGIgnore-Options-DiscussionComments")) {
        comments = getComments();

        if (document.getElementsByClassName("notification notification--warning notification--margin-top").length > 0) {
            commentsLen = comments.length;
        } else {
            commentsLen = comments.length - 1;
        }

        for (i = 1; i < commentsLen; i++) {
            hideComment(comments[i]);
        }
    } else if (window.location.href.match(".steamgifts.com/discussion/") !== null && checkOption("SGIgnore-Options-DiscussionComments")) {
        comments = getComments();
        //console.log("Reached discussion part");

        if (document.getElementsByClassName("notification notification--warning notification--margin-top").length > 0) {
            commentsLen = comments.length;
        } else {
            commentsLen = comments.length - 1;
        }

        for (i = 1; i < commentsLen; i++) {
            hideComment(comments[i]);
        }
    } else if (window.location.href.match(".steamgifts.com/discussion/") !== null && checkOption("SGIgnore-Options-DeletedComments")) {
        comments = getDeletedComments();
        //console.log("Reached the discussion deleted comments else if");

        for (i = 0; i < comments.length; i++) {
            hideDeletedComment(comments[i].parentNode.parentNode);
        }
    } else if (window.location.href.match(".steamgifts.com/discussions") !== null) {
        //console.log("Reached discussions part");
        if (checkOption("SGIgnore-Options-Discussions")) {
            hideThreads();
        } else {
            threads = document.getElementsByClassName('table__row-inner-wrap');

            for (i = 0; i < threads.length; i++) {
                if (checkLst(getThreadID(threads[i]), threadsLst)) {
                    threads[i].parentNode.style.display = "none";
                } else {
                    hideButton(threads[i].children[1].children[0], getThreadID(threads[i]), "discussions");
                }
            }
        }
    } else if (window.location.href.match(".steamgifts.com/messages") !== null && checkOption("SGIgnore-Options-InboxComments")) {
        comments = getComments();

        for (i = 0; i < comments.length; i++) {
            hideComment(comments[i]);
        }
    } else if (window.location.href.match(".steamgifts.com/giveaway/") !== null && checkOption("SGIgnore-Options-GiveawayComments") && checkOption("SGIgnore-Options-DeletedComments")) {
        comments = getComments();
        //console.log("Reached giveaway comments else if 1");

        for (i = 0; i < comments.length - 1; i++) {
            hideComment(comments[i]);
        }
    } else if (window.location.href.match(".steamgifts.com/giveaway/") !== null && checkOption("SGIgnore-Options-DeletedComments")) {
        comments = getDeletedComments();
        //console.log("Reached giveaway comments else if 2");

        for (i = 0; i < comments.length; i++) {
            hideDeletedComment(comments[i].parentNode.parentNode);
        }
    } else if (window.location.href.match(".steamgifts.com/giveaway/") !== null && checkOption("SGIgnore-Options-GiveawayComments")) {
        comments = getComments();
        //console.log("Reached deleted comments in giveaway else if");

        for (i = 0; i < comments.length - 1; i++) {
            hideComment(comments[i]);
        }
    } else if (window.location.href == "https://www.steamgifts.com/" || window.location.href.match(".steamgifts.com/giveaways") !== null) {
        if (checkOption("SGIgnore-Options-Giveaways") && checkOption("SGIgnore-Options-Discussions")) {
            hideGiveaways();
            hideThreads();
        } else if (checkOption("SGIgnore-Options-Giveaways")) {
            hideGiveaways();
        } else if (checkOption("SGIgnore-Options-Discussions")) {
            hideThreads();
        } else {
            giveaways = document.getElementsByClassName("giveaway__username");

            for (i = 0; i < giveaways.length; i++) {
                if (checkLst(getGAID(giveaways[i]), giveawaysLst)) {
                    giveaways[i].parentNode.parentNode.parentNode.parentNode.parentNode.style.display = "none";
                } else {
                    hideButton(giveaways[i].parentNode.parentNode.previousElementSibling, getGAID(giveaways[i]), "giveaways");
                }
            }

            threads = document.getElementsByClassName('table__row-inner-wrap');

            for (i = 0; i < threads.length; i++) {
                if (checkLst(getThreadID(threads[i]), threadsLst)) {
                    threads[i].parentNode.style.display = "none";
                } else {
                    hideButton(threads[i].children[1].children[0], getThreadID(threads[i]), "discussions");
                }
            }
        }
    /*} else if (window.location.href == "https://www.steamgifts.com/" || window.location.href.match(".steamgifts.com/giveaways") !== null) {
        if (checkOption("SGIgnore-Options-Giveaways")) {
            hideGiveaways();
        } else {
            giveaways = document.getElementsByClassName("giveaway__username");

            for (i = 0; i < giveaways.length; i++) {
                if (checkLst(getGAID(giveaways[i]), giveawaysLst)) {
                    giveaways[i].parentNode.parentNode.parentNode.parentNode.style.display = "none";
                } else {
                    hideButton(giveaways[i].parentNode.parentNode.previousElementSibling, getGAID(giveaways[i]), "giveaways");
                }
            }
        }
    } else if (window.location.href == "https://www.steamgifts.com/" || window.location.href.match(".steamgifts.com/giveaways") !== null) {
        if (checkOption("SGIgnore-Options-Discussions")) {
            hideThreads();
        } else {
            threads = document.getElementsByClassName('table__row-inner-wrap');

            for (i = 0; i < threads.length; i++) {
                hideButton(threads[i].children[1].children[0], getThreadID(threads[i]), "discussions");
            }
        }*/
    } else if (window.location.href.match(".steamgifts.com/trade/") !== null && checkOption("SGIgnore-Options-TradeComments") && checkOption("SGIgnore-Options-DeletedComments")) {
        comments = getComments();

        if (document.getElementsByClassName("notification notification--warning notification--margin-top").length > 0) {
            commentsLen = comments.length;
        } else {
            commentsLen = comments.length - 1;
        }

        for (i = 1; i < commentsLen; i++) {
            hideComment(comments[i]);
        }
    } else if (window.location.href.match(".steamgifts.com/trade/") !== null && checkOption("SGIgnore-Options-TradeComments")) {
        comments = getComments();

        if (document.getElementsByClassName("notification notification--warning notification--margin-top").length > 0) {
            commentsLen = comments.length;
        } else {
            commentsLen = comments.length - 1;
        }

        for (i = 1; i < commentsLen; i++) {
            hideComment(comments[i]);
        }
    } else if (window.location.href.match(".steamgifts.com/trade/") !== null && checkOption("SGIgnore-Options-DeletedComments")) {
        comments = getDeletedComments();

        for (i = 0; i < comments.length; i++) {
            hideDeletedComment(comments[i].parentNode.parentNode);
        }
    } else if (window.location.href.match(".steamgifts.com/trades") !== null) {
        if (checkOption("SGIgnore-Options-Trades")) {
            hideTrades();
        } else {
            threads = document.getElementsByClassName('table__row-inner-wrap');

            for (i = 0; i < threads.length; i++) {
                if (checkLst(getThreadID(threads[i]), threadsLst)) {
                    threads[i].parentNode.style.display = "none";
                } else {
                    hideButton(threads[i].children[1].children[0], getTradeID(threads[i]), "trades");
                }
            }
        }
    } else if (window.location.href.match(".steamgifts.com/user/") !== null) {
        quickButtonProfile();
    }
}

function quickButtonProfile() {
    var nickname = document.getElementsByClassName("featured__heading__medium")[0].innerHTML;
    nickname = nickname.toLowerCase();

    nSidebar = document.getElementsByClassName("sidebar__shortcut-inner-wrap")[0].children.length;

    var button = document.createElement("a");
    button.id = "SGIgnore-QuickButton-ProfileAddUser";
    //button.href = "javascript:void(0)";

    button.appendChild(document.createElement("i"));
    button.children[0].className = "fa fa-user-times";

    document.getElementsByClassName("sidebar__shortcut-inner-wrap")[0].insertBefore(button, document.getElementsByClassName("sidebar__shortcut-inner-wrap")[0].children[nSidebar - 1]);

    var everyLst = retrieveLocal("SGIgnore-AddUser-Every");
    var giveawaysLst = retrieveLocal("SGIgnore-AddUser-Giveaways");
    var discussionsLst = retrieveLocal("SGIgnore-AddUser-Discussions");
    var tradesLst = retrieveLocal("SGIgnore-AddUser-Trades");
    var commentsLst = retrieveLocal("SGIgnore-AddUser-Comments");

    var inEvery = checkLst(nickname, everyLst);
    var inGiveaways = checkLst(nickname, giveawaysLst);
    var inDiscussions = checkLst(nickname, discussionsLst);
    var inTrades = checkLst(nickname, tradesLst);
    var inComments = checkLst(nickname, commentsLst);

    if (inEvery || inGiveaways || inDiscussions || inTrades || inComments) {
        button.children[0].style.color = "rgb(255, 0, 0)";
        button.addEventListener("mouseover", function() {
            document.getElementsByClassName("js-tooltip")[0].innerHTML = "Stop ignoring user";
        });
    } else {
        button.addEventListener("mouseover", function() {
            document.getElementsByClassName("js-tooltip")[0].innerHTML = "Ignore user";
        });
    }

    function showInterface() {
        var dlg = document.getElementById('SGIgnore-dlgbox');
        document.getElementById('SGIgnore-black-background').style.display = 'block';
        dlg.style.display = 'block';

        var winWidth = window.innerWidth;
        var winHeight = window.innerHeight;

        dlg.style.left = (winWidth/2) - 500/2 + 'px';
        dlg.style.top = '150px';
    }

    button.addEventListener("click", function() {
        var nickname = document.getElementsByClassName("featured__heading__medium")[0].innerHTML;
        //var dlgButtons = document.getElementsByClassName("SGIgnore-button");

        document.getElementById("SGIgnore-AddUser").value = nickname;

        if (inEvery || inGiveaways || inDiscussions || inTrades || inComments) {
            document.getElementById("SGIgnore-RemoveUser").value = nickname;
        }

        if (inEvery) {
            document.getElementById("SGIgnore-RemoveUser-Every").className = "SGIgnore-button-highlighted";
            document.getElementById("SGIgnore-RemoveUser-Every").title = "The user is currently on this list";
            document.getElementById("SGIgnore-AddUser-Every").className = "SGIgnore-button-highlighted";
            document.getElementById("SGIgnore-AddUser-Every").title = "The user is currently on this list";
        }

        if (inGiveaways) {
            document.getElementById("SGIgnore-RemoveUser-Giveaways").className = "SGIgnore-button-highlighted";
            document.getElementById("SGIgnore-RemoveUser-Giveaways").title = "The user is currently on this list";
            document.getElementById("SGIgnore-AddUser-Giveaways").className = "SGIgnore-button-highlighted";
            document.getElementById("SGIgnore-AddUser-Giveaways").title = "The user is currently on this list";
        }

        if (inDiscussions) {
            document.getElementById("SGIgnore-RemoveUser-Discussions").className = "SGIgnore-button-highlighted";
            document.getElementById("SGIgnore-RemoveUser-Discussions").title = "The user is currently on this list";
            document.getElementById("SGIgnore-AddUser-Discussions").className = "SGIgnore-button-highlighted";
            document.getElementById("SGIgnore-AddUser-Discussions").title = "The user is currently on this list";
        }

        if (inTrades) {
            document.getElementById("SGIgnore-RemoveUser-Trades").className = "SGIgnore-button-highlighted";
            document.getElementById("SGIgnore-RemoveUser-Trades").title = "The user is currently on this list";
            document.getElementById("SGIgnore-AddUser-Trades").className = "SGIgnore-button-highlighted";
            document.getElementById("SGIgnore-AddUser-Trades").title = "The user is currently on this list";
        }

        if (inComments) {
            document.getElementById("SGIgnore-RemoveUser-Comments").className = "SGIgnore-button-highlighted";
            document.getElementById("SGIgnore-RemoveUser-Comments").title = "The user is currently on this list";
            document.getElementById("SGIgnore-AddUser-Comments").className = "SGIgnore-button-highlighted";
            document.getElementById("SGIgnore-AddUser-Comments").title = "The user is currently on this list";
        }

        showInterface();
        //document.getElementById("SGIgnore-QuickButton-ProfileAddUser");
    });
}

function checkOption(option) {
    var value = localStorage.getItem(option);
    if (value == "true") {
        return true;
    } else {
        return false;
    }
}

function getGAID(gaUsername) {
    var gaID = gaUsername.parentNode.parentNode.previousElementSibling.children[0].href;
    gaID = /https:\/\/www\.steamgifts\.com\/giveaway\/([a-zA-Z0-9]{5})\//.exec(gaID)[1];

    return gaID;
}

function hideGiveaways() {
    var gaUsernames = document.getElementsByClassName("giveaway__username");

    for (var i = 0; i < gaUsernames.length; i++) {
        var gaID = getGAID(gaUsernames[i]);

        if (checkLst(gaID, giveawaysLst)) {
            gaUsernames[i].parentNode.parentNode.parentNode.parentNode.parentNode.style.display = "none";
            continue;
        } else {
            var nickname = gaUsernames[i].innerHTML;

            if (checkLst(nickname, ignoreLst) || checkLst(nickname, ignoreGALst)) {
                gaUsernames[i].parentNode.parentNode.parentNode.parentNode.parentNode.style.display = "none";
                continue;
            }
        }
        hideButton(gaUsernames[i].parentNode.parentNode.previousElementSibling, gaID, "giveaways");
    }
}

function checkLst(value, list) {
    if (list.indexOf(value) == -1) {
        return false;
    } else {
        return true;
    }
}

function checkDeleted(comment) {
    if (comment.getElementsByClassName("comment__username")[0].classList.contains("comment__username--deleted")) {
        return true;
    } return false;
}

function checkChildren(comment) {
    i = comment.parentNode.nextElementSibling.children.length;
    if (i > 0) {
        return true;
    } else {
        return false;
    }
}

function checkNew(comment) {
    if (comment.children[0].children[0].className == "comment__envelope") {
        console.log("Yep, new");
    }
}

function checkInboxComments() {
    var envelope = document.getElementsByClassName("nav__notification");
    if (envelope.length == 1) {
        return true;
    } else {
        return false;
    }
}

function hideButton(title, id, category) {
    var linkID = "SGIgnore-SpecificIgnore-" + id;
    var link = document.createElement("a");
    link.href = "javascript:void(0)";
    link.id = linkID;

    link.appendChild(document.createElement("i"));
    link.children[0].className = "fa fa-times-circle";

    if (category == "giveaways") {
        link.title = "Hide giveaway";
        link.children[0].className += " giveaway__icon";
        link.children[0].style.marginLeft = "0px";
        link.children[0].style.marginRight = "5px";
    } else if (category == "discussions") {
        link.title = "Hide discussion";
        link.children[0].className += " icon-heading";
        link.children[0].style.marginTop = "-2px";
    } else if (category == "trades") {
        link.title = "Hide trade";
        link.children[0].style.marginTop = "-2px";
        link.children[0].className += " icon-heading";
    }

    title.insertBefore(link, title.children[0]);

    link.addEventListener("click", function() {
        var elementID;
        var retrieved;
        var newArray = [];

        if (window.location.href == "https://www.steamgifts.com/" || window.location.href.match(".steamgifts.com/giveaways") !== null) {
            if (document.getElementById(linkID).parentNode.parentNode.parentNode.parentNode.getElementsByClassName("giveaway__heading__name").length > 0) {
                elementID = /https:\/\/www\.steamgifts\.com\/giveaway\/([a-zA-Z0-9]{5})\//.exec(document.getElementById(linkID).parentNode.getElementsByClassName("giveaway__heading__name")[0].href)[1];
                retrieved = localStorage.getItem("SGIgnore-SpecificIgnore-Giveaways");
                if (retrieved === null) {
                    newArray.push(elementID);
                    localStorage.setItem("SGIgnore-SpecificIgnore-Giveaways", JSON.stringify(newArray));
                } else {
                    newArray = JSON.parse(retrieved);
                    newArray.push(elementID);
                    localStorage.setItem("SGIgnore-SpecificIgnore-Giveaways", JSON.stringify(newArray));
                }
                document.getElementById(linkID).parentNode.parentNode.parentNode.parentNode.style.display = "none";
            } else {
                elementID = /https:\/\/www\.steamgifts\.com\/discussion\/([a-zA-Z0-9]{5})\//.exec(document.getElementById(linkID).parentNode.getElementsByClassName("table__column__heading")[0].href)[1];
                retrieved = localStorage.getItem("SGIgnore-SpecificIgnore-Discussions");
                if (retrieved === null) {
                    newArray.push(elementID);
                    localStorage.setItem("SGIgnore-SpecificIgnore-Discussions", JSON.stringify(newArray));
                } else {
                    newArray = JSON.parse(retrieved);
                    newArray.push(elementID);
                    localStorage.setItem("SGIgnore-SpecificIgnore-Discussions", JSON.stringify(newArray));
                }
                document.getElementById(linkID).parentNode.parentNode.parentNode.parentNode.style.display = "none";
            }
        } else if (window.location.href.match(".steamgifts.com/discussions") !== null) {
            elementID = /https:\/\/www\.steamgifts\.com\/discussion\/([a-zA-Z0-9]{5})\//.exec(document.getElementById(linkID).parentNode.getElementsByClassName("table__column__heading")[0].href)[1];
            retrieved = localStorage.getItem("SGIgnore-SpecificIgnore-Discussions");
            if (retrieved === null) {
                newArray.push(elementID);
                localStorage.setItem("SGIgnore-SpecificIgnore-Discussions", JSON.stringify(newArray));
            } else {
                newArray = JSON.parse(retrieved);
                newArray.push(elementID);
                localStorage.setItem("SGIgnore-SpecificIgnore-Discussions", JSON.stringify(newArray));
            }
            document.getElementById(linkID).parentNode.parentNode.parentNode.parentNode.style.display = "none";
        } else if (window.location.href.match(".steamgifts.com/trades") !== null) {
            elementID = /https:\/\/www\.steamgifts\.com\/trade\/([a-zA-Z0-9]{5})\//.exec(document.getElementById(linkID).parentNode.getElementsByClassName("table__column__heading")[0].href)[1];
            retrieved = localStorage.getItem("SGIgnore-SpecificIgnore-Trades");
            if (retrieved === null) {
                newArray.push(elementID);
                localStorage.setItem("SGIgnore-SpecificIgnore-Trades", JSON.stringify(newArray));
            } else {
                newArray = JSON.parse(retrieved);
                newArray.push(elementID);
                localStorage.setItem("SGIgnore-SpecificIgnore-Trades", JSON.stringify(newArray));
            }
            document.getElementById(linkID).parentNode.parentNode.parentNode.parentNode.style.display = "none";
        }
        //alert("All inserted correctly");
        //console.log(localStorage.getItem("SGIgnore-SpecificIgnore-Giveaways"));
        //console.log(localStorage.getItem("SGIgnore-SpecificIgnore-Discussions"));
        //console.log(localStorage.getItem("SGIgnore-SpecificIgnore-Trades"));
    });
}

function getThreadID(thread) {
    var numberElementsTtl = thread.children[1].children[0].children.length;
    var threadID = /https:\/\/www\.steamgifts\.com\/discussion\/([a-zA-Z0-9]{5})\//.exec(thread.children[1].children[0].children[numberElementsTtl - 1].href)[1];
    return threadID;
}

function getTradeID(trade) {
    var tradeID = /https:\/\/www\.steamgifts\.com\/trade\/([a-zA-Z0-9]{5})\//.exec(trade.children[1].children[0].children[0].href)[1];
    return tradeID;
}

function hideThreads() {
    var threads = document.getElementsByClassName('table__row-inner-wrap');

    for (var i = 0; i < threads.length; i++) {
        var threadID = getThreadID(threads[i]);
        if (checkLst(threadID, threadsLst)) {
            threads[i].parentNode.style.display = "none";
            continue;
        } else {
            var nickname = threads[i].children[1].children[1].children[2].innerHTML;
            nickname = nickname.toLowerCase();
            var numberElementsTtl = threads[i].children[1].children[0].children.length;

            if (checkLst(nickname, ignoreLst) || checkLst(nickname, ignoreDiscussionLst)) {
                threads[i].parentNode.style.display = "none";
                console.log('Hidden "' + threads[i].children[1].children[0].children[numberElementsTtl - 1].innerHTML + '" by "' + nickname + '". Link is: ' + threads[i].children[1].children[0].children[numberElementsTtl - 1].href);
                continue;
            }
        }
        hideButton(threads[i].children[1].children[0], threadID, "discussions");
    }
}

function hideTrades() {
    var trades = document.getElementsByClassName('table__row-inner-wrap');

    for (var i = 0; i < trades.length; i++) {
        var tradeID = getTradeID(trades[i]);
        if (checkLst(tradeID, tradesLst)) {
            trades[i].parentNode.style.display = "none";
            continue;
        } else {
            var nickname = trades[i].children[1].children[1].children[1].innerHTML;
            nickname = nickname.toLowerCase();
            var numberElementsTtl = trades[i].children[1].children[0].children.length;

            if (checkLst(nickname, ignoreLst) || checkLst(nickname, ignoreTradeLst)) {
                trades[i].parentNode.style.display = "none";
                console.log('Hidden "' + trades[i].children[1].children[0].children[numberElementsTtl - 1].innerHTML + '" by "' + nickname + '". Link is: ' + trades[i].children[1].children[0].children[numberElementsTtl - 1].href);
                continue;
            }
        }
        hideButton(trades[i].children[1].children[0], tradeID, "trades");
    }
}

function getComments() {
    var comments = document.getElementsByClassName('comment__summary');

    return comments;
}

function getDeletedComments() {
    var comments = document.getElementsByClassName('comment__username--deleted');

    return comments;
}

function hiddenMessage(commentID) {
    document.getElementById(commentID).children[2].style.display = "none";
    document.getElementById(commentID).parentNode.style.opacity = 0.5;
    var comment = document.getElementById(commentID).children[1].children[0];
    var stringID = "SGIgnore-hiddenMessage-" + commentID;
    var hiddenMsg = document.createElement("p");
    hiddenMsg.id = stringID;
    hiddenMsg.innerHTML = "User ignored.";
    comment.appendChild(hiddenMsg);

    for (var i = 0; i < comment.children.length; i++) {
        if (comment.children[i].id != stringID) {
            comment.children[i].style.display = "none";
        }
    }
}

function getUsername(comment) {
    var childrenLength = comment.children[0].children.length;
    var nickname;

    for (var i = 0; i < childrenLength; i++) {
        if (comment.children[0].children[i].className == "comment__username" || comment.children[0].children[i].className == "comment__username comment__username--op") {
            nickname = comment.children[0].children[i].children[0].innerHTML;
            break;
        }
    }

    return nickname;
}

function injectToggle(comment) {
    var commentID = comment.id;
    var toggleID = "SGIgnore-toggle-" + commentID;

    if (document.getElementById(toggleID) === null) {
        var toggle = document.createElement("i");
        toggle.className = "fa fa-toggle-on";
        toggle.style.marginRight = "5px";
        toggle.style.color = "rgb(255, 0, 0)";
        toggle.id = toggleID;
        toggle.title = "Toggle comment";

        comment.children[0].insertBefore(toggle, comment.children[0].children[2]);


        document.getElementById(toggleID).addEventListener("click", function() {
            if (document.getElementById(toggleID).classList.contains("fa-toggle-on")) {
                document.getElementById(toggleID).className = "fa fa-toggle-off";
                revealComment(comment);
                console.log("Just toggled: " + commentID);
            } else if (document.getElementById(toggleID).classList.contains("fa-toggle-off")) {
                document.getElementById(toggleID).className = "fa fa-toggle-on";
                hideComment(comment);
                console.log("Just toggled: " + commentID);
            }
        });
    }
}

function hideDeletedComment(comment) {
    if (checkChildren(comment) === false) {
        comment.parentNode.parentNode.style.display = "none";
    }
}

function hideComment(comment) {
    if (checkDeleted(comment) && checkChildren(comment) === false && checkOption("SGIgnore-Options-DeletedComments")) {
        //console.log("Reached the part of the deleted comment");
        hideDeletedComment(comment);
        return false;
    } else if (checkDeleted(comment)) {
        return false;
    }

    var nickname = getUsername(comment);
    nickname = nickname.toLowerCase();
    var commentID = comment.id;

    if (checkLst(nickname, ignoreLst) || checkLst(nickname, ignoreCommentLst)) {
        hiddenMessage(commentID);
        injectToggle(comment);
    }
}

function revealComment(comment) {
    var commentID = comment.id;
    comment.children[2].style.display = "";
    comment.parentNode.style.opacity = 1;

    var messages = comment.children[1].children[0];
    messages.removeChild(document.getElementById('SGIgnore-hiddenMessage-' + commentID));

    for (var i = 0; i < messages.children.length; i++) {
        messages.children[i].style.display = "";
    }
}

/*function hideThreadsMP() {
    var threads = document.getElementsByClassName("widget-container widget-container--margin-top")[0].children[0].children[1].children[1].children;

    for (var i = 0; i < threads.length; i++) {
        var nickname = threads[i].children[0].children[1].children[1].children[2].innerHTML;
        nickname = nickname.toLowerCase();

        if (checkLst(nickname, ignoreLst) || checkLst(nickname, ignoreDiscussionLst)) {
            threads[i].style.display = "none";
            var numberElementsTtl = threads[i].children[0].children[1].children[0].children.length;
            console.log('Hidden "' + threads[i].children[0].children[1].children[0].children[numberElementsTtl - 1].innerHTML + '" by "' + nickname + '". Link is: ' + threads[i].children[0].children[1].children[0].children[numberElementsTtl - 1].href);
        }
    }
}*/

/* Former toggleComment function, not needed anymore
function toggleComment(comment) {
    var toggleID = "SGIgnore-toggle-" + comment.id;
    if (document.getElementById(toggleID).classList.contains("fa-toggle-on")) {
        revealComment(comment);
    } else {
        hideComment(comment);
    }
}*/

/*function getGiveaways() {
    var usernames = document.getElementsByClassName("giveaway__username");

    return usernames;
}*/

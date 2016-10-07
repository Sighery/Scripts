// ==UserScript==
// @name         Pagination at the top
// @author       Sighery
// @description  Show the pagination of a topic at the top apart of only at the bottom
// @version      0.2.4
// @icon         https://raw.githubusercontent.com/Sighery/Scripts/master/favicon.ico
// @downloadURL  https://www.github.com/Sighery/Scripts/raw/master/PaginationTop.user.js
// @updateURL    https://www.github.com/Sighery/Scripts/raw/master/PaginationTop.meta.js
// @supportURL   https://www.steamgifts.com/discussion/Ju8nC/
// @namespace    Sighery
// @match        https://www.steamgifts.com/*
// ==/UserScript==

if (window.location.href.match(".steamgifts.com/discussion/") !== null) {
    if (document.getElementsByClassName('pagination__navigation')[0] !== undefined) {
        var copy = document.getElementsByClassName('pagination__navigation')[0].cloneNode(true);
        document.getElementsByClassName('page__heading')[1].appendChild(copy);
        copy.style.borderLeft = "0px";
        copy.style.paddingLeft = "0px";
        copy.style.paddingTop = "4px";
        copy.style.paddingBottom = "5px";
        copy.style.borderTopLeftRadius = "0px";
        copy.style.borderBottomLeftRadius = "0px";

        document.getElementsByClassName('page__heading__breadcrumbs')[1].style.borderRight = "0px";
        document.getElementsByClassName('page__heading__breadcrumbs')[1].style.paddingRight = "0px";
        document.getElementsByClassName('page__heading__breadcrumbs')[1].style.borderTopRightRadius = "0px";
        document.getElementsByClassName('page__heading__breadcrumbs')[1].style.borderBottomRightRadius = "0px";
        document.getElementsByClassName('page__heading__breadcrumbs')[1].style.marginRight = "0px";
    }
}

else if (window.location.href.match(".steamgifts.com/discussions") !== null) {
    var copy = document.getElementsByClassName('pagination__navigation')[0].cloneNode(true);
    document.getElementsByClassName('page__heading')[0].appendChild(copy);
    copy.style.borderLeft = "0px";
    copy.style.paddingLeft = "0px";
    copy.style.paddingTop = "4px";
    copy.style.paddingBottom = "5px";
    copy.style.borderTopLeftRadius = "0px";
    copy.style.borderBottomLeftRadius = "0px";

    document.getElementsByClassName('page__heading__breadcrumbs')[0].style.borderRight = "0px";
    document.getElementsByClassName('page__heading__breadcrumbs')[0].style.paddingRight = "0px";
    document.getElementsByClassName('page__heading__breadcrumbs')[0].style.borderTopRightRadius = "0px";
    document.getElementsByClassName('page__heading__breadcrumbs')[0].style.borderBottomRightRadius = "0px";
    document.getElementsByClassName('page__heading__breadcrumbs')[0].style.marginRight = "0px";
}

else if (window.location.href.match(".steamgifts.com/trade/") !== null) {
    if (document.getElementsByClassName('pagination__navigation')[0] !== undefined) {
        var copy = document.getElementsByClassName('pagination__navigation')[0].cloneNode(true);
        document.getElementsByClassName('page__heading')[1].appendChild(copy);
        copy.style.borderLeft = "0px";
        copy.style.paddingLeft = "0px";
        copy.style.paddingTop = "4px";
        copy.style.paddingBottom = "5px";
        copy.style.borderTopLeftRadius = "0px";
        copy.style.borderBottomLeftRadius = "0px";

        document.getElementsByClassName('page__heading__breadcrumbs')[1].style.borderRight = "0px";
        document.getElementsByClassName('page__heading__breadcrumbs')[1].style.paddingRight = "0px";
        document.getElementsByClassName('page__heading__breadcrumbs')[1].style.borderTopRightRadius = "0px";
        document.getElementsByClassName('page__heading__breadcrumbs')[1].style.borderBottomRightRadius = "0px";
        document.getElementsByClassName('page__heading__breadcrumbs')[1].style.marginRight = "0px";
    }
}

else if (window.location.href.match(".steamgifts.com/giveaway/") !== null) {
    if (document.getElementsByClassName('pagination__navigation')[0] !== undefined) {
        var copy = document.getElementsByClassName('pagination__navigation')[0].cloneNode(true);
        document.getElementsByClassName('page__heading')[1].appendChild(copy);
        copy.style.borderLeft = "0px";
        copy.style.paddingLeft = "0px";
        copy.style.paddingTop = "4px";
        copy.style.paddingBottom = "5px";
        copy.style.borderTopLeftRadius = "0px";
        copy.style.borderBottomLeftRadius = "0px";

        document.getElementsByClassName('page__heading__breadcrumbs')[1].style.borderRight = "0px";
        document.getElementsByClassName('page__heading__breadcrumbs')[1].style.paddingRight = "0px";
        document.getElementsByClassName('page__heading__breadcrumbs')[1].style.borderTopRightRadius = "0px";
        document.getElementsByClassName('page__heading__breadcrumbs')[1].style.borderBottomRightRadius = "0px";
        document.getElementsByClassName('page__heading__breadcrumbs')[1].style.marginRight = "0px";
    }
}

else if (window.location.href.match(".steamgifts.com") !== null) {
    if (document.getElementsByClassName('pagination__navigation')[0] !== undefined) {
        var copy = document.getElementsByClassName('pagination__navigation')[0].cloneNode(true);
        document.getElementsByClassName('page__heading')[0].insertBefore(copy, document.getElementsByClassName('page__heading')[0].children[1]);
        copy.style.borderLeft = "0px";
        copy.style.paddingLeft = "0px";
        copy.style.paddingTop = "4px";
        copy.style.paddingBottom = "5px";
        copy.style.borderTopLeftRadius = "0px";
        copy.style.borderBottomLeftRadius = "0px";

        document.getElementsByClassName('page__heading__breadcrumbs')[0].style.borderRight = "0px";
        document.getElementsByClassName('page__heading__breadcrumbs')[0].style.paddingRight = "0px";
        document.getElementsByClassName('page__heading__breadcrumbs')[0].style.borderTopRightRadius = "0px";
        document.getElementsByClassName('page__heading__breadcrumbs')[0].style.borderBottomRightRadius = "0px";
        document.getElementsByClassName('page__heading__breadcrumbs')[0].style.marginRight = "0px";
    }
}

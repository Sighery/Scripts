// ==UserScript==
// @name         SG OnDemand Image Loader
// @author       Sighery
// @description  Stops images from loading all at the same time, and only loads them when you click the View attached image link
// @version      0.1
// @icon         https://raw.githubusercontent.com/Sighery/Scripts/master/favicon.ico
// @downloadURL  https://www.github.com/Sighery/Scripts/raw/master/SGOnDemandLoader.user.js
// @updateURL    https://www.github.com/Sighery/Scripts/raw/master/SGOnDemandLoader.meta.js
// @supportURL   https://www.steamgifts.com/discussion/PLACEHOLDER/
// @namespace    Sighery
// @match        https://www.steamgifts.com/giveaway/*
// @match        https://www.steamgifts.com/discussion/*
// @match        https://www.steamgifts.com/trade/*
// @match        https://www.steamgifts.com/messages
// @run-at       document-end
// ==/UserScript==

stop_loading();

function stop_loading() {
	// Find all divs with the following class, and stop the img they contain from loading by removing the src attribute if it hasn't been loaded yet
	var elements = document.getElementsByClassName("comment__toggle-attached");
	for (var i = 0; i < elements.length; i++) {
		var img = elements[i].parentElement.getElementsByTagName("IMG")[0];
		if (img.complete === false) {
			img.src = "";
			add_trigger(elements[i]);
		}
	}
}

function add_trigger(element) {
	// This should receive the element with class "comment__toggle-attached"
	element.addEventListener("click", function() {
		var img = element.parentElement.getElementsByTagName("IMG")[0];
		var link = element.parentElement.getElementsByTagName("A")[0];
		if (img.src != link.href) {
			img.src = link.href;
		}
	});
}

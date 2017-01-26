// ==UserScript==
// @name         SG OnDemand Image Loader
// @author       Sighery
// @description  Stops images from loading all at the same time, and only loads them when you click the View attached image link
// @version      1.0.0
// @icon         https://raw.githubusercontent.com/Sighery/Scripts/master/favicon.ico
// @downloadURL  https://www.github.com/Sighery/Scripts/raw/master/SGImageLoader.user.js
// @updateURL    https://www.github.com/Sighery/Scripts/raw/master/SGImageLoader.meta.js
// @supportURL   https://www.steamgifts.com/discussion/aRIgt/
// @namespace    Sighery
// @match        https://www.steamgifts.com/giveaway/*
// @match        https://www.steamgifts.com/discussion/*
// @match        https://www.steamgifts.com/messages
// ==/UserScript==

// ==================== SETTING UP DATA ====================
// ========== USER EDITABLE ==========
// Replace the null with: 0 for Extended SteamGifts, 1 for SG++; 2 for Revilheart's Script; 3 for SGT Frog
var endless_type = null;



// ==================== MAIN ====================
if (endless_type !== null) {
	if (window.location.href === "https://www.steamgifts.com/messages") {
		detect_mutations_inbox_messages(endless_type);
	} else if (window.location.href.indexOf("https://www.steamgifts.com/discussion/") !== -1 || window.location.href.indexOf("https://www.steamgifts.com/giveaway/") !== -1) {
		detect_mutations_threads_giveaways(endless_type);
	}
}

var elements = document.getElementsByClassName("comment__toggle-attached");
for (var i = 0; i < elements.length; i++) {
	stop_loading(elements[i]);
}



// ==================== FUNCTIONALITY ====================
// ========== MODIFYING FUNCTIONS ==========
function stop_loading(element) {
	// Stop the img from loading by removing the src attribute if it hasn't been loaded yet
	var img = element.parentElement.getElementsByTagName("IMG")[0];
	if (img.complete === false) {
		img.src = "";
		add_trigger(element);
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



// ========== MUTATION FUNCTIONS ==========
function detect_mutations_threads_giveaways(endless_type) {
	var target = document.getElementsByClassName("sidebar")[0].nextElementSibling;
	var config = {
		"subtree": true,
		"childList": true,
	};

	var observer = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			var elements;
			var i;
			var j;

			if (endless_type === 0) {
				// Extended SteamGifts
				if (mutation.addedNodes.length === 2 && mutation.addedNodes[0].className === "page__heading" && mutation.addedNodes[1].className === "comments") {
					elements = mutation.addedNodes[1].getElementsByClassName("comment__toggle-attached");

					for(i = 0; i < elements.length; i++) {
						stop_loading(elements[i]);
					}
				}
			} else if (endless_type === 1) {
				// SteamGifts++
				if (mutation.addedNodes.length === 1 && mutation.addedNodes[0].className === "comment") {
					elements = mutation.addedNodes[0].getElementsByClassName("comment__toggle-attached");

					for(i = 0; i < elements.length; i++) {
						stop_loading(elements[i]);
					}
				}
			} else if (endless_type === 2 || endless_type === 3) {
				// Revilheart's script (2) or SGT Frog (3)
				if (mutation.addedNodes.length > 0) {
					for(j = 0; j < mutation.addedNodes.length; j++) {
						if (mutation.addedNodes[j].className === "comment") {
							elements = mutation.addedNodes[j].getElementsByClassName("comment__toggle-attached");

							for(i = 0; i < elements.length; i++) {
								stop_loading(elements[i]);
							}
						}
					}
				}
			}
		});
	});

	observer.observe(target, config);
}


function detect_mutations_inbox_messages(endless_type) {
	// SG++ has no endless scrolling feature here
	// SGT Frog has no endless scrolling feature here
	var target = document.getElementsByClassName("sidebar")[0].nextElementSibling;
	var config = {
		"subtree": true,
		"childList": true,
	};

	var observer = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			var elements;
			var i;
			var j;

			if (endless_type === 0) {
				// Extended SteamGifts
				if (mutation.addedNodes.length === 2 && mutation.addedNodes[0].className === "page__heading" && mutation.addedNodes[1].tagName === "DIV") {
					elements = mutation.addedNodes[1].getElementsByClassName("comment__toggle-attached");

					for(i = 0; i < elements.length; i++) {
						stop_loading(elements[i]);
					}
				}
			} else if (endless_type === 2) {
				// Revilheart's script
				if (mutation.addedNodes.length > 0) {
					for(j = 0; j < mutation.addedNodes.length; j++) {
						if (mutation.addedNodes[j].className === "comments__entity" || mutation.addedNodes[j].className === "comments") {
							elements = mutation.addedNodes[j].getElementsByClassName("comment__toggle-attached");

							for(i = 0; i < elements.length; i++) {
								stop_loading(elements[i]);
							}
						}
					}
				}
			}
		});
	});

	observer.observe(target, config);
}

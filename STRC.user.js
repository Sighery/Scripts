// ==UserScript==
// @name         Steam's True Review Count
// @author       Sighery
// @description  Replaces Steam's new overall score with the old one
// @version      0.2.1
// @icon         https://raw.githubusercontent.com/Sighery/Scripts/master/favicon.ico
// @downloadURL  https://raw.githubusercontent.com/Sighery/Scripts/master/STRC.user.js
// @updateURL    https://raw.githubusercontent.com/Sighery/Scripts/master/STRC.meta.js
// @supportURL   https://www.steamgifts.com/discussion/o8tEc/
// @namespace    Sighery
// @match        http://store.steampowered.com/app/*
// @grant        GM_xmlhttpRequest
// @connect      store.steampowered.com
// ==/UserScript==

if (window.location.href.match("agecheck") === null) {
    // Check if there are no reviews, and if there are not do nothing
    if (document.getElementsByClassName("user_reviews_summary_row")[0].children[1].children.length > 0) {
        // This is the span of the recent and overall rows that I need to change, there can be 1 or 2. If there are two the overall one is always the last
        // Syntax example: 97% of the 2,646 user reviews for this game are positive.
        var rows = document.getElementsByClassName("nonresponsive_hidden responsive_reviewdesc");
        var overall_span;

        if (rows.length == 2) {
            overall_span = rows[1];
        } else {
            overall_span = rows[0];
        }

        // This is the parent of the overall_span, I can get the rest of the elements I need to modify from this one:
        var overall_parent = overall_span.parentElement;
        // This is the element that tells you the overall status of the game (mixed|negative|positive)
        var overall_status = overall_parent.getElementsByClassName("game_review_summary")[0];
        // This is the element that has the total count. Syntax example: (2,785 reviews). The reviews bit changes according to your language
        var overall_total = overall_parent.getElementsByClassName("responsive_hidden")[0];
        // Since that bit changes we will rely on Steam itself to give us the exact word used on that language
        var overall_total_lang = /\(.+\s(.+)\)/.exec(overall_total.innerHTML)[1];

        var appID = /http:\/\/store\.steampowered\.com\/app\/(\d+)/.exec(window.location.href)[1];
        GM_xmlhttpRequest({
            method: "GET",
            url: "http://store.steampowered.com/appreviews/" + appID + "?start_offset=0&day_range=30&filter=summary&language=all&review_type=all&purchase_type=all",
            onload: function(response) {
                var jsonf = JSON.parse(response.responseText);
                if (jsonf.success == 2) {
                    // JSON has nothing in it, game removed from the store or inexistant
                    return false;
                }

                var reviews = document.createElement("div");
                reviews.innerHTML = jsonf.review_score;

                // Get the spans that are in that HTML string of the JSON. Those spans directly replace the small review under the checkboxes that varies with your inputs
                var spans = reviews.getElementsByTagName("span");
                // We get the whole message here. Syntax example: 95% of 2,554 reviews... We will rely on Steam as well to give us the exact string we need for that language
                var pertotal_message = spans[1].getAttribute("data-store-tooltip");

                if (pertotal_message == "No user reviews") {
                    // No reviews for the game, do nothing
                    return false;
                }

                // matched_message is the message shown on that small review. Syntax example: 2,543 reviews match the filters above. Doesn't change with another language
                var matched_message = spans[0].innerHTML;
                // We use some Regex and get the number out of it
                var total_count = /(.+)\sreviews match the filters above/.exec(matched_message)[1];
                // status_class and status_message are related to the overall_status element. status_class will replace the overall_status class, and status_message the message
                // This way if the text changes from Negative to Positive so will the color (color linked to class)
                var status_class = spans[1].className;
                var status_message = spans[1].innerHTML;

                // Now that we have every needed element we start replacing them for the originals
                overall_span.innerHTML = pertotal_message;
                overall_total.innerHTML = "(" + total_count + " " + overall_total_lang + ")";
                overall_status.innerHTML = status_message;
                overall_status.className = status_class;

				// We change the actual parent of the overall_parent (actual overall_parent doesn't include the minititle that says "Overall"). We set its attribute
                // "data-store-tooltip" to the pertotal_message so when the tooltip spawns it gets the right message without having to go in and modify the tooltip
                overall_parent.parentElement.setAttribute("data-store-tooltip", pertotal_message);

				// In case the user was hovering their mouse before all data was loaded, we'll check if the store_tooltip elements exists and replace it
				if (document.getElementsByClassName("store_tooltip").length === 1) {
					document.getElementsByClassName("store_tooltip")[0].innerHTML = pertotal_message;
				}

				// If the user hovers their mouse before the reviews data JSON is loaded the tooltip will be set to the old message
				// This should check whether it is the new message and if it isn't then replace it from now on
				overall_parent.parentElement.addEventListener("mouseover", function() {
					tooltip = document.getElementsByClassName("store_tooltip")[0];
					if (tooltip.innerHTML != pertotal_message) {
						tooltip.innerHTML = pertotal_message;
					}
				});
            }
        });
    }
}

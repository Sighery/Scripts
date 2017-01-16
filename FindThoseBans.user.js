// ==UserScript==
// @name         Find Those Bans
// @author       Sighery
// @description  Finds who is suspended and adds it to the blacklist and whitelist page
// @version      0.3.8
// @icon         https://raw.githubusercontent.com/Sighery/Scripts/master/favicon.ico
// @downloadURL  https://www.github.com/Sighery/Scripts/raw/master/FindThoseBans.user.js
// @updateURL    https://www.github.com/Sighery/Scripts/raw/master/FindThoseBans.meta.js
// @supportURL   https://www.steamgifts.com/discussion/nV9XP/
// @namespace    Sighery
// @match        https://www.steamgifts.com/account/manage/blacklist*
// @match        https://www.steamgifts.com/account/manage/whitelist*
// @grant        GM_xmlhttpRequest
// @connect      steamgifts.com
// @connect      api.sighery.com
// ==/UserScript==

var rows = getRows();

GM_xmlhttpRequest({
	method: "HEAD",
	url: "http://api.sighery.com/isup.php",
	timeout: 1500,
	ontimeout: function(response) {
		console.log("isup request timed out, fallback on manual requests");
		manual_requests();
	},
	onerror: function(response) {
		console.log("isup request failed, fallback on manual requests");
	},
	onload: function(response) {
		console.log("isup request successful");

		for (var i = 0; i < rows.length; i++) {
			api_request(rows[i].getElementsByClassName("table__column__heading")[0].innerHTML, i);
		}
	}
});

function api_request(nick, number) {
	GM_xmlhttpRequest({
		method: "GET",
		url: "http://api.sighery.com/SteamGifts/IUsers/GetUserInfo/?filters=suspension,last_online&user=" + nick,
		onerror: function(response) {
			console.log("There was some error with the request to the API, fallback on manual requests");
			manual_requests();
		},
		onload: function(response) {
			console.log("Request to IUsers/GetUserInfo successful, adding the data");
			console.log("number is: " + number);
			var jsonFile = JSON.parse(response.responseText);

			if (jsonFile.suspension.type !== null) {
				if (jsonFile.suspension.type === 1) {
					injectMessage(rows[number], 0);
				} else if (jsonFile.suspension.type === 0 && jsonFile.suspension.end_time === null) {
					injectMessage(rows[number], 1);
				} else {
					injectMessage(rows[number], 2, jsonFile.suspension.end_time);
				}
			}

			addLastOnlineDate(rows[number], generate_time_string(jsonFile.last_online), jsonFile.last_online);
		}
	});
}

function manual_requests() {
	for (var i = 0; i < rows.length; i++) {
		importPage(rows[i].getElementsByClassName("table__column__heading")[0].href, i);
	}
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
						injectMessage(rows[number], 2, suspensionTime);
					}
				}
			}
			var lastOnline = tempElem.getElementsByClassName("featured__table")[0].children[0].children[1].children[1];

			if (lastOnline.children[0].children.length === 0) {
				addLastOnlineDate(rows[number], lastOnline.children[0].textContent, lastOnline.children[0].getAttribute("data-timestamp"));
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

function addLastOnlineDate(elem, time, timestamp_date = null) {
	var message = document.createElement("div");
	message.innerHTML = time;

	if (elem.getElementsByClassName("FTB").length > 0) {
		message.style.paddingRight = "100px";
	} else {
		message.style.paddingRight = "250px";
	}

	if (timestamp_date !== null && timestamp_date !== 0) {
		var date = new Date(timestamp_date * 1000).toISOString();
		message.title = date.substring(0, date.indexOf("T"));
	}

	elem.insertBefore(message, elem.children[2]);
}

function injectMessage(elem, type, time, timestamp_date = null) {
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

		if (timestamp_date !== null) {
			var date = new Date(timestamp_date * 1000).toISOString();
			message.title = date.substring(0, date.indexOf("T"));
		}
	}

	elem.insertBefore(message, elem.children[2]);
}

function getRows() {
	return document.getElementsByClassName("table__row-inner-wrap");
}

function generate_time_string(timestamp_date) {
	if (timestamp_date === 0) {
		return "Online Now";
	}

	var seconds_year = 31536000;
	var seconds_month = 2592000;
	var seconds_week = 604800;
	var seconds_day = 86400;
	var seconds_hour = 3600;
	var seconds_minute = 60;

	var current_time = Math.floor(Date.now() / 1000);
	var rest = current_time - timestamp_date;

	if (rest >= seconds_year) {
		console.log("More than a year");
		//return [0, Math.floor(rest / seconds_year)];

		var time_count = Math.floor(rest / seconds_year);
		if (time_count === 1) {
			return "1 year ago";
		} else {
			return time_count + " years ago";
		}
	} else if (rest >= seconds_month) {
		console.log("More than a month");
		//return [1, Math.floor(rest / seconds_month)];

		var time_count = Math.floor(rest / seconds_month);
		if (time_count === 1) {
			return "1 month ago";
		} else {
			return time_count + " months ago";
		}
	} else if (rest >= seconds_week) {
		console.log("More than a week");

		var time_count = Math.floor(rest / seconds_week);
		if (time_count === 1) {
			return "1 week ago";
		} else {
			return time_count + " weeks ago";
		}
	} else if (rest >= seconds_day) {
		console.log("More than a day");
		//return [2, Math.floor(rest / seconds_day)];

		var time_count = Math.floor(rest / seconds_day);
		if (time_count === 1) {
			return "1 day ago";
		} else {
			return time_count + " days ago";
		}
	} else if (rest >= seconds_hour) {
		console.log("More than an hour");
		//return [3, Math.floor(rest / seconds_hour)];

		var time_count = Math.floor(rest / seconds_hour);
		if (time_count === 1) {
			return "1 hour ago";
		} else {
			return time_count + " hours ago";
		}
	} else if (rest >= seconds_minute) {
		console.log("More than a minute");
		//return [4, Math.floor(rest / seconds_minute)];

		var time_count = Math.floor(rest / seconds_minute);
		if (time_count === 1) {
			return "1 minute ago";
		} else {
			return time_count + " minutes ago";
		}
	} else {
		console.log("More than a second");
		//return [5, rest];

		if (rest === 0) {
			return "1 second ago";
		} else {
			return rest + " seconds ago";
		}
	}
}

// ==UserScript==
// @name         Find Those Bans
// @author       Sighery
// @description  Finds who is suspended and adds it to the blacklist and whitelist pages
// @version      1.0.0
// @icon         https://raw.githubusercontent.com/Sighery/Scripts/master/favicon.ico
// @downloadURL  https://www.github.com/Sighery/Scripts/raw/master/FindThoseBans.user.js
// @updateURL    https://www.github.com/Sighery/Scripts/raw/master/FindThoseBans.meta.js
// @supportURL   https://www.steamgifts.com/discussion/nV9XP/
// @namespace    Sighery
// @require      https://github.com/Sighery/SRQ/releases/download/v0.1.0/SerialRequestsQueue-0.1.0.js
// @match        https://www.steamgifts.com/account/manage/blacklist*
// @match        https://www.steamgifts.com/account/manage/whitelist*
// @grant        GM_xmlhttpRequest
// @connect      steamgifts.com
// @connect      api.sighery.com
// ==/UserScript==

// ==================== SETTING UP DATA ====================
// ========== USER EDITABLE ==========
// Endless scrolling type: 0 for Extended SteamGifts; 1 for SteamGifts++
var endless_type = 0;

// ========== PROGRAM'S DATA - DO NOT EDIT ==========
// User-Agent string
var user_agent = "Find Those Bans/1.0.0";

var brequested_isup = false;
var bapi_sighery = false;



// ==================== MAIN ====================
var queue = new SRQ();

if (endless_type !== null) {
	detect_mutation(endless_type, queue);
}

queue.add_to_queue({
	"link": "http://api.sighery.com/isup.html",
	"method": "HEAD",
	"timeout": 2000,
	"headers": {
		"User-Agent": user_agent
	}
});

if (queue.is_busy() === false) {
	queue.start(isup_request_callback);
}

inject_style();
injectRemoveAll();
addLastOnlineHeader();



// ==================== FUNCTIONALITY ====================
// ========== REQUEST FUNCTIONS ==========
function remove_from_list(xsrf_token, do_value, action, child_user_id) {
	var req = new XMLHttpRequest();
	var form_data = new FormData();
	form_data.append("xsrf_token", xsrf_token);
	form_data.append("do", do_value);
	form_data.append("action", action);
	form_data.append("child_user_id", child_user_id);
	req.open("POST", "https://www.steamgifts.com/ajax.php");
	req.send(form_data);
}



// ========== CALLBACK FUNCTIONS ==========
function isup_request_callback(requested_obj) {
	brequested_isup = true;
	var rows = document.getElementsByClassName("table__rows");
	var link;
	var i;

	// For SG++ endless scrolling, to check if rows[0] is the default one or one
	//added by SG++
	for (var j = 0; j < rows.length; j++) {
		var rows_inner = rows[j].querySelectorAll(".table__row-inner-wrap:not(.FTB-checked-row)");

		if (rows_inner.length === 0) {
			continue;
		} else {
			rows = rows_inner;
			break;
		}
	}

	if (requested_obj.successful) {
		bapi_sighery = true;
		for(i = 0; i < rows.length; i++) {
			link = rows[i].getElementsByClassName("table__column__heading")[0].href;
			var nick = link.substring(link.lastIndexOf("/") + 1);

			queue.add_to_queue({
				"link": "http://api.sighery.com/SteamGifts/IUsers/GetUserInfo/?filters=suspension,last_online&user=" + nick,
				"headers": {
					"User-Agent": user_agent
				},
				"fallback": {
					"link": link,
					"row": rows[i],
					"headers": {
						"User-Agent": user_agent
					}
				},
				"row": rows[i]
			});
		}
	} else {
		for(i = 0; i < rows.length; i++) {
			link = rows[i].getElementsByClassName("table__column__heading")[0].href;

			queue.add_to_queue({
				"link": link,
				"headers": {
					"User-Agent": user_agent
				},
				"row": rows[i]
			});
		}
	}

	if (queue.is_busy() === false) {
		queue.start(normal_callback);
	}
}

function normal_callback(requested_obj) {
	if (requested_obj.fallback_requested) {
		inject_from_sg(requested_obj.fallback);
	} else if (requested_obj.link.indexOf("https://www.steamgifts.com") !== -1) {
		inject_from_sg(requested_obj);
	} else {
		inject_from_api(requested_obj);
	}
}



// ========== MUTATION FUNCTIONS ==========
function detect_mutation(endless_type, srq_queue) {
	var target;
	var config = {
		"childList": true
	};

	if (endless_type === 0) {
		// Extended SteamGifts
		target = document.getElementsByClassName("sidebar")[0].nextElementSibling;
	} else if (endless_type === 1) {
		// SteamGifts++
		target = document.getElementsByClassName("table")[0];
		config.subtree = true;
	}

	var observer = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			var rows;

			if (endless_type === 0) {
				if (mutation.addedNodes.length === 2) {
					if (mutation.addedNodes[0].className == "page__heading" && mutation.addedNodes[1].className == "table") {
						rows = mutation.addedNodes[1].querySelectorAll(".table__row-inner-wrap:not(.FTB-checked-row)");
					}
				}
			} else if (endless_type === 1) {
				if (mutation.addedNodes.length === 1) {
					if (mutation.addedNodes[0].className === "table__row-outer-wrap") {
						rows = mutation.addedNodes[0].querySelectorAll(".table__row-inner-wrap:not(.FTB-checked-row)");
					}
				}
			}

			if (rows === undefined) {
				return;
			}

			var i;
			var link;
			if (brequested_isup === false) {
				setTimeout(function() {
					if (brequested_isup !== false) {
						if (bapi_sighery) {
							for(i = 0; i < rows.length; i++) {
								link = rows[i].getElementsByClassName("table__column__heading")[0].href;
								var nick = link.substring(link.lastIndexOf("/") + 1);

								srq_queue.add_to_queue({
									"link": "http://api.sighery.com/SteamGifts/IUsers/GetUserInfo/?filters=suspension,last_online&user=" + nick,
									"headers": {
										"User-Agent": user_agent
									},
									"fallback": {
										"link": link,
										"row": rows[i],
										"headers": {
											"User-Agent": user_agent
										}
									},
									"row": rows[i]
								});
							}
						} else {
							for(i = 0; i < rows.length; i++) {
								link = rows[i].getElementsByClassName("table__column__heading")[0].href;

								srq_queue.add_to_queue({
									"link": link,
									"headers": {
										"User-Agent": user_agent
									},
									"row": rows[i]
								});
							}
						}

						if (srq_queue.is_busy() === false) {
							srq_queue.start(normal_callback);
						}
					}
				}, 2500);
			} else {
				if (bapi_sighery) {
					for(i = 0; i < rows.length; i++) {
						link = rows[i].getElementsByClassName("table__column__heading")[0].href;
						var nick = link.substring(link.lastIndexOf("/") + 1);

						srq_queue.add_to_queue({
							"link": "http://api.sighery.com/SteamGifts/IUsers/GetUserInfo/?filters=suspension,last_online&user=" + nick,
							"headers": {
								"User-Agent": user_agent
							},
							"fallback": {
								"link": link,
								"row": rows[i],
								"headers": {
									"User-Agent": user_agent
								}
							},
							"row": rows[i]
						});
					}
				} else {
					for(i = 0; i < rows.length; i++) {
						link = rows[i].getElementsByClassName("table__column__heading")[0].href;

						srq_queue.add_to_queue({
							"link": link,
							"headers": {
								"User-Agent": user_agent
							},
							"row": rows[i]
						});
					}
				}

				if (srq_queue.is_busy() === false) {
					srq_queue.start(normal_callback);
				}
			}
		});
	});

	observer.observe(target, config);
}



// ========== INJECT FUNCTIONS ==========
function inject_from_api(requested_obj) {
	var json_file = JSON.parse(requested_obj.response.responseText);

	if (json_file.suspension.type !== null) {
		if (json_file.suspension.type === 1) {
			injectMessage(requested_obj.row, 0);
		} else if (json_file.suspension.type === 0 && json_file.suspension.end_time === null) {
			injectMessage(requested_obj.row, 1);
		} else {
			injectMessage(requested_obj.row, 2, generate_time_string_future(json_file.suspension.end_time), json_file.suspension.end_time);
		}
	}

	addLastOnlineDate(requested_obj.row, generate_time_string_past(json_file.last_online), json_file.last_online);
}


function inject_from_sg(requested_obj) {
	var tempElem = document.createElement("div");
	tempElem.innerHTML = requested_obj.response.responseText;
	var suspension = tempElem.getElementsByClassName("sidebar__suspension");

	if (suspension.length > 0) {
		suspension = suspension[0];
		if (suspension.textContent.trim().toLowerCase() == "banned") {
			injectMessage(requested_obj.row, 0);
		} else if (suspension.textContent.trim().toLowerCase() == "suspended") {
			var suspensionTime = tempElem.getElementsByClassName("sidebar__suspension-time")[0];

			if (suspensionTime.children.length == 1) {
				suspensionTime = suspensionTime.children[0].textContent;
			} else {
				suspensionTime = suspensionTime.textContent.toLowerCase();
			}

			if (suspensionTime == "permanent") {
				injectMessage(requested_obj.row, 1);
			} else {
				injectMessage(requested_obj.row, 2, suspensionTime);
			}
		}
	}
	var lastOnline = tempElem.getElementsByClassName("featured__table")[0].children[0].children[1].children[1];

	if (lastOnline.children[0].children.length === 0) {
		addLastOnlineDate(requested_obj.row, lastOnline.children[0].textContent, lastOnline.children[0].getAttribute("data-timestamp"));
	} else {
		addLastOnlineDate(requested_obj.row, "Online Now");
	}
}


function injectRemoveAll() {
	var newElem = document.createElement("a");
	newElem.innerHTML = "Remove all permanently suspended";
	newElem.href = "javascript:void(0)";
	document.getElementsByClassName("table__heading")[0].insertBefore(newElem, document.getElementsByClassName("table__heading")[0].children[1]);

	newElem.addEventListener("click", function() {
		var elements = document.getElementsByClassName("FTB-Permanent");

		for (var i = 0; i < elements.length; i++) {
			if (elements[i].classList.contains("FTB-Permanent-Removed")) {
				continue;
			}

			nParent = elements[i].parentElement.children.length;
			var form = elements[i].parentElement.children[nParent - 1].children[0];

			var xsrf_token = form.querySelector("input[name='xsrf_token']").value;
			var do_value = form.querySelector("input[name='do']").value;
			var action = form.querySelector("input[name='action']").value;
			var child_user_id = form.querySelector("input[name='child_user_id']").value;
			remove_from_list(xsrf_token, do_value, action, child_user_id);

			form.children[0].className += " is-hidden";
			form.children[2].className = "table__remove-complete";
			elements[i].parentElement.className += " is-faded";
			elements[i].className += " FTB-Permanent-Removed";
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
	elem.className += " FTB-checked-row";

	var message = document.createElement("div");
	message.innerHTML = time;
	message.className = "FTB-online-string";

	if (elem.getElementsByClassName("FTB-suspension-string").length > 0) {
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
	//Types:
	//	0. Ban
	//	1. Permanent suspension
	//	2. Temporary suspension

	var message = document.createElement("div");

	if (type === 0) {
		message.innerHTML = "Banned";
		message.className = "FTB-suspension-string FTB-Permanent";
	} else if (type === 1) {
		message.innerHTML = "Permanently suspended";
		message.className = "FTB-suspension-string FTB-Permanent";
	} else if (type === 2) {
		message.innerHTML = "Suspended for " + time;
		message.className = "FTB-suspension-string FTB-Temporary";

		if (timestamp_date !== null) {
			var date = new Date(timestamp_date * 1000).toISOString();
			message.title = date.substring(0, date.indexOf("T"));
		}
	}

	elem.insertBefore(message, elem.children[2]);
}


function inject_style() {
	var style_code = [
		".FTB-suspension-string {",
		"	color: red;",
		"	width: 150px;",
		"}",
		"",
		".FTB-online-string {",
		"	color: #AAA;",
		"}"
	].join("\n");
	var node = document.createElement('style');
	node.type = "text/css";
	node.appendChild(document.createTextNode(style_code));
	document.getElementsByTagName('head')[0].appendChild(node);
}



// ========== GENERATING FUNCTIONS ==========
function generate_time_string_past(timestamp_date) {
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
		var time_count = Math.floor(rest / seconds_year);
		if (time_count === 1) {
			return "1 year";
		} else {
			return time_count + " years";
		}
	} else if (rest >= seconds_month) {
		var time_count = Math.floor(rest / seconds_month);
		if (time_count === 1) {
			return "1 month";
		} else {
			return time_count + " months";
		}
	} else if (rest >= seconds_week) {
		var time_count = Math.floor(rest / seconds_week);
		if (time_count === 1) {
			return "1 week";
		} else {
			return time_count + " weeks";
		}
	} else if (rest >= seconds_day) {
		var time_count = Math.floor(rest / seconds_day);
		if (time_count === 1) {
			return "1 day ago";
		} else {
			return time_count + " days";
		}
	} else if (rest >= seconds_hour) {
		var time_count = Math.floor(rest / seconds_hour);
		if (time_count === 1) {
			return "1 hour";
		} else {
			return time_count + " hours";
		}
	} else if (rest >= seconds_minute) {
		var time_count = Math.floor(rest / seconds_minute);
		if (time_count === 1) {
			return "1 minute";
		} else {
			return time_count + " minutes";
		}
	} else {
		if (rest === 0) {
			return "1 second";
		} else {
			return rest + " seconds";
		}
	}
}


function generate_time_string_future(timestamp_date) {
	var seconds_year = 31536000;
	var seconds_month = 2592000;
	var seconds_week = 604800;
	var seconds_day = 86400;
	var seconds_hour = 3600;
	var seconds_minute = 60;

	var current_time = Math.floor(Date.now() / 1000);
	var rest = timestamp_date - current_time;

	if (rest < seconds_minute) {
		if (rest === 1) {
			return "1 second";
		} else {
			return rest + " seconds";
		}
	} else if (rest < seconds_hour) {
		var time_count = Math.floor(rest / seconds_minute);
		if (time_count === 1) {
			return "1 minute";
		} else {
			return time_count + " minutes";
		}
	} else if (rest < seconds_day) {
		var time_count = Math.floor(rest / seconds_hour);
		if (time_count === 1) {
			return "1 hour";
		} else {
			return time_count + " hours";
		}
	} else if (rest < seconds_week) {
		var time_count = Math.floor(rest / seconds_day);
		if (time_count === 1) {
			return "1 day ago";
		} else {
			return time_count + " days";
		}
	} else if (rest < seconds_month) {
		var time_count = Math.floor(rest / seconds_week);
		if (time_count === 1) {
			return "1 week";
		} else {
			return time_count + " weeks";
		}
	} else if (rest < seconds_year) {
		var time_count = Math.floor(rest / seconds_month);
		if (time_count === 1) {
			return "1 month";
		} else {
			return time_count + " months";
		}
	} else {
		var time_count = Math.floor(rest / seconds_year);
		if (time_count === 1) {
			return "1 year";
		} else {
			return time_count + " years";
		}
	}
}

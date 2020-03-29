"use strict";

var MTABS = new Map();
var CNAME_CHAIN_URL = browser.runtime.getURL("res/cnamechain.json");

var oReq = new XMLHttpRequest();
var cname_chain_json;

oReq.open("GET", CNAME_CHAIN_URL, true);
oReq.responseType = "json";
oReq.onload = function (e) {
  if (oReq.readyState === 4 && oReq.status === 200) {
      cname_chain_json = oReq.response;
  } else {
		console.log(e);
	}
};
oReq.send(null);

// Intercept each request
browser.webRequest.onBeforeRequest.addListener((details)=>{
  let tab_id = details.tabId;

  if (tab_id != browser.tabs.TAB_ID_NONE) {
    let url;

    try {
      url = new URL(details.url);
    } catch (e) {
      return e;
    }

		browser.tabs.get(tab_id)
    .then((tab) => {
      // Be sure that `MTABS` has an entry for `tabId`
      if (!MTABS.has(tab_id)) {
        MTABS.set(tab_id, new CDNiffer(new URL(tab.url)));
	      console.log("[webRequest.onBeforeRequest] created new tabId: ", tab_id);
      }

      MTABS.get(tab_id).addRequest(url)
    });
	}
}, {urls: ["<all_urls>"]})

browser.tabs.onCreated.addListener((tab)=>{
	if (tab.id != browser.tabs.TAB_ID_NONE) {
		MTABS.set(tab.id, new CDNiffer(new URL(tab.url)));
		console.log("[tabs.onCreated] tabId: ", tab.id);
	}
})

browser.tabs.onRemoved.addListener((tabId, removeInfo)=>{
	if (tabId != browser.tabs.TAB_ID_NONE) {
		MTABS.delete(tabId);
		console.log("[tabs.onRemoved] tabId: ", tabId);
	}
})

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab)=>{
	if (tabId != browser.tabs.TAB_ID_NONE) {

		if (!MTABS.has(tabId)) {
			MTABS.set(tab.id, new CDNiffer(new URL(tab.url)));
			console.log("[tabs.onUpdated] created new tabId: ", tab.id);
		}

		if (changeInfo.url) {
			let new_hostname = new URL(changeInfo.url).url;
			let old_hostname = MTABS.get(tabId).url.url;

			if (new_hostname != old_hostname) {
				MTABS.set(tabId, new CDNiffer(new URL(changeInfo.url)));
				console.log("[tabs.onUpdated] updated URL for tabId: ", tabId);
			}
		}
	}
})

browser.tabs.onActivated.addListener(()=>{});

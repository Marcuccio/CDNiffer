"use strict";

var MTABS = new Map();
var HOSTNAME_CACHE = new Map();
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

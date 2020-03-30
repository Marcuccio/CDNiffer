"use strict";

// url is of type URL
class CDNiffer {
  constructor(url) {
  	this.tab_url = url;
    this.tab_request_counter = 0;
    this.tab_cdn = new Map(); // <Entry>
  }

  // The originURL has to match the URL
  addRequest(url) {
    this.tab_request_counter += 1;
    // browser.dns.resolve(url.hostname, ["allow_name_collisions", "canonical_name"])
    //   .then((resolved) => {
    //     if (resolved !== "") {
    //       var cname = resolved.canonicalName;
    //       // Check if this `canonicalName` is similar to a known CDN
    //       var is_cdn = cname_chain_json.reduce((found,curr,index,array) => {
    //         if (cname.indexOf(curr[0]) > -1) {
    //           return index;
    //         } else
    //         return found;
    //       }, -1);
    //       this.requests_entries.get(url.hostname).cdn = cname_chain_json[is_cdn];
    //       this.requests_entries.get(url.hostname).canonical_name = cname;
    //     }
    //   });
    return 0;
  }
}

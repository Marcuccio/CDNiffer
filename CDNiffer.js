"use strict";

class Entry {
  constructor (url, canonical_name, cdn) {
    this.hostname = url.hostname;
    this.canonical_name = canonical_name;
    this.resources = [];
    this.cdn = cdn;
    this.resources.push([url.pathname, url.search]);
  }

  isCdn() {
    return this.cdn !== undefined;
  }
}
// url is of type URL
class CDNiffer {
  constructor(url) {
    this.hostname = url.hostname;
  	this.url = url;
    this.request_counter = 0;
    this.requests_details = new Set(); // <Entry>
  }

  addRequest(url) {
    for (entry of this.requests_details) {
      if (url.hostname == entry.hostname) {
        this.request_counter += 1
        entry.resources.push([url.path, url.query]);
        return entry.canonicalName;
      }
    }

    let e = new Entry(url, undefined, undefined)
    this.requests_details.add(new Entry(url, undefined, undefined));

    browser.dns.resolve(url.hostname, ["allow_name_collisions", "canonical_name"])
    .then((resolved) => {
      if (resolved !== "") {
        var cname = resolved.canonicalName;
        // Check if this `canonicalName` is similar to a known CDN
        var is_cdn = cname_chain_json.reduce((found,curr,index,array) => {
            if (cname.indexOf(curr[0]) > -1) {
              return index;
            } else
              return found;
        }, -1);
        e.cdn = cname_chain_json[is_cdn];
      }
    })
  }
}

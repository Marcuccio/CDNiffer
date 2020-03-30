// Intercept each request
browser.webRequest.onBeforeRequest.addListener((details)=>{
  let tabId = details.tabId;
  console.log(tabId);

  if (MTABS.has(tabId)) {
    let url;
    let originURL = details.originURL;

    try {
      url = new URL(details.url);
      MTABS.get(tabId).addRequest(url);
    } catch (exception) {
      return exception;
    }
	}
}, {urls: ["<all_urls>"]})

browser.tabs.onCreated.addListener((tab)=>{
	if (tab.id != browser.tabs.TAB_ID_NONE) {
      MTABS.set(tab.id, undefined);
  }
})

browser.tabs.onRemoved.addListener((tabId, removeInfo)=>{
  MTABS.delete(tabId);
})


browser.tabs.onUpdated.addListener(handleUpdate)

function handleUpdate(tabId, changeInfo, tab) {

	if (MTABS.has(tabId) && changeInfo.url && changeInfo.status == 'loading'){

    try {
      let url = new URL(changeInfo.url);
      MTABS.set(tabId, new CDNiffer(url));
    } catch (e) {
      console.error('[onUpdated] Invalid URL: ', changeInfo.url);
    }
  }
}

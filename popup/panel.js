const panel_title = document.querySelector("#tab-title");
const panel_logo = document.querySelector("#tab-logo");


browser.tabs.query({active: true, currentWindow: true})
.then((tabs)=>{
	var active_tab_id = tabs[0].id;

	let url = new URL(tabs[0].url);
	let hostname = url.hostname;
	let favicon = tabs[0].favIconUrl

	panel_title.textContent = hostname;
	panel_logo.style["background-image"] = "url("+favicon+")";

	return active_tab_id;
})
.then((active_tab_id)=>{
	browser.runtime.getBackgroundPage().then((window)=> {
		if (active_tab_id != browser.tabs.TAB_ID_NONE) {
			stats = window.MTABS.get(active_tab_id);
			console.log("[getBackgroundPage] active_tab_id: ", active_tab_id, stats);
		}
	});
})

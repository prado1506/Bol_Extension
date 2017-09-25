if (localStorage.getItem("bolhelper") === null) {
  localStorage.setItem("bolhelper",JSON.stringify({github:true,pastebin:true,openlink:true,codebox:true,privatepaste:true,signatureLinks:false}))
}

var settings = JSON.parse(localStorage.getItem("bolhelper"));
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	if (message.action == "download") {
		try{
			if (message.type == "gitHubRaw") {
				chrome.downloads.download({
				  url: message.url,
				  filename: decodeURI(message.url.replace(/^.*[\\\/]/, ''))
				});
			};
			if (message.type == "pastebinRaw") {
				chrome.downloads.download({
				  url: message.url,
				  filename: message.url.split("i=")[1]+".lua"
				});
			};
			if (message.type == "luaRaw") {
				chrome.downloads.download({
				  url: message.url,
				  filename: message.url.split("/").pop()
				});
			};
			if (message.type == "gitHubLink") {
				var urlLink = "https://raw.githubusercontent.com/" + message.url.replace("/blob", "").split("github.com/")[1];
				chrome.downloads.download({
				  url: urlLink,
				  filename: decodeURI(urlLink.replace(/^.*[\\\/]/, ''))
				});
			};
			if (message.type == "pastebinLink") {
				var test = /pastebin\.com\/(.*)/
				var urlLink = "http://pastebin.com/raw.php?i=" + message.url.match(test)[1];
				chrome.downloads.download({
				  url: urlLink,
				  filename: urlLink.split("i=")[1]+".lua"
				});
			};
			if (message.type == "privatePasteRaw") {
				chrome.downloads.download({
				  url: message.url,
				  filename: message.url.split("http://privatepaste.com/download/")[1]+".lua"
				});
			};
			if (message.type == "privatePasteLink") {
				var urlLink = "http://privatepaste.com/download/" + message.url.split("privatepaste.com/")[1];
				chrome.downloads.download({
				  url: urlLink,
				  filename: urlLink.split("privatepaste.com/download/")[1]+".lua"
				});
			};
		}catch(err){alert("Bot of Legends Helper Error:" + error)}
	};
	if (message.action == "create") {
		var luaFile = new Blob([message.code]);
		var fileUrl = window.webkitURL.createObjectURL(luaFile);
		chrome.downloads.download({
			url: fileUrl,
			filename: "newLua.lua"
		});
	};
	if(message.action == "settings") {
		sendResponse({settings:settings});
	}
});

function popupNewTab(link){
	chrome.tabs.create({ url: link });
}

function updateSettings(option){
	settings[option] = !settings[option];
	localStorage.setItem("bolhelper",JSON.stringify(settings))
} 
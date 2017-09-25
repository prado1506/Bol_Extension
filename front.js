var settings = false;
chrome.runtime.sendMessage({action: "settings"}, function(response) {
  	settings =  response.settings;
});




function buildPage(){
	var testCases = [
		{
			name:"pastebinRaw",
			test:/pastebin\.com\/raw.php\?i=(.*)/
		},
		{
			name:"pastebinLink",
			test:/pastebin\.com\/((?!raw).*)/
		},
		{
			name:"gitHubLink",
			test:/github\.com\/(.*)\.lua/
		},
		{
			name:"gitHubRaw",
			test:/githubusercontent\.com\/(.*)\.lua/
		},
		{
			name:"privatePasteLink",
			test:/privatepaste.com\/((?!download).*)/
		},
		{
			name:"privatePasteRaw",
			test:/privatepaste.com\/download\/(.*)/
		},
		{
			name:"luaRaw",
			test:/^(.*).lua$/
		}
	];


	var array = [];
	var links = document.getElementsByTagName("a");

	for(var i=0; i<links.length; i++) {
		for(var x = 0; x < testCases.length; x++){
			if(testCases[x].name == "pastebinRaw" || testCases[x].name == "pastebinLink"){
				if(!settings.pastebin){
					continue;
				}
			}
			if(testCases[x].name == "gitHubLink" || testCases[x].name == "gitHubRaw"){
				if(!settings.github){
					continue;
				}
			}
			if(testCases[x].name == "privatePasteLink" || testCases[x].name == "privatePasteRaw"){
				if(!settings.privatepaste){
					continue;
				}
			}
			if(links[i].href.match(testCases[x].test)){
				if(!settings.signatureLinks){
					var a = links[i];
					var disableLink = false;
					while (a) {
					    if(typeof a.className != "undefined" && a.className.indexOf("signature")>=0){
					        disableLink = true
					    }
					    a = a.parentNode;
					}
					if (disableLink) {
						continue;
					};
				}
				var opener = settings.openlink ? ' Or <span>Open Link</span>' : '';
				links[i].insertAdjacentHTML('beforebegin','<div class="dlhelper" dltype="'+testCases[x].name+'" dllink="'+links[i].href+'"><img src="https://raw.githubusercontent.com/thelaw44/BoL-Extenstion/master/arrow_animate.gif">&nbsp;&nbsp;&nbsp;BoL Helper: <span>Download Script('+decodeURI(links[i].href.replace(/^.*[\\\/]/, ''))+')</span>'+opener+'</div>');
				links[i].style.display = 'none';
				array.push(links[i]);
				i++;
			}
			
		}	
	}



	for(var x = 0; x < array.length; x++){
		var h3Obj = array[x].previousElementSibling
		h3Obj.childNodes[2].addEventListener("click", function(event){
			dl(this.parentNode)
		});
		if(settings.openlink){
			h3Obj.childNodes[4].addEventListener("click", function(event){
				var win = window.open(this.parentNode.getAttribute("dllink"), '_blank');
		  		win.focus();
			});
		}
		var changeButton = document.createElement("img")
		changeButton.src = chrome.extension.getURL("ISync_icon.png");
		changeButton.className = "changeButton"
		changeButton.addEventListener("click", function(event){
			this.parentNode.style.display = "none";
			this.parentNode.nextSibling.style.display = "block"
		});
		h3Obj.appendChild(changeButton);
	}

	if(settings.codebox){
		for(var x = 0; x < document.getElementsByClassName("prettyprint").length; x++){
			document.getElementsByClassName("prettyprint")[x].innerHTML = "<button>Download this code with Bot Of Legends Helper</button></br>" + document.getElementsByClassName("prettyprint")[x].innerHTML;
			document.getElementsByClassName("prettyprint")[x].firstChild.addEventListener("click",function(event){
				var lua = this.parentNode.innerHTML.split("</button>")[1].replace(/<[^>]*>/g, "").replace("&nbsp;","").replace(/&lt;/g,'<').replace(/&gt;/g,'>');
				createLua(lua);
			});
		}
	}
}


function dl(obj,type){
	chrome.runtime.sendMessage({action:"download",url:obj.getAttribute("dllink"),type:obj.getAttribute("dltype")});
}

function createLua(lua){
	chrome.runtime.sendMessage({action:"create",code:lua});
}


var _settingsCheck = setInterval(function() {
    if (settings != false) {
        clearInterval(_settingsCheck);
        buildPage(); 
    }
}, 100);
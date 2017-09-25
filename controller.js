var app = angular.module("BE",[]);
var background = chrome.extension.getBackgroundPage();


app.controller("info",function($scope,$http){
	$scope.bol = {
		version:"",
		status:false
	}
	$http.get('https://raw.githubusercontent.com/thelaw44/BoL-Extenstion/master/status?random='+Math.floor((Math.random() * 1000000000) + 1)).
  	success(function(data, status, headers, config) {
		$scope.bol.version = data.version;
		$scope.bol.status = data.status;
		console.log(data);
  	}).
  	error(function(data, status, headers, config) {
	    console.log("Can't connect to Law's Github")
  	});
})

var champList = ["Aatrox","Ahri","Akali","Alistar","Amumu","Anivia","Annie","Ashe","Azir","Bard","Blitzcrank","Brand","Braum","Caitlyn","Cassiopeia","Cho'gath","Corki","Darius","Diana","Dr. Mundo","Draven","Elise","Evelynn","Ezreal","Fiddlesticks","Fiora","Fizz","Galio","Gangplank","Garen","Gnar","Gragas","Graves","Hecarim","Heimerdinger","Irelia","Janna","Jarvan IV","Jax","Jayce","Jinx","Kalista","Karma","Karthus","Kassadin","Katarina","Kayle","Kennen","Kha'Zix","Kog'Maw","LeBlanc","Lee Sin","Leona","Lissandra","Lucian","Lulu","Lux","Malphite","Malzahar","Maokai","Master Yi","Miss Fortune","Mordekaiser","Morgana","Nami","Nasus","Nautilus","Nidalee","Nocturne","Nunu","Olaf","Orianna","Pantheon","Poppy","Quinn","Rammus","Rek'Sai","Renekton","Rengar","Riven","Rumble","Ryze","Sejuani","Shaco","Shen","Shyvana","Singed","Sion","Sivir","Skarner","Sona","Soraka","Swain","Syndra","Talon","Taric","Teemo","Thresh","Tristana","Trundle","Tryndamere","Twisted Fate","Twitch","Udyr","Urgot","Varus","Vayne","Veigar","Vel'Koz","Vi","Viktor","Vladimir","Volibear","Warwick","Wukong","Xerath","Xin Zhao","Yasuo","Yorick","Zac","Zed","Ziggs","Zilean","Zyra"];


app.controller("fastss", function($scope,$http){
	$scope.champName = "";
	$scope.scriptList = [];
	$scope.suggestion = "";
	$scope.$watch('champName', function(){
		$scope.scriptList = [];
		$scope.suggestion = $scope.champName;
		for(var z = 0; z < champList.length;z++){
			if(champList[z].toLowerCase().indexOf($scope.champName.toLowerCase()) >= 0){
				$scope.suggestion = champList[z];
				break;
			}
		}
		$http.get('http://www.scriptstatus.net/get-'+$scope.suggestion).
	  	success(function(data, status, headers, config) {
	  		$scope.scriptList = [];
			if(data.indexOf("<tbody>")>0){
				var regex = /<tr id="tr-(.*?)"><td>(.*?)<\/td><td class="(.*?)">(.*?)<\/td><td class="name (.*?)">(.*?)<\/td><td>(.*?)<\/td><td>(.*?)<td>*/gi; 
				do {
				    m = regex.exec(data);
				    if (m) {
				    	var script = {
				        	type: m[4],
				        	name: m[6].substring(0, 40),
				        	status: m[5],
				        	link: "http://scriptstatus.net/goto-"+m[1],
				        	author: ""
				        }
				        if(m[7].indexOf("<a target=")>=0){
				        	script.author = m[7].split("-\">")[1].split("<")[0];
				        }else{
				        	script.author = m[8];
				        }
				        $scope.scriptList.push(script);
				    }
				} while (m);

			}
	  	}).
	  	error(function(data, status, headers, config) {
		    console.log("Can't connect to Script Status")
	  	});
	});
	$scope.open = function(link){
		background.popupNewTab(link)
	}
});

app.controller("settings",function($scope){
	$scope.settings = {
		github:background.settings.github,
		pastebin:background.settings.pastebin,
		openlink:background.settings.openlink,
		codebox:background.settings.codebox,
		privatepaste:background.settings.privatepaste,
		signatureLinks:background.settings.signatureLinks
	}
	$scope.set = function(option){
		$scope.settings[option] = !$scope.settings[option];
		background.updateSettings(option)
	}
});
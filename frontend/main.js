// handle customization
var customizeReq = new XMLHttpRequest();
customizeReq.open('GET', "config.json", true);
customizeReq.addEventListener("load", function() {
	if (customizeReq.status < 300) {
		var json = JSON.parse(customizeReq.responseText);
		if (json.Title != null) {
			var pageTitle = document.getElementById("page-title");
			pageTitle.innerHTML = json.Title;
		}
	}
});
customizeReq.send(null);

// get links 
var currentHash = document.location.pathname.split('/')[2];
var req = new XMLHttpRequest();
var path = "/ipfs/" + currentHash + "/posts";
var lsUrl =  "http://127.0.0.1:5001/api/v0/file/ls?arg=" + path;
req.open('GET', lsUrl, true);
req.addEventListener("load", function() {
	if (req.status < 300) {	// FIXME
		var json = JSON.parse(req.responseText);
		var arg = json.Arguments[path];
		var linksJson = json.Objects[arg].Links;
		var linksDiv = document.getElementById("links");
		linksJson.forEach(function(link) {
			// FIXME:  security
			var li = document.createElement('li');
			var a = document.createElement('a');
			var url =  "./post.html?" + link.Name;
			a.href = url;
			var p = document.createTextNode(link.Name);
			a.appendChild(p);
			li.appendChild(a);
			linksDiv.appendChild(li);
		});
	}
	
});
req.send(null);

// handle new link
var form = document.querySelector("form");
form.addEventListener("submit", function(evt) {
	var req = new XMLHttpRequest();
	var url =  "http://127.0.0.1:8080/ipfs/" + currentHash + "/posts/" + form.elements.name.value;
	req.open('PUT', url, true);
	req.addEventListener("load", function() {
		// FIXME:  check for error ya dummy
		var newHash = req.getResponseHeader("Ipfs-Hash");
		var newUrl = "http://127.0.0.1:8080/ipfs/" + newHash;
		web3 = new Web3(web3.currentProvider);
		abi = ([ { "constant": true, "inputs": [], "name": "resolve", "outputs": [ { "name": "", "type": "string", "value": "QmSw5w2DeF4UccR45Rcsx3L3oNCDuYCL8My4uHdj7pNZsv" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "_target", "type": "string" } ], "name": "update", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "kill", "outputs": [], "payable": false, "type": "function" }, { "inputs": [ { "name": "_target", "type": "string", "index": 0, "typeShort": "string", "bits": "", "displayName": "&thinsp;<span class=\"punctuation\">_</span>&thinsp;target", "template": "elements_input_string", "value": "QmSw5w2DeF4UccR45Rcsx3L3oNCDuYCL8My4uHdj7pNZsv" } ], "payable": false, "type": "constructor" } ]);
		contract = web3.eth.contract(abi)
		instance = contract.at("0xd1E42EdcB67e07541B2Cae0eC259d24642E4E436");
		var account = "";
		web3.eth.getAccounts(function(e, a) {
			account = a[0];
			instance.update(newHash, web3.eth.getBlockNumber(), {from: account}, function() { console.log("hi"); });
		});
		instance.update(newHash, web3.eth.getBlockNumber(), {from: "0x86F01c7DD570879Db8E3BD4cB0D01cc76f5dcC7e"}, function() { console.log("hi"); });
		window.location.replace("http://127.0.0.1:8080/ipfs/" + newHash);
	});
	req.send(form.elements.content.value);
	evt.preventDefault();
});

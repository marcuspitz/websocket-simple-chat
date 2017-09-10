
var Socket = function() {
	// Let us open a web socket
	var ws = new WebSocket("ws://localhost:8080/", "server-side-custom-protocol");
	ws.connected = false;
	
	this.sendMessage = function (message) {		
		if (ws.connected == true) {
			alert("Sending message:" + message);
			ws.send(message);
		} else {
			alert("Connecting...");
		}
	}

	ws.onopen = function()
	{
	  //ws.send("Message to send");
	  alert("Connected");
	  ws.connected = true;
	};

	ws.onmessage = function (evt) 
	{ 
	  var received_msg = evt.data;
	  alert("Message is received:" + received_msg);
	};

	ws.onclose = function()
	{ 
	  alert("Connection is closed..."); 
	};
		
	window.onbeforeunload = function(event) {
	  ws.close();
	};
	
};
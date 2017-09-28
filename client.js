
var Socket = function(on) {
	on.connect = on.connect || {};
	on.message = on.message || {};
	on.disconnect = on.disconnect || {};
	//Open a ws connection, with custom protocol
	let ws = new WebSocket("ws://localhost:8080/", "server-side-custom-protocol");
	
	ws.connected = false;
	
	//On close webpage
	window.onbeforeunload = function(event) {
	  ws.close();
	};
	
	this.sendMessage = (message) => {		
		if (ws.connected == true) {
			console.log("Sending message:" + message);
			ws.send(message);
		} else {
			console.log("Connecting...");
		}
	}

	ws.onopen = () => {	  
	  ws.connected = true;
	  console.log("Connected");
	  on.connect ();
	};

	ws.onmessage = (evt) => { 
	  let received_msg = evt.data;
	  console.log("Message received:" + received_msg);
	  on.message ();
	};

	ws.onclose = () => { 
	  console.log("Connection is closed..."); 
	  on.disconnect ();
	};	
	
};
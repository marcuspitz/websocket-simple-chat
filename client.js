
var Socket = function(on) {
	on.json = on.json || false;
	on.connect = on.connect || function() {};
	on.message = on.message || function(m) {};
	on.disconnect = on.disconnect || function() {};
	
	//Open a ws connection, with custom protocol
	let ws = new WebSocket("ws://" + on.path, on.protocol);
	
	ws.connected = false;
	
	//On close webpage
	window.onbeforeunload = (event) => ws.close();
	
	this.sendMessage = (message) => {		
		if (ws.connected == true) {
			message = on.json ? JSON.stringify(message) : message;
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
	  received_msg = on.json ? JSON.parse(received_msg) : received_msg;	  
	  on.message (received_msg);
	};

	ws.onclose = () => { 
	  console.log("Connection is closed..."); 
	  on.disconnect ();
	};	
	
};
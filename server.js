/**
* Marcus Vinicius Pitz
* Copyright: 2017
* License: http://www.apache.org/licenses/LICENSE-2.0
**/
exports.WebServer =  function WebServer (config) {
	config.json = false || config.json;
	const WebSocketServer = require('websocket').server;
	const http = require('http');
	const logEnabled = true;
	
	let clients = [];
	
	//Listeners
	let onConnectListener = (client) => {};
	let onMessageListener = (type, message, client) => {};
	let onCloseConnectionListener = (client) => {};
	
	const server = http.createServer( (request, response) => {
		this.log('HTTP Request are ignored.');
		response.writeHead(404);
		response.end();
	}).listen(8080, () => {
		this.log('Server started, listening on 8080 port');
	});
	
	//Request is allowed?
	const allowRequest = (origin) => true;
	
	const socket = new WebSocketServer({
		httpServer: server,
		autoAcceptConnections: false
	});
	
	this.on = (type, listener) => {		
		type = type.toLowerCase();
		if (type === 'connect') {
			this.onConnectListener = listener;
		} else if (type === 'message') {
			this.onMessageListener = listener;
		} else if (type === 'disconnect') {
			this.onCloseConnectionListener = listener;
		}
		return this;
	};

	this.log = (message) => {
		if (logEnabled) {
			console.log((new Date()) + '::' + message);
		}
	}
	
	this.allClients = () => clients;	
	
	this.send = (client, message, type='utf8') => {
		if (type === 'utf8') {
			this.log('Sending: ' + config.json ? JSON.stringify(message) : message );
			client.sendUTF( config.json ? JSON.stringify(message) : message );
		} else {
			client.sendBytes(message);
		}
	}
	
	this.sendBroadcastMessage = (message, type='utf8') => {
		for (c in clients) {
			this.send(clients[c], message, type);			
		};
	}	

	socket.on('request', (request) => {
		
		if (!allowRequest(request.origin)) {
		  this.log('Connection from ' + request.origin + ' was rejected.');
		  request.reject();      
		  return;
		}    
		
		const connection = request.accept('server-side-custom-protocol', request.origin);
		connection.clientName = "client"+new Date().getTime();
		clients[connection.clientName] = connection;
		this.onConnectListener(connection);
		this.log('Connection from ' + request.origin + ' was accepted:' + connection.clientName);
		
		connection.on('message', (message) => {
			if (message.type === 'utf8') {
				let currMsg = config.json ? JSON.parse(message.utf8Data) : message.utf8Data
				this.log('Received Message: ' + currMsg + ', from: ' + connection.clientName);
				this.onMessageListener(message.type, currMsg, connection);
			} else if (message.type === 'binary') {
				this.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
				this.onMessageListener(message.type, message.binaryData, connection);
			}			
		});
		
		connection.on('close', (reasonCode, description) => {
			this.log('Connection ' + connection.clientName + ' was disconnected.');
			delete clients[connection.clientName];
			this.onCloseConnectionListener(connection);
		});
		
	});
}
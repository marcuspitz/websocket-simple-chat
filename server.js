/**
* Marcus Vinicius Pitz
* Copyright: 2017
* License: http://www.apache.org/licenses/LICENSE-2.0
**/
exports.WebServer =  function WebServer () {	
	const WebSocketServer = require('websocket').server;
	const http = require('http');
	const logEnabled = true;
	
	let clients = [];
	
	//Listeners
	let onConnectListener = (connection) => {};
	let onMessageListener = (type, message) => {};
	let onCloseConnectionListener = (connection) => {};
	
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
	
	this.sendBroadcastMessage = (message, ignore, type='utf8') => {
		ignore = ignore || '';
		clients.forEach( (c) => {
			
		}); 
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
		onConnectListener(connection);
		this.log('Connection from ' + request.origin + ' was accepted.');
		
		connection.on('message', (message) => {
			if (message.type === 'utf8') {
				this.log('Received Message: ' + message.utf8Data + ', from: ' + connection.clientName);
				connection.sendUTF(message.utf8Data);
				onMessageListener(message.type, message.utf8Data);
			} else if (message.type === 'binary') {
				this.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
				connection.sendBytes(message.binaryData);
				onMessageListener(message.type, message.binaryData);
			}			
		});
		
		connection.on('close', (reasonCode, description) => {
			this.log('Connection ' + connection.clientName + ' was disconnected.');
			delete clients[connection.clientName];
			onCloseConnectionListener(connection);
		});
		
	});
}
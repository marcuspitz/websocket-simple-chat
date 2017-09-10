/**
* Marcus Vinicius Pitz
* Copyright: 2017
* License: http://www.apache.org/licenses/LICENSE-2.0
**/
exports.WebServer = function WebServer () {	
	var WebSocketServer = require('websocket').server;
	var http = require('http');
	var clients = [];
	var logEnabled = true;
	var self = this;
	
	//Listeners
	var onConnectListener = function(connection) {};
	var onMessageListener = function(type, message) {};
	var onCloseConnectionListener = function(connection) {};
	
	this.on = function(type, listener) {
		type = type.toLowerCase();
		if (type === 'connect') {
			onConnectListener = listener;
		} else if (type === 'message') {
			onMessageListener = listener;
		} else if (type === 'disconnect') {
			onCloseConnectionListener = listener;
		}
		return this;
	};

	var server = http.createServer(function(request, response) {
		self.log('HTTP Request are ignored.');
		response.writeHead(404);
		response.end();
	});

	server.listen(8080, function() {
		self.log('Server started, listening on 8080 port');
	});

	socket = new WebSocketServer({
		httpServer: server,
		autoAcceptConnections: false
	});

	this.log = function(message) {
		if (logEnabled) {
			console.log((new Date()) + '::' + message);
		}
	}
	
	this.sendBroadcastMessage(message, type, ignore) {
		type = type || 'utf8';
		ignore = ignore || '';
		for (c in clients) {
			
		}
	}

	//Request is allowed?
	var allowRequest = function(origin) {
	  return true;
	}

	socket.on('request', function(request) {
		
		if (!allowRequest(request.origin)) {
		  self.log('Connection from ' + request.origin + ' was rejected.');
		  request.reject();      
		  return;
		}    
		
		var connection = request.accept('server-side-custom-protocol', request.origin);
		connection.clientName = "client"+new Date().getTime();
		clients[connection.clientName] = connection;
		onConnectListener(connection);
		self.log('Connection from ' + request.origin + ' was accepted.');
		
		connection.on('message', function(message) {
			if (message.type === 'utf8') {
				self.log('Received Message: ' + message.utf8Data + ', from: ' + connection.clientName);
				connection.sendUTF(message.utf8Data);
				onMessageListener(message.type, message.utf8Data);
			} else if (message.type === 'binary') {
				self.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
				connection.sendBytes(message.binaryData);
				onMessageListener(message.type, message.binaryData);
			}			
		});
		
		connection.on('close', function(reasonCode, description) {
			self.log('Connection ' + connection.clientName + ' was disconnected.');
			delete clients[connection.clientName];
			onCloseConnectionListener(connection);
		});
		
	});
}

//Export real module object WebServer
//module.exports = WebServer;
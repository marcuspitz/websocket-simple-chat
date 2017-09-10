var WebSocketServer = require('websocket').server;
var http = require('http');
var clients = [];

var server = http.createServer(function(request, response) {
    log('HTTP Request are ignored.');
    response.writeHead(404);
    response.end();
});

server.listen(8080, function() {
    log('Server started, listening on 8080 port');
});

socket = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

function log(message) {
	console.log((new Date()) + '::' + message);
}

//Request is allowed?
function allowRequest(origin) {
  return true;
}

socket.on('request', function(request) {
	
    if (!allowRequest(request.origin)) {
	  log('Connection from ' + request.origin + ' was rejected.');
      request.reject();      
      return;
    }    
	
    var connection = request.accept('server-side-custom-protocol', request.origin);
	connection.clientName = "client"+new Date().getTime();
	clients[connection.clientName] = connection;
    log('Connection from ' + request.origin + ' was accepted.');
	
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            log('Received Message: ' + message.utf8Data + ', from: ' + connection.clientName);
            connection.sendUTF(message.utf8Data);
        } else if (message.type === 'binary') {
            log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });
	
    connection.on('close', function(reasonCode, description) {
        log('Connection ' + connection.clientName + ' was disconnected.');
		delete clients[connection.clientName];
		for (c in clients) {
			clients[c].sendUTF("Client " + connection.clientName + " was desconnected.");
		}
    });
	
});
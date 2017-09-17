/**
* Marcus Vinicius Pitz
* Copyright: 2017
* License: http://www.apache.org/licenses/LICENSE-2.0
**/
var server = require('./server.js');

var ws = new server.WebServer();

ws.on('connect', (connection) => {
	ws.log('Connect on CHAT');
});

ws.on('message', (type, message) => {
	ws.log('Message on CHAT:' + message);
});

ws.on('disconnect', (connection) => {
	ws.log('Disconect from CHAT');
});


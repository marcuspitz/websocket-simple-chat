/**
* Marcus Vinicius Pitz
* Copyright: 2017
* License: http://www.apache.org/licenses/LICENSE-2.0
**/
var server = require('./server.js');

var ws = new server.WebServer({
		json : true
	});

ws.allUserNames = () => {
	let users = [];		
	for (c in ws.allClients()) {
		let client = ws.allClients()[c];
		if (client.data.logged) {
			users.push( {'user' : client.data.username} );
		}
	}
	return users;
}

ws.on('connect', (client) => {
	ws.log('Connect on CHAT:' + client.clientName);
	client.data = client.data || {};
	client.data.logged = false;
});

ws.on('message', (type, message, client) => {
	ws.log('Message on CHAT:' + message);
	
	if (message.type === 'loggin') {
		client.data.username = message.nick;
		client.data.logged = true;
		//Enter
		ws.sendBroadcastMessage(
			{
				type : 'user_enter',
				user : client.data.username
			}
		);
		//Update a list
		ws.sendBroadcastMessage(
			{
				type : 'list_users',
				users : ws.allUserNames()
			}
		);
	}
	
	if (message.type === 'message') {
		//Send message to ALL
		ws.sendBroadcastMessage(
			{
				type : 'message',
				user : client.data.username,
				msg  : message.msg
			}
		);
	}
	
	/** RECEIVE
	Protocol loggin:
	{
		type: loggin,
		nick: nick_name
	}
	Protocol message:
	{
		type: message,
		msg: message
	}
	**/
	
	/** SEND
	Protocol message:
	{
		type: message,
		user: user
		msg: message
	}
	Protocol enter:
	{
		type: user_enter,
		user: name
	}
	Protocol leave:
	{
		type: user_leave,
		user: name
	}
	Protocol list_users:
	{
		type: list_users,
		users: [{user:name}...N]
	}
	**/
	
});

ws.on('disconnect', (client) => {
	ws.log('Disconect from CHAT');
	if (client.data.logged) {
		ws.sendBroadcastMessage(
			{
				type : 'user_leave',
				user : client.data.username
			}
		);
		ws.sendBroadcastMessage(
			{
				type : 'list_users',
				users : ws.allUserNames()
			}
		);
	}
});


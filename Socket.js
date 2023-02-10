const WebSocket = require('ws');

const Web_Socket_Server = new WebSocket.Server ({port: 3031});

Web_Socket_Server.on ('connection', (Web_Socket, Request) => 
{
	Web_Socket.URL = Request.headers.origin;

	Web_Socket.on ('message', Message => 
	{
		setTimeout (() => Web_Socket_Server.clients.forEach (Client => 
		{
			if (Client.URL === process.env.Ordering_Application_Root_URL || Client.URL === process.env.Production_Root_URL)
			{
				Client.send (Message);
			}
		}), 5000);
	});
});

module.exports = Web_Socket_Server;
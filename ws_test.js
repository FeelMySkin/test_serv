var wsPort = 3389;

var WebSocketServer = require('websocket').server;
var http = require('http');
var clients = [];
var counter = 0;

var server = http.createServer(function(request,response)
{

});

server.listen(wsPort, function()
{
	console.log("server listening on port " + wsPort);
});

var wsServer = new WebSocketServer({
	httpServer: server
});

function SendAll()
{
	var obj = {type: 'show',mess:counter};
	var json = JSON.stringify(obj);
	for(var i = 0;i<clients.length;i++)
	{
		clients[i].send(json);
	}
}

wsServer.on('request', function(request)
{
	console.log('Connect from ' + request.origin + '.');

	var connection = request.accept(null, request.origin);
	var index = clients.push(connection) - 1;

	console.log("Connected " + index);

	connection.on('message',function(message)
	{
		console.log(message);
		var json = JSON.parse(message.utf8Data);
		console.log(json);
		switch(json.type)
		{
			case 'increase':
				counter++;
				console.log(counter);
				if(!json.anon) SendAll();
				else
				{
					var obj = {type:'show', mess:counter};
					var json = JSON.stringify(obj);
					connection.send(json);
				}
			break;

			case 'decrease':
				counter--;
				console.log(counter);
				if(!json.anon) SendAll();
				else
				{
					var obj = {type: 'show', mess:counter};
					var json = JSON.stringify(obj);
					connection.send(json);
				}
			break;

			case 'save_db':
				console.log(save_received);
				var obj = {type: 'saved', mess:'Saved'};
				connection.send(JSON.stringify(obj));
			break;

			default:
				break;
		}
	});

	connection.on('close', function(connection)
	{
		clients.splice(index,1);
		console.log('Disconnected ' +  index);
	});
});


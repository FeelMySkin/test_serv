var wsPort = 3389;

var WebSocketServer = require('websocket').server;
var http = require('http');
var clients = [];

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

wsServer.on('request', function(request)
{
	console.log('Connect from ' + request.origin + '.');

	var connection = request.accept(null, request.origin);
	var index = clients.push(connection) - 1;
	
	console.log("Connected " + index);

	connection.on('message',function(message)
	{
		console.log(message);
		var json = JSON.parse(message);
		switch(json.data.type)
		{
			case 'increase':
				console.log
		}
	});

	connection.on('close', function(connection)
	{
		clients.splice(index,1);
		console.log('Disconnected ' +  index);
});


/*var io = require('socket.io')(3389);
var counter = 0;

io.on('connection', function(socket)
{
	console.log("user connected "  + socket.id);
	
	socket.on('increase', function(anon)
	{
		counter++;
		console.log("Increased " + socket.id);
		if(!anon) io.emit('changed',counter);
		else io.to(socket.id).emit('changed',counter);
	});
	
	socket.on('decrease',function()
	{
		counter--;
		console.log("Decreased " + socket.id);
		io.emit('changed',counter);
	});
	
	socket.on('disconnect',function()
	{
		console.log("User disconnected " +socket.id);
	});
});*/

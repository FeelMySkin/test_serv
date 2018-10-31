var io = require('socket.io')(3389);
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
	
	socket.on('decrease',function(anon)
	{
		counter--;
		console.log("Decreased " + socket.id);
		if(!anon) io.emit('changed',counter);
		else io.to(socket.id).emit('changed',counter);
	});
	
	socket.on('disconnect',function()
	{
		console.log("User disconnected " +socket.id);
	});
});

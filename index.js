//var app = require('express')();
//var http = require('http').Server(app);
var io = require('socket.io')(3000);

//app.listen(3000);

/*app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});*/

io.on('connection', function(socket){
	console.log('a user connected');
	
	socket.on('chat message', function(nick, msg) {
		io.emit('chat message', nick, msg);
		console.log(nick + ': ' + msg);
	});
	
	socket.on('disconnect', function(){
		console.log('user disconnected');
	});
});

/*http.listen(3001, function(){
	console.log('listening on *:3000');
});*/

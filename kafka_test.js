var io = require('socket.io')(3389);
var kafka = require('kafka-node');
var crypto = require('crypto');

const hash = crypto.createHash('sha256');
var counter = 0;

var k_client = new kafka.KafkaClient({kafkaHost: 'localhost:9092'});
var producer = new kafka.Producer(k_client);
var consumer = new kafka.Consumer(k_client,[]);

k_client.createTopics([{topic: 'test_topic', partitions:2, replicationFactor:1}],(error,result) => 
{
	console.log("Topic creation:");
	console.log(error);
	console.log(result);
	consumer.addTopics([{topic: 'test_topic', partition:1}], function (err,result)
	{
		console.log("Topic added:");
		console.log(err);
		console.log(result);
	});
});

consumer.on('message', function(mess)
{
	console.log("Message received:");
	console.log(mess);
});

function CreateAccount(mail,pass)
{
	
	var payload = [{topic: 'test_topic', messages: [JSON.stringify({mail: mail, pass: pass})], partition: 0, timestamp: Date.now()}];
	producer.send(payload,function(err,data)
	{
		console.log("payload sent:");
		console.log(err);
		console.log(data);
	});
}

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

	socket.on('acc_create', function(mail,pass)
	{
		console.log('acc create received: ' + mail + "; " + pass);
		CreateAccount(mail,pass);
	});
});

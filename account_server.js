const io = require('socket.io')(3389);
const kafka = require('kafka-node');
const crypto = require ('crypto');

var k_client = new kafka.KafkaClient({kafkaHost: 'localhost:9092'});
var producer = new kafka.Producer(k_client);
var consumer = new kafka.Consumer(k_client,[]);

var topic = 'account_topic';

k_client.createTopics([{topic: topic, partitions:2, replicationFactor:1}],(error,result) => 
{
	console.log("Topic creation:");
	console.log(error);
	console.log(result);
	consumer.addTopics([{topic: topic, partition:1}], function (err,result)
	{
		console.log("Topic added:");
		console.log(err);
		console.log(result);
	});
});

consumer.on('message',function(mess)
{
    console.log(mess);
    var unpacked = JSON.parse(mess.value)
    {
        switch(unpacked.signal)
        {
            case 'register':
                var backpacked = JSON.stringify({status:unpacked.status, message:unpacked.message})
                io.to(unpacked.socket_id).emit('register',backpacked);
                break;

            default:
                break;
        }
    }
});

function SendToKafka(json)
{
	
	var payload = [{topic: topic, messages: [json], partition: 0, timestamp: Date.now()}];
	producer.send(payload,function(err,data)
	{
		console.log("payload sent:");
		console.log(err);
		console.log(data);
	});
}

function CountHash(text)
{
    return new Promise(function(resolve,reject)
    {
        var hash = crypto.createHash("sha256");
        hash.write(text);
        hash.end();

        hash.on('readable',function()
        {
            resolve(hash.read());
        });
    });
}

io.on('connection', function(socket)
{
	console.log("user connected "  + socket.id);

	socket.on('register', function(json) //json: {mail, pass, username}
	{
        var unpacked = JSON.parse(json);
		console.log('acc create received: \nmail: ' + unpacked.mail + ";\npass: " + unpacked.pass +";\nusername: " + unpacked.username);
        
        CountHash(unpacked.pass)
        .then( (hash) =>
            {
                var backpacked = JSON.stringify({signal: 'register', mail:mail, password_hash: hash,username:username, socket_id: socket.id});
                SendToKafka(backpacked);
            });
	});
});

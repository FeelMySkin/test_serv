const express = require('express');
const {Client} = require('pg');
const kafka = require('kafka-node');
const crypto = require ('crypto');



var hash = crypto.createHash('sha256');

const db_client = new Client({
	user: 'root',
	host: 'localhost',
	database: 'vocamsk_test',
	password: 'clannad1',
});

var k_client = new kafka.KafkaClient({kafkaHost: 'localhost:9092'});
var producer = new kafka.Producer(k_client);
var consumer = new kafka.Consumer(k_client,[]);




db_client.connect();
k_client.createTopics([{topic: 'test_topic', partitions:2, replicationFactor:1}],(error,result) => 
{
	console.log("Topic creation:");
	console.log(error);
	console.log(result);
	consumer.addTopics([{topic: 'test_topic', partition:0}], function (err,result)
	{
		console.log("Topic added:");
		console.log(err);
		console.log(result);
	});
});

consumer.on("message",function(mess)
{
	console.log(mess);
	var recv = mess.value;
	var json = JSON.parse(recv);
	var payload;
	console.log(json);

	db_client.query("SELECT mail FROM account_test WHERE mail='" + json.mail + "';", function(err,res)
	{
			if(res.length == 0) payload = [{topic: 'test_topic', messages: [JSON.stringify({status: true})], partition: 1, timestamp: Date.now()}];
			else payload = [{topic: 'test_topic', messages: [JSON.stringify({status: false})], partition: 1, timestamp: Date.now()}];

			producer.send(payload,function(err,res)
			{
				console.log("Sent:");
				console.log(err);
				console.log(res);
			});

			hash.write(json.pass);
			while(!hash.readable) ;
			var hsh = hash.read();
			
			db_client.query("INSERT INTO account_test (mail, password_hash, last_seen, username) VALUES ('" + json.mail + "', " + hsh.toString() + ", " + Date.now().toString() + ", test", function(err,res)
			{
				console.log("DB result:");
				console.log(err);
				console.log(res);
				console.log(hsh);
			});

	});

});
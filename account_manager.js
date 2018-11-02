const express = require('express');
const {Client} = require('pg');
var kafka = require('kafka-node');

const db_client = new Client({
	user: 'root',
	host: 'localhost',
	database: 'vocamsk_test',
});
db_client.connect();

db_client.query('SELECT * FROM account_test;', function(err,res)
{
	
	console.log(err);
	console.log(res.fields);
	console.log(rows);
});


var k_client = new kafka.KafkaClient({kafkaHost: 'localhost:9092'});
var producer = new kafka.Producer(k_client);
var consumer = new kafka.Consumer(k_client,[]);

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

});

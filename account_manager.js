const express = require('express');
const {Client} = require('pg');
const kafka = require('kafka-node');
const crypto = require ('crypto');



var hash;

const db_client = new Client({
	user: 'root',
	host: 'localhost',
	database: 'vocamsk_test',
	password: 'clannad1',
});

var k_client = new kafka.KafkaClient({kafkaHost: 'localhost:9092'});
var producer = new kafka.Producer(k_client);
var consumer = new kafka.Consumer(k_client,[]);
const topic = 'account_topic';


db_client.connect();


function SendToKafka(json)
{
	
	var payload = [{topic: topic, messages: [json], partition: 1, timestamp: Date.now()}];
	producer.send(payload,function(err,data)
	{
		console.log("payload sent:");
		console.log(err);
		console.log(data);
	});
}

k_client.createTopics([{topic: topic, partitions:2, replicationFactor:1}],(error,result) => 
{
	console.log("Topic creation:");
	console.log(error);
	console.log(result);
	consumer.addTopics([{topic: topic, partition:0}], function (err,result)
	{
		console.log("Topic added:");
		console.log(err);
		console.log(result);
	});
});

function GetFromDB(table_name,columns,conditions = null)
{
	var query = "SELECT " + columns + " FROM " + table_name;
	if(conditions != null) query += " WHERE " + conditions + ';';
	else query += ';';
	console.log(query);
	
	return new Promise(function(resolve,reject)
	{
		db_client.query(query,function(err,res)
		{
			console.log(err);
			console.log(res);
			resolve(res);
		});
	});

}

function InsertToDB(table_name, properties)
{
	var prop_name = "(";
	var prop_field = "(";
	console.log(properties);

	for (x in properties)
	{
		console.log(x);
		console.log(properties[x]);
		prop_name += x + ', ';
		prop_field += properties[x] + ', ';
	}

	prop_name = prop_name.slice(0,prop_name-2) + ')';
	prop_field = prop_field.slice(0,prop_field-2) + ')';

	var query = "INSERT INTO " + table_name + ' ' + prop_name + " VALUES " + prop_field + ';';
	console.log(query);

	return new Promise(function(resolve, reject)
	{
		db_client.query(query,function(err,res)
		{
			console.log(err);
			console.log(res);
			resolve(res);
		});
	});
}

function Register(json)
{
	/*JSON file: signal, mail, password_hash, username, socket_id*/
	GetFromDB('account_test','*',"mail='" + json.mail + "'")
	.then(res =>
	{
		var backpack;
		if(res.rowCount == 0) backpack = JSON.stringify({signal:'register', socket_id: json.socket_id, status:true, message:'Success'});
		else backpack = JSON.stringify({signal:'register', socket_id: json.socket_id, status:false, message:'Account Exists'});

		SendToKafka(backpack);
		console.log("Sent to KAFKA!");
		if(res.rowCount == 0) return "1";
		else throw "Account Exists";
	})
	.then(result =>
	{
		InsertToDB('account_test',{mail:json.mail, password_hash:json.password_hash.data, username: json.username});
	})
	.catch(rej =>
	{
		console.log("Reject Status: " + rej);
	});
}

consumer.on("message",function(mess)
{
	console.log(mess);
	var json = JSON.parse(mess.value);
	var payload;

	switch (json.signal)
	{
		case 'register':
			Register(json);
	}

});

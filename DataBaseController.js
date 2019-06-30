import kafka from 'kafka-node';

Producer = kafka.Producer;
client = new kafka.KafkaClient();
producer = new Producer(client);
const amqplib = require('amqplib');
const redis = require('redis');

function makeConfig(penv = process.env) {
  return {
    amqp: {
      url: penv.AMQP_URL || 'amqp://127.0.0.1:5672',
      queueName: penv.AMQP_QUEUE_NAME || 'tasks',
    },
    redis: {
      url: penv.REDIS_URL || 'redis://127.0.0.1:6379',
      topic: penv.REDIS_TOPIC_NAME || 'tasks-completed', // publish, broadcast to all listeners!!
    },
  };
}

async function prepareQueueChannel(logger, { url, queueName = 'tasks' }, consumerFunction = null) {
  logger.info('connecting to amqp...');
  const conn = await amqplib.connect(url);
  logger.info('connecting to amqp... done!');

  logger.info('creating amqp channel...');
  const channel = await conn.createChannel();
  logger.info('creating amqp channel... done!');

  logger.info('asserting amqp queue...', queueName);
  await channel.assertQueue(queueName);
  logger.info('asserting amqp queue...', queueName, 'done!');

  // publish message on API side

  if (consumerFunction) { // subscribe to queue on Worker side
    // start consuming messages from the queue
    logger.info(' - consuming messages on amqp queue...', queueName);
    channel.consume(queueName, consumerFunction);
    logger.info(' - consuming messages on amqp queue...', queueName, 'done!');
  }

  return channel;
}

async function prepareRedisClient(logger, { url, topic = 'tasks-completed' }, handleTopicMessage = null) {
  logger.info('connecting to redis...');
  const client = redis.createClient(url);
  
  await client.connect();
  logger.info('connecting to redis... done!');

  // publish message from Worker to API

  if (handleTopicMessage) { // subscribe to topic on API side
    logger.info(' - subscribing to redis topic...', topic);
    await redisClient.subscribe(topic, handleTopicMessage);
    logger.info(' - subscribing to redis topic...', topic, ', done!');
  }

  return client;
}

module.exports = { makeConfig, prepareQueueChannel, prepareRedisClient };

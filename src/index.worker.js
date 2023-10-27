require('dotenv').config(); // side-effect process.env - loads env vars from .env file
const { prepareRedisClient, makeConfig, prepareQueueChannel } = require('./shared');


main();

async function main() {
  const config = makeConfig(process.env);
  const logger = console;

  const redisClient = await prepareRedisClient(logger, config.redis);

  let queueChannel = null;

  async function workOnMessage(msg) {
    logger.info('new message', msg);
    const jsonStr = msg.content.toString(); // convert buffer to string
    const message = JSON.parse(jsonStr); // convert string to object

    logger.info('message parsed', message);
    //const { input, meta } = message;

    // TODO: work on input; e.g. save it in the database

    message.meta.status = 'completed';
    message.meta.tsCompletedAt = new Date();
    logger.info('message completed', message);

    queueChannel.ack(msg); // use nack()

    // inform user via redis pub/sub
    await redisClient.publish(config.redis.topic, JSON.stringify(message)); // accepts string
  }

  queueChannel = await prepareQueueChannel(logger, config.amqp, workOnMessage);
  logger.info('queueChannel prepared, ready to work on messages...');
}

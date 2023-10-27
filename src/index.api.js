require('dotenv').config(); // side-effect process.env - loads env vars from .env file
const { randomUUID } = require('crypto');
const express = require('express');
const { makeConfig, prepareRedisClient, prepareQueueChannel } = require('./shared');

main();

async function main() {
  const config = makeConfig(process.env);
  const logger = console;

  let redisClient = null, queueChannel = null;

  async function handleTasksCompleted(msg) {
    logger.log('new message handleTasksCompleted', msg);

    // TODO: inform user via WebSockets
  }

  redisClient = await prepareRedisClient(logger, config.redis, handleTasksCompleted);

  queueChannel = await prepareQueueChannel(logger, config.amqp);

  async function handleHttpWorkRequest(req, res) {
    const input = req.body;

    // prepare a message to send to queue
    const message = {
      input,
      meta: {
        id: randomUUID(),
        ts: new Date(),
      },
    };

    // inform user with a reference to the job
    res.json({ data: message }); // inform user immediately!

    // inform workers via AMQP in the background
    // Note: buffer is a binary representation of the message
    queueChannel.sendToQueue(config.amqp.queueName, Buffer.from(JSON.stringify(message)))
      .then(() => {
        logger.info('message sent to queue', { q: config.amqp.queueName, message });
      }).catch(err => {
        logger.error('message not sent to queue', { q: config.amqp.queueName, message, err });
      });
  }

  const app = express();

  app.use(express.json()); // enable automatic parsing of json request bodies

  app.use('/api/work', handleHttpWorkRequest);

  app.listen(config.http.port, () => {
    console.info(`HTTP server listening on port ${config.http.port}`);
  });
}

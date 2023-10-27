# demo-http-amqp-pub-sub-ws

Demo for components using HTTP, AMQP, Pub/Sub, WebSockets

## requirements

* Node v18.x
* RabbitMQ
* Redis

MacOS:

```sh
brew install rabbitmq
brew install redis
brew services start rabbitmq
brew services start redis
```

Via Docker

```sh
docker run --rm -it -p 15672:15672 -p 5672:5672 rabbitmq:3-management
```

RabbitMQ admin web UI: http://localhost:15672/

## installation

```sh
npm i
```

## configuration

```sh
cp .env_sample.env .env
# edit .env file
```


## execution

```sh
# terminal 1 for HTTP API
npm run start:api

# terminal 2 for queue worker
npm run start:worker
```

## usage

```sh
curl --location 'http://localhost:8080/api/work' \
--header 'Content-Type: application/json' \
--data '{"imeiList": [ "123456789012345", "123456789012346" ]}'
```

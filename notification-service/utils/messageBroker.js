const amqplib = require('amqplib');
/*
*-----------------------------Events Section------------------------
*/
const getDataByDelay = (n) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { name: "user one", age: 23, data: { village: "delhi", pin: 1234 } },
                { name: "user two", age: 13, data: { village: "noida", pin: 9876 } },
            ])
        }, 3000)
    });
}

/*-----------------*/
module.exports.publishMessage = async (chnl, queue, message) => {
    try {
        await chnl.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    } catch (err) {
        console.log(err);
        throw err;
    }
};

/*-----------------*/
module.exports.initRabbitMq = async () => {
    try {
        const msgBrokerconn = await amqplib.connect(process.env.MSG_BROKER_URL);
        const msgBrokerChannel = await msgBrokerconn.createChannel();
        await msgBrokerChannel.assertQueue('sendNotificationOnSignUp', { durable: false });

        msgBrokerChannel.consume('sendNotificationOnSignUp', (event) => {
            console.log('---- received data sendNotificationOnSignUp ----');
            console.log(JSON.parse(event.content.toString()));
            // sendNotificationMethod(JSON.parse(event.content.toString()));
        }, {
            noAck: true,
        });

        /*-----RPC Consumer------*/
        const queueName = "RPC_QUEUE_ONE";
        await msgBrokerChannel.assertQueue(queueName, { durable: false });
        msgBrokerChannel.prefetch(1);
        console.log(' [x] Awaiting RPC requests..');
        msgBrokerChannel.consume(queueName, async (msg) => {
            const n = parseInt(msg.content.toString());
            const dataRes = await getDataByDelay(n);
            console.log("inside notification consume, sending rpc data to consumer...", n);
            msgBrokerChannel.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify(dataRes)), {
                correlationId: msg.properties.correlationId
            });
            msgBrokerChannel.ack(msg);
        }, { noAck: false })

        return msgBrokerChannel;
    } catch (err) {
        console.log(err);
        throw err;
    }
};

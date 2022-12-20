const amqplib = require('amqplib');
/*
*-----------------------------Events Section------------------------
*/

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

        return msgBrokerChannel;
    } catch (err) {
        console.log(err);
        throw err;
    }
};

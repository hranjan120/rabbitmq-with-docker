const crypto = require("crypto");
const { publishMessage } = require('../utils/messageBroker');

/*
*-----------------------------Routes Section------------------------
*/

exports.userSignup = async (req, res) => {
    try {
        if (!req.body.email || req.body.email === '') {
            return res.status(400).json({ statusCode: 'FAIL', statusValue: 400, message: 'Provide valid Email' });
        }

        if (!req.body.name || req.body.name === '') {
            return res.status(400).json({ statusCode: 'FAIL', statusValue: 400, message: 'Provide valid Name' });
        }
        const addedUser = {
            name: req.body.name,
            email: req.body.email,
        };
        await publishMessage(req.mqChannel, 'sendNotificationOnSignUp', addedUser);

        return res.status(200).json({ statusCode: 'OK', statusValue: 200, message: 'User added successfully' });
    } catch (err) {
        return res.status(500).json({ statusCode: 'ERROR', statusValue: 500, message: 'Unable to Process your request' });
    }
};

/********************* */
exports.rpcRequest = async (req, res) => {
    try {
        let userData = [];
        const num = 12;
        const queueName = "RPC_QUEUE_ONE";
        const uniqId = crypto.randomUUID();
        const q = await req.mqChannel.assertQueue('', { exclusive: true });
        console.log(' [x] Requesting RPC Data(%d)', num);
        req.mqChannel.sendToQueue(queueName, Buffer.from(num.toString()), {
            replyTo: q.queue,
            correlationId: uniqId
        });
        req.mqChannel.consume(q.queue, msg => {
            if (msg.properties.correlationId == uniqId) {
                console.log('User Data fetched');
                userData = JSON.parse(msg.content.toString())
                console.log(JSON.parse(msg.content.toString()));
                return res.status(200).json({
                    statusCode: 'OK', statusValue: 200, message: 'Data fetched by RPC call', payload: { userData }
                });
            }
        }, { noAck: true });
        // return res.status(200).json({
        //     statusCode: 'OK', statusValue: 200, message: 'Data fetched by RPC call', payload: {
        //         userData
        //     }
        // });
    } catch (err) {
        return res.status(500).json({ statusCode: 'ERROR', statusValue: 500, message: 'Unable to Process your request' });
    }
};
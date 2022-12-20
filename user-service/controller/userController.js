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

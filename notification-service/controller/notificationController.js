/*
*-----------------------------Routes Section------------------------
*/

exports.sendNotification = async (req, res) => {
    try {
        return res.status(200).json({ statusCode: 'OK', statusValue: 200, message: 'Notification route called successfully' });
    } catch (err) {
        return res.status(500).json({ statusCode: 'ERROR', statusValue: 500, message: 'Unable to Process your request' });
    }
};

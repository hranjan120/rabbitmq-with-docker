require('dotenv').config();
const express = require('express');

const { initRabbitMq } = require('./utils/messageBroker');
/*
*-------------------------Include routes----------------------
*/
const userRoutes = require('./routes/userRoutes');

/*
*---------------------Middleware section-------------------
*/
const app = express();
app.enable('trust proxy');
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Request-With, Content-Type, Accept, Authorization');
    next();
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
/** *****************************************************************
*------------------------------Init Rabbitmq------------------------
******************************************************************* */
let msgBrokerChannel = null;
(async () => {
    try {
        msgBrokerChannel = await initRabbitMq();
    } catch (err) {
        console.log(err);
    }
})();

/** *******************************************************************
*-------------------------Use Routes middleware----------------------
********************************************************************* */
app.get('/', async (req, res) => {
    try {
        res.status(200).json({
            statusCode: 'OK', statusValue: 200, message: 'Message from User Service', payload: { env: process.env.NODE_ENV },
        });
    } catch (err) {
        res.status(500).json({ statusCode: 'ERROR', statusValue: 500, messages: 'Unable to complete your request' });
    }
});

/*------------------------------------------*/
app.use('/user', (req, res, next) => {
    req.mqChannel = msgBrokerChannel;
    next();
}, userRoutes);

/*--------------------------------------------*/
app.get('*', async (req, res) => {
    const ip = req.headers['x-forwarded-for'];
    res.status(404).json({
        statusCode: 'FAIL', statusValue: 404, message: 'Requested url is not available..', ipAddress: ip,
    });
});

/*
*----------------------------------------------------------------------------
*/
const port = process.env.PORT || 8002;
app.listen(port, () => {
    console.log(`User Service started on port ${port}`);
    console.log(`App is on: ${app.get('env')} Mode`);
});

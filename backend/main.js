// Step 1: install the needed libraries and modules
const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const cors = require('cors');
const secureEnv = require('secure-env');

// Step 2: configure the port to listen to
const PORT = parseInt(process.argv[2]) || parseInt(process.env.PORT) || 3000;

// create an instance of the express server
const app = express();

// if you are using the secure-env module
global.env = secureEnv({ secret: process.env.ENV_SECRET || 'THISISASECRET' });
const APP_PORT = global.env.APP_PORT;

const COMMON_NAMESPACE = '/api';

// SQL queries
const SQL_QUERY_OBTAIN_RSVPS = 'select * from rsvp;';
const SQL_QUERY_INSERT_RSVP = "insert into rsvp (name, email, phone, status, createdBy, createdDt) values (?,?,?,?,?,CURDATE());";

// Step 3: create DB connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME || 'birthday',
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 4,
    timezone: '+08:00'
});

// Step 4: have a function that ensures a smooth server startup.. or exit gracefully
const startApp = async (newApp, newPool) => {
    try {
        const conn = await newPool.getConnection();
        console.info('We are pinging the database..');

        await conn.ping();

        // release connection after confirming that connection can be established
        conn.release();

        // start the express server
        newApp.listen(PORT, () => {
            console.info(`Server started at port ${PORT} on ${new Date()}`);
        });
    } catch (e) {
        console.error('=> Error occurred while establishing connection to DB: ', e);
    }
};

// Step 5: using closure, create the SQL queries so that the program flow is more smooth
const makeQuery = (sql, pool) => {
    console.log('=> Creating query:', sql);
    return (async (args) => {
        const conn = await pool.getConnection();
        try {
            let results = await conn.query(sql, args) || [];
            return results[0];
        } catch (e) {
            console.error(err);
        } finally {
            conn.release();
        }
    });
}

const findAllRsvp = makeQuery(SQL_QUERY_OBTAIN_RSVPS, pool);
const saveOneRsvp = makeQuery(SQL_QUERY_INSERT_RSVP, pool);

// Step 6: define the middleware and necessary routes
app.use(cors());
// app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
// app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.json());

app.get(`${COMMON_NAMESPACE}/rsvps`, (req, res, next) => {
    console.info('=> Get all rsvp');
    findAllRsvp([]).then(result => { // an empty array is given for the argument to the function as the SQL statement has 0 bindings
        res.status(200).contentType('application/json');
        res.json(result);
    }).catch(e => {
        res.status(500).contentType('application/json');
        res.json(e);
    });
});

app.post(`${COMMON_NAMESPACE}/rsvp`, (req, res, next) => {
    // console.info("-> req: ", req);
    const bodyValue = req.body;
    console.info('=> Insert an rsvp', JSON.stringify(bodyValue));
    saveOneRsvp([bodyValue.name, bodyValue.email, bodyValue.phone, bodyValue.status, bodyValue['createdBy'] || 1]).then(result => {
        res.status(200).contentType('application/json');
        res.json(result);
    }).catch(e => {
        res.status(500).contentType('application/json');
        res.json(e);
    });
});

// Step 7: Start the server program
startApp(app, pool);

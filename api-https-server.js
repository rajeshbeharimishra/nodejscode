const fs = require('fs');
const https = require('https');
const express = require('express');
const app = express();

// Load the self-signed certificate and key
const options = {
    key: fs.readFileSync('./privkey.pem'),
    cert: fs.readFileSync('./cert.pem')
};

// Middleware to parse JSON request bodies
app.use(express.json());

// Import API modules
const api1 = require('./interestcalculation');
const api2 = require('./temperatureconversion');

// Use the APIs
app.use('/service1', api1);
app.use('/service2', api2);

// Default route
app.get('/', (req, res) => {
    res.send('Welcome to the API Gateway');
});

// Create an HTTPS server using the self-signed certificate
https.createServer(options, app).listen(443, () => {
    console.log('HTTPS Server running on port 443');
});
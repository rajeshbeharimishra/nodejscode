const express = require('express');
const app = express();

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

// Start the server on a single port
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

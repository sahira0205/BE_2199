const express = require('express');
const fs = require('fs');
const app = express();

// Middleware to log request details to a file
app.use((req, res, next) => {
    // Capture request details
    const logDetails = {
        timestamp: new Date().toISOString(),
        ip: req.ip,
        url: req.originalUrl,
        protocol: req.protocol,
        method: req.method,
        hostname: req.hostname,
    };

    // Write log to a file as a JSON object on a new line
    fs.appendFile('requests.log', JSON.stringify(logDetails) + '\n', (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
        }
    });

    console.log(`${req.method} request for ${req.url}`);
    console.log(`Request IP: ${req.ip}`);
    next(); // Pass control to the next middleware
});

// Routes
app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/about', (req, res) => {
    res.send('About Us');
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
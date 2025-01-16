// Import required modules
const express = require('express');
const fs = require('fs');
const path = require('path');

// Initialize the app
const app = express();
const port = 2000;

// Middleware to parse JSON request bodies
app.use(express.json());

// POST API to append data to a text file
app.post('/sensor-data', (req, res) => {
    const headers = req.headers; // Get request headers
    const queryParams = req.query; // Get query parameters
    const Params = req.params; // Get query parameters
    const body = req.body; // Get request body
    const date = new Date().toISOString(); // Current date and time in ISO format

    // Create formatted log entry
    const logEntry = `
  Date: ${date}
  Headers: ${JSON.stringify(headers, null, 2)}
  Params: ${JSON.stringify(Params, null, 2)}
  Query Params: ${JSON.stringify(queryParams, null, 2)}
  Body: ${JSON.stringify(body, null, 2)}
  ----------------------------
  `;
    console.log(logEntry)
    const filePath = path.join(__dirname, 'requests.log'); // Path to the log file

    // Append log entry to the file
    fs.appendFile(filePath, logEntry, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        res.status(200).json({ message: 'Data logged successfully!' });
    });
});
app.get('/', (req, res) => {
    res.send(true)
})
app.get('/logs', (req, res) => {
    const filePath = path.join(__dirname, 'requests.log'); // Path to the log file

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // File not found
                return res.status(404).json({ message: 'Log file not found' });
            }
            console.error('Error reading file:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        res.status(200).send(`<pre>${data}</pre>`); // Send the file content in a readable format
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

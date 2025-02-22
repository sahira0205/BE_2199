const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set view engine as EJS
app.set("view engine", "ejs");

// Route to render the form
app.get("/", (req, res) => {
    res.render("index");
});

// Handle GET Request
app.get("/g25", (req, res) => {
    console.log("GET Request Data:", req.query);
    res.send(`Received GET Request: ${JSON.stringify(req.query)}`);
});

// Handle POST Request and save data
app.post("/g25", (req, res) => {
    console.log("POST Request Data:", req.body);

    // Read existing data
    fs.readFile("data.json", "utf8", (err, data) => {
        let jsonData = [];
        if (!err && data) {
            jsonData = JSON.parse(data);
        }

        // Append new form data
        jsonData.push(req.body);

        // Write to JSON file
        fs.writeFile("data.json", JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                console.error("Error writing to file", err);
                res.status(500).send("Error saving data.");
            } else {
                res.send("Data saved successfully.");
            }
        });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
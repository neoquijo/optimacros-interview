"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path = require("path");
const app = express();
// Serve static files from the current directory
app.use(express.static(path.join(__dirname, '../', 'public')));
// Define a route to serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'src/', 'index.html'));
});
app.listen(8080, () => console.log('started'));

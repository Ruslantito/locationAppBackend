// create application
const express = require("express");
app = express();

app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies
app.listen(5000, () => console.log("Application are listening on port 5000"));

module.exports = app;

// create application
const express = require("express");
app = express();
const port = process.env.PORT || 5000;

app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies
app.listen(port, () => console.log(`Application are listening on port ${port}!`));

module.exports = app;

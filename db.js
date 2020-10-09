const mysql = require("mysql");
const util = require("util");

// connect to db
const db = mysql.createConnection({
  host: "10.155.0.70",
  user: "ilmhona",
  password: "android1",
  database: "routes_bm"
});

db.connect();
db.query = util.promisify(db.query);

module.exports = db;

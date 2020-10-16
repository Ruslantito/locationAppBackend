const db = require("./db.js");
const app = require("./app.js");
RouteFinder = require("./route_finder.js");
routeFinder = new RouteFinder();

app.get(["/", "/routes"], async (req, res) => {
  try {
    res.send({
      response: await db.query(`SELECT * FROM routes`)
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

app.get(["/stops"], async (req, res) => {
  try {
    res.send({
      response: await db.query(`SELECT * FROM stops`)
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

app.get(["/stops/:route_id"], async (req, res) => {
  const route_id = req.params.route_id;
  try {
    res.send({
      response: await db.query(`SELECT s.* FROM stops AS s
        JOIN routes_stops AS rs ON rs.stop_id = s.id
        WHERE route_id = ` + route_id)
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

app.get(["/routeDirectory/:from/:to"], async (req, res) => {
  const fromStop = req.params.from;
  const toStop = req.params.to;
  try {
    res.send({
      response: await db.query('SELECT * FROM routes WHERE id IN (SELECT route_id FROM routes_stops WHERE stop_id IN (SELECT id FROM stops WHERE name = "' + fromStop + '" OR name = "' + toStop + '") ORDER BY route_id)')
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});





//<== LoadFromTo
app.get(["/findRoute/:from/:to"], async (req, res) => {
  results = routeFinder.findRoute(req.params.from, req.params.to);
  res.send(results);
});
app.get(["/route/:route_name"], async (req, res) => {
  const route_name = req.params.route_name;
  try {
    res.send({
      response: await db.query('SELECT id FROM routes WHERE name = "' + route_name + '"')
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});
//==>





//<== not used
app.get(["/nearStop/:x/:y"], async (req, res) => {
  db.query('SELECT name, SQRT(POW(coord_x - ' + req.params.x + ', 2) + POW(coord_y - ' + req.params.y + ', 2)) as distance FROM stops ORDER BY distance LIMIT 1', function (dbError, dbResponse) {
    res.send(dbResponse[0].name);
  });
});
//==>







//<== new scripts
app.get(["/addStop/:stop_name/:stop_coordX/:stop_coordY"], async (req, res) => {
  const stop_name = req.params.stop_name;
  const stop_coordX = req.params.stop_coordX;
  const stop_coordY = req.params.stop_coordY;
  try {
    res.send({
      response: await db.query(`INSERT INTO stops(name,coord_x,coord_y) VALUES("` + stop_name + `",` + stop_coordX + `,` + stop_coordY + `)`)
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

app.get(["/addRoute/:route_name/:transportTypeId"], async (req, res) => {
  const route_name = req.params.route_name;
  const transportTypeId = req.params.transportTypeId;
  const Url = `INSERT INTO routes(name,transport_type_id) VALUES("` + route_name + `",` + transportTypeId + `)`;
  try {
    res.send({
      response: await db.query(Url)
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

app.get(["/addTransportType/:transportType_name"], async (req, res) => {
  const transportType_name = req.params.transportType_name;
  try {
    res.send({
      response: await db.query(`INSERT INTO transport_types(name) VALUES("` + transportType_name + `")`)
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

app.get(["/addRouteStop/:route_id/:stop_id"], async (req, res) => {
  const route_id = req.params.route_id;
  const stop_id = req.params.stop_id;
  try {
    res.send({
      response: await db.query(`INSERT INTO routes_stops(route_id,stop_id) VALUES("` + route_id + `",` + stop_id + `)`)
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

app.get(["/updateStop/:stop_id/:stop_name/:stop_coordX/:stop_coordY"], async (req, res) => {
  const stop_id = req.params.stop_id;
  const stop_name = req.params.stop_name;
  const stop_coordX = req.params.stop_coordX;
  const stop_coordY = req.params.stop_coordY;
  try {
    res.send({
      response: await db.query(`UPDATE stops SET name = "` + stop_name + `", coord_x = ` + stop_coordX + `, coord_y = ` + stop_coordY + ` WHERE id = ` + stop_id)
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

app.get(["/updateRoute/:route_id/:route_name/:transportTypeId"], async (req, res) => {
  const route_id = req.params.route_id;
  const route_name = req.params.route_name;
  const transportTypeId = req.params.transportTypeId;
  try {
    res.send({
      response: await db.query(`UPDATE routes SET name = "` + route_name + `", transport_type_id = ` + transportTypeId + ` WHERE id = ` + route_id)
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

app.get(["/updateTransportType/:transportType_id/:transportType_name"], async (req, res) => {
  const transportType_id = req.params.transportType_id;
  const transportType_name = req.params.transportType_name;
  try {
    res.send({
      response: await db.query(`UPDATE transport_types SET name = "` + transportType_name + `" WHERE id = ` + transportType_id)
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});


app.get(["/deleteStop/:record_id"], async (req, res) => {
  const record_id = req.params.record_id;
  try {
    res.send({
      response: await db.query(`DELETE FROM stops WHERE id = ` + record_id)
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

app.get(["/deleteRoute/:record_id"], async (req, res) => {
  const record_id = req.params.record_id;
  try {
    res.send({
      response: await db.query(`DELETE FROM routes WHERE id = ` + record_id)
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

app.get(["/deleteTransportType/:record_id"], async (req, res) => {
  const record_id = req.params.record_id;
  try {
    res.send({
      response: await db.query(`DELETE FROM transport_types WHERE id = ` + record_id)
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

app.get(["/deleteRouteStop/:route_id/:stop_id"], async (req, res) => {
  const route_id = req.params.route_id;
  const stop_id = req.params.stop_id;
  try {
    res.send({
      response: await db.query(`DELETE FROM routes_stops WHERE route_id = ` + route_id + ` and stop_id = ` + stop_id)
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

app.get(["/transportTypes"], async (req, res) => {
  try {
    res.send({
      response: await db.query(`SELECT * FROM transport_types`)
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});


//==  Mapathon SCRIPTS == START ==
app.get(["/teams"], async (req, res) => {
  try {
    res.send({
      response: await db.query(`SELECT * FROM teams`)
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});


app.get(["/addStopNew/:stop_name/:stop_coordX/:stop_coordY/:teamId"], async (req, res) => {
  const stop_name = req.params.stop_name;
  const stop_coordX = req.params.stop_coordX;
  const stop_coordY = req.params.stop_coordY;
  const teamId = req.params.teamId;
  try {
    res.send({
      response: await db.query(`INSERT INTO stops(name,coord_x,coord_y,teamId) VALUES("` + stop_name + `",` + stop_coordX + `,` + stop_coordY + `,` + teamId + `)`)
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});



app.get(["/logs/:teamId"], async (req, res) => {
  const teamId = req.params.teamId;
  try {
    res.send({    
      response: await db.query('SELECT * FROM stops WHERE teamId = ' + teamId )
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});


app.get(["/routesNew/:teamId_hasAccess"], async (req, res) => {
  const teamId_hasAccess = req.params.teamId_hasAccess;
  try {
    res.send({
      response: await db.query('SELECT * FROM routes WHERE teamId_hasAccess = ' + teamId_hasAccess)
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

//==  Mapathon SCRIPTS == FINISH ==

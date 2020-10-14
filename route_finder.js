class routeFinder {
  constructor() {
    routeFinder.routes = new Map();
    routeFinder.pointA = '';
    routeFinder.pointB = '';
    routeFinder.passed = [];
    routeFinder.test = 'test';

    routeFinder.searchPointB = function(route, name, result) {
      //console.log('Searching in ' + name);
      routeFinder.passed.push(name);
      route.forEach(function(point) {
        if (point == routeFinder.pointB) {
          result.push(name);
        } else {
          routeFinder.routes.forEach(function(route2, name2) {
            if (route2.includes(point) && !routeFinder.passed.includes(name2)) {
              var tempResult = result;
              tempResult.push(name);
              var result2 = routeFinder.searchPointB(route2, name2, tempResult, name2);
              if (result2 != tempResult) {
                result.push(result2);
              }
            }
          });
        }
      });
      return result;
    };

    routeFinder.routes = new Map();
    const db = require("./db.js");
    db.query('SELECT * FROM routes', function(dbError, dbResponse) {
      dbResponse.forEach(function(route) {
        let stops = [];
        db.query('SELECT name FROM routes_stops, stops WHERE stops.id = routes_stops.stop_id AND route_id = ' + route.id, function(dbError2, dbReponse2) {
          dbReponse2.forEach(function(stop) {
            stops.push(stop.name);
          });
          routeFinder.routes.set(route.name, stops);
          //console.log(route.name, stops);
        });
      });
    });  
  }
  
  getResult() {
    return routeFinder.results2;
  }
  
  getPoints(coordX1, coordY1, coordX2, coordY2) {
    const db = require("./db.js");
    db.query('SELECT name, SQRT(POW(coord_x - ' + coordX1 + ', 2) + POW(coord_y - '  + coordY1 + ', 2)) as distance FROM stops ORDER BY distance LIMIT 1', function(dbError, dbResponse) {
      routeFinder.pointA = dbResponse[0].name;      
      //console.log(routeFinder.pointA);
    });

    db.query('SELECT name, SQRT(POW(coord_x - ' + coordX2 + ', 2) + POW(coord_y - '  + coordY2 + ', 2)) as distance FROM stops ORDER BY distance LIMIT 1', function(dbError, dbResponse) {
      routeFinder.pointB = dbResponse[0].name;      
      //console.log(routeFinder.pointB);
    });
  }


  findRoute (from, to) {
    routeFinder.pointA = from;
    routeFinder.pointB = to;
    let results = [];
    routeFinder.routes.forEach(function(route, name) {
      if (route.includes(routeFinder.pointA)) {
        var result = routeFinder.searchPointB(route, name, [name]);
        if (result != '') {
          results.push(result);
        }
      }
    });

    let results2 = [];
    results.forEach(function(result) {
      results2 = [...new Set(result)];
    });

    return results2;
  }


}

module.exports = routeFinder;
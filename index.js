var express = require('express');
var fs = require('fs');
var SportsStream = require('sport-streams');
var server = require('./lib/server.js');
var app = module.exports = express();

var credsFile = "creds.dat";


fs.readFile(credsFile, 'utf8', function (err,password) {
	if (err) {
	  console.log("Error - no " + credsFile + ". Stopping server");
	  return;

	} else {	  
	  app.use(function(req, res, next) {
	     var auth;
	     if (req.headers.authorization) {
	        auth = new Buffer(req.headers.authorization.substring(6), 'base64').toString().split(':');
	      }
	      if (!auth || auth[0] !== 'admin' || auth[1] !== password.trim()) {
	          res.statusCode = 401;
	          res.setHeader('WWW-Authenticate', 'Basic realm="MyRealmName"');
	          res.end('Unauthorized - Go fuck yourself.');
	      } else {
	          next();
	      }
	  });
	}

	//Modules.
	var sport = new SportsStream(app);
	var betTracker = new server(app);	
	
	app.listen(9000);

});






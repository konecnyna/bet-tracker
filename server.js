var express = require('express');
var games = require('./games.js');
var predictions = require('./predictions.js');
var streams = require('./streams.js');
var rss = require('./football_rss.js');


var app = express();
var fs = require('fs');
var path = require('path');
var PICKS_FILE_NAME = "picks.json";
var jsonfile = require('jsonfile');
var serverPort = 9000;

//Shared.
var credsFile = '/home/pi/Github/rpi_ac_outlet_control/web/creds.dat';

if(false){   
   credsFile = 'creds.dat';   
}

app.get('/api/v1/scores', function(req, res) {    
 	games.getUIData(function(callback){
      res.json(callback);
   	});
});

app.get('/api/v1/picks', function(req, res) {
	var prettyJson = JSON.stringify(jsonfile.readFileSync(PICKS_FILE_NAME), null, 4);
	res.json(prettyJson);	
});

app.get('/api/v1/streams', function(req, res) {
	streams.getStreams(function(callback){
		res.json(callback);
	}, req.query.type);
});
app.get('/streams', function(req, res) {
	res.redirect('/streams.html');
});

app.get('/api/v1/predictions', function(req, res) {
 predictions.getScores(function(callback){
      res.json(callback);
   });
});

app.get('/api/v1/banking', function(req, res) {	
	var prettyBalance = JSON.stringify(jsonfile.readFileSync("result.json")	);
	res.json(JSON.parse(prettyBalance));		 
});

app.get('/api/v1/update_picks', function(req, res) {
	try{
		messageObject = JSON.parse(req.query.picks);
		jsonfile.writeFile(PICKS_FILE_NAME, messageObject, function (err) {
			if(err){
				console.error("error: " + err);
				res.send("got error");	
			}else{
				res.send("good");	
			}				
		});

	}catch(e){		
		console.log("Bad json: " + e);
		res.send("fail!");
	}
});


app.get('/api/v1/rss', function(req, res) {
	rss.getFootballRss( function(xml){
		res.set('Content-Type', 'text/xml');
		res.send(xml);	
	});

});


// Authenticator
fs.readFile(credsFile, 'utf8', function (err,password) {
	if (err) {
	  console.log("Error - no creds.dat file so no auth!");
	} else {
	  console.log("asking for auth!");
	  app.use(function(req, res, next) {
	     var auth;
	     if (req.headers.authorization) {
	        auth = new Buffer(req.headers.authorization.substring(6), 'base64').toString().split(':');
	      }
	      if (!auth || auth[0] !== 'admin' || auth[1] !== password.trim()) {
	          res.statusCode = 401;
	          res.setHeader('WWW-Authenticate', 'Basic realm="MyRealmName"');
	          res.end('Unauthorized');
	      } else {
	          next();
	      }
	  });
	}
	app.use('/', express.static(path.join(__dirname, 'public')));
  	app.listen(serverPort);

});



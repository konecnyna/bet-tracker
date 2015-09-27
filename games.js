var utils = require('./utils.js');
var util = require('util');
var SCORE_URL = "http://www.nfl.com/liveupdate/scorestrip/ss.xml";
var PICKS_FILE_NAME = "picks.json";
var jsonfile = require('jsonfile');
var parseString = require('xml2js').parseString;


var COLOR_LOSING = "#FF5722";
//var COLOR_WINNING = "#00C853";

var COLOR_WINNING = "#FFF";
var ICON_URL = "http://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/scoreboard/%s.png&h=200";	


module.exports = {  
  getUIData: function (callback){
  	getUIData(callback);
  }
};

function getUIData(callback) {
	var picks = jsonfile.readFileSync(PICKS_FILE_NAME);
	if(picks){
		utils.downloadFile(SCORE_URL, function(xml){
			//convert to JSON.
			parseString(xml, function (err, result) {
			    var games = result.ss.gms[0].g;
			    callback(getRelevantTeams(games, picks));
			});				
		});	
	}	
}


function getRelevantTeams(data, picks){
	games = [];
	for(var i=0; i<data.length; i++){
		var currentGame = data[i].$;

		if( picks[currentGame.vnn.toLowerCase()] || picks[currentGame.hnn.toLowerCase()]){
			games.push(currentGame);
		}
	}

	addSpreadData(games, picks);
	
	return games;
}


function addSpreadData(games, picks){	
	console.log(picks);
	for(var i=0; i<games.length; i++){
		var currentGame = games[i];

		//Setup team vars.
		var betTeam = "";
		var betTeamScore = 0;
		var isBetTeamHome = false;
	
		var otherTeam = "";
		var otherTeamScore = 0;
		if(picks[currentGame.hnn.toLowerCase()]){
			betTeam = currentGame.hnn.toLowerCase();
			betTeamScore = currentGame.hs;
			
			isBetTeamHome = true;

			otherTeam = currentGame.vnn.toLowerCase();
			otherTeamScore = currentGame.vs;			
		}else{
			betTeam = currentGame.vnn.toLowerCase();
			betTeamScore = currentGame.vs;
			
			otherTeam = currentGame.hnn.toLowerCase();				
			otherTeamScore = currentGame.hs;
		}


		//Add extras
		var spread = parseInt(picks[betTeam].spread);
		

 		if(isBetTeamHome){
 			currentGame.hnn = currentGame.hnn + " ("+spread+")";
 		}else{
			currentGame.vnn = currentGame.vnn + " ("+spread+")";
 		}

		currentGame.bet_team = betTeam; 
		covering = (betTeamScore + spread) - otherTeamScore;
		currentGame.covering = covering;
		if(currentGame.q !== 'P'){
			if(covering > 0){
				currentGame.covering_text = "Covering!";
				currentGame.card_background = COLOR_WINNING;
			}else{
				currentGame.covering_text = "Losing!";
				currentGame.card_background = COLOR_LOSING;
			}
		}

		if(currentGame.k){
			currentGame.time_text = "Q"+currentGame.q + ": " + currentGame.k;
		}else{
			currentGame.covering_text = "Not in progress";
			currentGame.time_text = currentGame.d + " at " + currentGame.t;
		}
		
		currentGame.away_team_icon = util.format(ICON_URL, currentGame.v);          
     	currentGame.home_team_icon = util.format(ICON_URL, currentGame.h);
	}
}

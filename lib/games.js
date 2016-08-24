var utils = require('./utils.js');
var util = require('util');
var path = require('path');
var SCORE_URL = "http://www.nfl.com/liveupdate/scorestrip/ss.xml";

var jsonfile = require('jsonfile');
var parseString = require('xml2js').parseString;


var COLOR_LOSING = "#F44336";
var COLOR_WINNING = "#00C853";
var ICON_URL = "http://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/scoreboard/%s.png&h=200";	


module.exports = {  
  getUIData: function (callback, picks){
  	getUIData(callback, picks);
  }
};

function getUIData(callback, picks) {
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
	var allGames = [];
	for(var j=0; j<picks.length; j++){
		var games = [];
		var currentPicks = picks[j];
		
		for(var i=0; i<data.length; i++){
			var currentGame = JSON.parse(JSON.stringify(data[i].$));			
			if( currentPicks[currentGame.vnn.toLowerCase()] || currentPicks[currentGame.hnn.toLowerCase()]){
				games.push(currentGame);				
			}			
		}
		addSpreadData(games, currentPicks);
		allGames.push(games);
	}	
	return allGames;
}


function addSpreadData(games, picks){	
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
		covering = (parseInt(betTeamScore) + spread) - parseInt(otherTeamScore);
		currentGame.covering = covering;
		if(currentGame.q !== 'P'){
			if(covering > 0){
				currentGame.covering_text = (currentGame.q.match(/F/) ? "Covered" : "Covering!");
				currentGame.card_background = COLOR_WINNING;
			}else{
				currentGame.covering_text = (currentGame.q.match(/F/) ? "Lost" : "Losing!");
				currentGame.card_background = COLOR_LOSING;
				if(currentGame.q == "F"){
					currentGame.panel_class = "panel-lost";
				}
			}
		}

		if(currentGame.k){
			currentGame.time_text = "Q"+currentGame.q + ": " + currentGame.k;
		}else if(currentGame.q === "H"){
			currentGame.time_text = "Half time";			
		}else if(currentGame.q === "F" || currentGame.q === "FO"){
			currentGame.time_text = "Final";
		}else{
			currentGame.covering_text = "Not in progress";
			currentGame.time_text = currentGame.d + " at " + currentGame.t;
		}
		
		currentGame.away_team_icon = util.format(ICON_URL, (currentGame.v == 'WAS') ? 'wsh' : currentGame.v);          
     	currentGame.home_team_icon = util.format(ICON_URL, (currentGame.h == 'WAS') ? 'wsh' : currentGame.h);
	}
}

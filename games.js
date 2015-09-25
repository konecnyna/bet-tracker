var utils = require('./utils.js');
var util = require('util');
var SCORE_URL = "http://www.nfl.com/liveupdate/scorestrip/ss.json";
var PICKS_FILE_NAME = "picks.json";
var jsonfile = require('jsonfile');

var COLOR_LOSING = "#FF5722";
//var COLOR_WINNING = "#00C853";

var COLOR_WINNING = "#FFF";
var ICON_URL = "http://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/scoreboard/%s.png&h=100";	


module.exports = {  
  getUIData: function (callback){
  	getUIData(callback);
  }
};

function getUIData(callback) {
	var picks = jsonfile.readFileSync(PICKS_FILE_NAME);
	if(picks){
		utils.downloadFile(SCORE_URL, function(data){
			var games = JSON.parse(data);
			callback(getRelevantTeams(games.gms, picks));
		});	
	}	
}


function getRelevantTeams(data, picks){
	games = [];
	for(var i=0; i<data.length; i++){
		if( picks[data[i].vnn.toLowerCase()] || picks[data[i].hnn.toLowerCase()]){
			games.push(data[i]);
		}
	}

	addSpreadData(games, picks);
	
	return games;
}


function addSpreadData(games, picks){
	for(var i=0; i<games.length; i++){
		//Setup team vars.
		var betTeam = "";
		var betTeamScore = 0;
		var isBetTeamHome = false;
	
		var otherTeam = "";
		var otherTeamScore = 0;
		if(picks[games[i].hnn.toLowerCase()]){
			betTeam = games[i].hnn.toLowerCase();
			betTeamScore = games[i].hs;
			
			isBetTeamHome = true;

			otherTeam = games[i].vnn.toLowerCase();
			otherTeamScore = games[i].vs;			
		}else{
			betTeam = games[i].vnn.toLowerCase();
			betTeamScore = games[i].vs;
			
			otherTeam = games[i].hnn.toLowerCase();				
			otherTeamScore = games[i].hs;
		}


		//Add extras

		var spread = parseInt(picks[betTeam].spread);

 		if(isBetTeamHome){
 			games[i].hnn = games[i].hnn + " ("+spread+")";
 		}else{
			games[i].vnn = games[i].vnn + " ("+spread+")";
 		}

		games[i].bet_team = betTeam; 
		covering = (betTeamScore + spread) - otherTeamScore;
		games[i].covering = covering;
		if(games[i].q !== 'P'){
			if(covering > 0){
				games[i].covering_text = "Covering!";
				games[i].card_background = COLOR_WINNING;
			}else{
				games[i].covering_text = "Losing!";
				games[i].card_background = COLOR_LOSING;
			}
		}
		if(games[i].k){
			games[i].time_text = games[i].q + ": " + games[i].k;
		}else{
			games[i].time_text = "Not in progress";
		}
		

		games[i].away_team_icon = util.format(ICON_URL, games[i].h);          
     	games[i].home_team_icon = util.format(ICON_URL, games[i].v);
 		

	}
}

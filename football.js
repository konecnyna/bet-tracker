var utils = require('./utils.js');
var SCORE_URL = "http://www.nfl.com/liveupdate/scorestrip/ss.json";

var picks = {};
picks.texans = {spread : "4"};
picks.bears = {spread : "3"};
picks.browns = {spread : "-2"};
picks.rams = {spread : "4"};
picks.dolphins = {spread : "7"};
picks.packers = {spread : "4"};


module.exports = {
  getScores: function (callback) {
  	getScores(callback);
  }
};

function getScores(callback) {
	utils.downloadFile(SCORE_URL, function(data){
		var games = JSON.parse(data);
		callback(getRelevantTeams(games.gms));
		//callback(games);

	});
}

function getRelevantTeams(data){
	games = [];
	for(var i=0; i<data.length; i++){
		if( picks[data[i].vnn.toLowerCase()] || picks[data[i].hnn.toLowerCase()]){
			games.push(data[i]);
		}
	}

	addSpreadData(games);
	
	return games;
}


function addSpreadData(games){
	for(var i=0; i<games.length; i++){
		//Setup team vars.
		var betTeam = "";
		var betTeamScore = 0;
	
		var otherTeam = "";
		var otherTeamScore = 0;
		if(picks[games[i].hnn.toLowerCase()]){
			betTeam = games[i].hnn.toLowerCase();
			betTeamScore = games[i].hs;

			otherTeam = games[i].vnn.toLowerCase();
			otherTeamScore = games[i].vs;			
		}else{
			betTeam = games[i].vnn.toLowerCase();
			betTeamScore = games[i].vs;
			
			otherTeam = games[i].hnn.toLowerCase();				
			otherTeamScore = games[i].hs;
		}

		//Add extras
		if(games[i].q === 'P'){
			games[i].covering_text = "Not in progress";
		}else{
			games[i].bet_team = betTeam;
			covering = (betTeamScore + parseInt(picks[betTeam].spread)) - otherTeamScore;
			games[i].covering = covering;
			if(covering > 0){
				games[i].covering_text = "Covering!";
				games[i].card_background = "#00FF00";
			}else{
				games[i].covering_text = "Losing!";
				games[i].card_background = "#ff0000";
			}
		}		
	}
}

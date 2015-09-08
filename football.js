var utils = require('./utils.js');
var SCORE_URL = "http://www.nfl.com/liveupdate/scorestrip/ss.json";


var picks = [
	{
		team : "patriots",
		spread : "-7"
	},
	{
		team : "rams",
		spread : "4"
	}
];

module.exports = {
  getScores: function (callback) {
  	getScores(callback);
  }
};

function getScores(callback) {
	utils.downloadFile(SCORE_URL, function(data){
		var games = JSON.parse(data);
		callback(games);
	});
}



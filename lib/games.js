var utils = require("./utils.js");
var util = require("util");
var path = require("path");
const SCORE_URL = "http://feeds.nfl.com/feeds-rs/scores.json";

var jsonfile = require("jsonfile");

var COLOR_LOSING = "#F44336";
var COLOR_WINNING = "#00C853";
var ICON_URL =
  "http://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/scoreboard/%s.png&h=200";


const daysOfWeek = ['Sun', 'Mon', 'Tues', 'Weds', 'Thurs', 'Fri', 'Sat']
module.exports = {
  getUIData: function(callback, picks) {
    getUIData(callback, picks);
  }
};

function getUIData(callback, picks) {
  if (!picks) {
    return;
  }

  utils.downloadFile(SCORE_URL, function(body) {
    callback(getRelevantTeams(JSON.parse(body), picks));
  });
}

function getRelevantTeams(data, picks) {
  var allGames = [];
  for (var j = 0; j < picks.length; j++) {
    var games = [];
    var currentPicks = picks[j];

    for (var i = 0; i < data.gameScores.length; i++) {
      var currentGame = data.gameScores[i];
      currentGame = createLegacyObject(currentGame);
      
      if (
        currentPicks[currentGame.vnn.toLowerCase()] ||
        currentPicks[currentGame.hnn.toLowerCase()]
      ) {
        games.push(currentGame);
      }
    }
    addSpreadData(games, currentPicks);
    allGames.push(games);
  }
  return allGames;
}

function createLegacyObject(game) {
  return {
    d: game.gameSchedule.gameDate,
    t: game.gameSchedule.gameTimeEastern,
    q: game.score ? game.score.phase : "P",
    hnn: game.gameSchedule.homeNickname,
    hs: game.score ? game.score.homeTeamScore.pointTotal : "0",
    v: game.gameSchedule.visitorTeamAbbr,
    h: game.gameSchedule.homeTeamAbbr,
    vnn: game.gameSchedule.visitorNickname,
    vs: game.score ? game.score.visitorTeamScore.pointTotal : "0",
    rz: "0",
    ga: "",
    gt: game.gameSchedule.seasonType,
    k: game.score ? game.score.time : null,
    possessionTeamAbbr: game.score ? game.score.possessionTeamAbbr : null,
    down: game.score ? game.score.down : null,
    yardsToGo: game.score ? game.score.yardsToGo : null,
    yardline: game.score ? game.score.yardline : null,
  };
}

function addSpreadData(games, picks) {
  for (var i = 0; i < games.length; i++) {
    var currentGame = games[i];

    //Setup team vars.
    var betTeam = "";
    var betTeamScore = 0;
    var isBetTeamHome = false;

    var otherTeam = "";
    var otherTeamScore = 0;
    if (picks[currentGame.hnn.toLowerCase()]) {
      betTeam = currentGame.hnn.toLowerCase();
      betTeamScore = currentGame.hs;

      isBetTeamHome = true;

      otherTeam = currentGame.vnn.toLowerCase();
      otherTeamScore = currentGame.vs;
    } else {
      betTeam = currentGame.vnn.toLowerCase();
      betTeamScore = currentGame.vs;

      otherTeam = currentGame.hnn.toLowerCase();
      otherTeamScore = currentGame.hs;
    }

    //Add extras
    var spread = parseInt(picks[betTeam].spread);

    if (isBetTeamHome) {
      currentGame.hnn = currentGame.hnn + " (" + spread + ")";
      currentGame.homeSpread = spread;
    } else {
      currentGame.vnn = currentGame.vnn + " (" + spread + ")";
      currentGame.awaySpread = spread;
    }

    currentGame.bet_team = betTeam;
    covering = parseInt(betTeamScore) + spread - parseInt(otherTeamScore);
    currentGame.covering = covering;
    if (currentGame.q !== "PREGAME" && currentGame.q !== "P") {      
      if (covering > 0) {
        currentGame.covering_text = currentGame.q === "FINAL"
          ? "Covered"
          : `Covering by ${covering}!`;
        currentGame.card_background = COLOR_WINNING;
      } else {
        currentGame.covering_text = currentGame.q.includes("FINAL")
          ? "Lost"
          : `Losing by ${covering * -1}!`;
        currentGame.card_background = COLOR_LOSING;
        if (currentGame.q == "F") {
          currentGame.panel_class = "panel-lost";
        }
      }


    }

    if (currentGame.q !== "PREGAME" && currentGame.q !== "FINAL") {
      if (currentGame.possessionTeamAbbr) {
        const ball = ` 🏈`;
        const info = `${currentGame.down} down and ${currentGame.yardsToGo}. Ball on the ${currentGame.yardline}`;

        if (currentGame.possessionTeamAbbr === currentGame.v) {
          currentGame.vnn += ball;
          currentGame.vnn_info = info;
        } else {          
          currentGame.hnn += ball;
          currentGame.hnn_info = info;
        }
      }
    }


    if (currentGame.q === "HALFTIME") {
      currentGame.time_text = "Half time";
    } else if (currentGame.q.includes("FINAL")) {
      currentGame.time_text = "Final";
    } else if (currentGame.q[0] === "Q") {
      currentGame.time_text = `${currentGame.q} - ${currentGame.k}`;
    } else {
      currentGame.covering_text = "Not in progress";      
      const gameDate = new Date(currentGame.d);
      // gameDate.setTime(currentGame.t);
      const timeArray = currentGame.t.split(":");
      gameDate.setHours(timeArray[0], timeArray[1], timeArray[2]);

      currentGame.time_text =  `${daysOfWeek[gameDate.getDay()]} at ${gameDate.getHours() > 12 ? gameDate.getHours() - 12 : gameDate.getHours()}:${("0" + gameDate.getMinutes()).slice(-2)} ${gameDate.getHours() > 12 ? "PM" : "AM"}`;
    }

    currentGame.away_team_icon = util.format(
      ICON_URL,
      currentGame.v == "WAS" ? "wsh" : currentGame.v
    );
    currentGame.home_team_icon = util.format(
      ICON_URL,
      currentGame.h == "WAS" ? "wsh" : currentGame.h
    );
  }
}

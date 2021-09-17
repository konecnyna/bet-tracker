var utils = require("./utils.js");
var util = require("util");
const SCORE_URL = "http://home-remote-api.herokuapp.com/nfl/scores/new";

var COLOR_LOSING = "#F44336";
var COLOR_WINNING = "#00C853";
var ICON_URL = "http://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/scoreboard/%s.png&h=200";
const daysOfWeek = ['Sun', 'Mon', 'Tues', 'Weds', 'Thurs', 'Fri', 'Sat']
module.exports = {
  getUIData: function (callback, picks) {
    getUIData(callback, picks);
  }
};


function getUIData(callback, picks) {
  // utils.downloadFile(SCORE_URL, function (body) {
  //   console.log(body)
  //   const games = JSON.parse(body)
  //   const test = games.map(it => {
  //     return createLegacyObject(it)
  //   });
  //   callback([test])
  // });

  // return;


  utils.downloadFile(SCORE_URL, function (body) {
    const test = getRelevantTeams(JSON.parse(body), picks);
    callback(test);
  });
}

function getRelevantTeams(data, allPicks) {
  return allPicks.map(pickGroup => {
    return getGameData(data, pickGroup)
  })
}

function getGameData(data, picks) {
  const allGames = []
  for (var j = 0; j < picks.length; j++) {
    var currentPick = picks[j];
    const name = Object.keys(currentPick)[0];
    const game = data.find(({ awayTeam, homeTeam }) => {
      let awayName = (awayTeam.name || "").toLowerCase()
      let homeName = (homeTeam.name || "").toLowerCase()

      return awayName === name.toLowerCase()
        || homeName === name.toLowerCase()
    })
    
    if (!game) {
      continue;
    }

    const legacyGame = createLegacyObject(game)
    addSpreadData(legacyGame, currentPick);
    allGames.push(legacyGame);
  }
  return allGames.sort((a, b) => new Date(`${a.d} ${a.t}`) - new Date(`${b.d} ${b.t}`));
}

function createLegacyObject(game) {
  if (game.homeTeam.abbv === "WSH") {
    game.homeTeam.name = "Washington"
  }

  return {
    d: game.startDate,
    t: game.time || "",
    q: game.status,
    hnn: game.homeTeam.name,
    hs: game.homeTeam.score,
    v: game.awayTeam.name,
    h: game.homeTeam.name,
    vnn: game.awayTeam.name,
    vs: game.awayTeam.score,
    rz: "0",
    ga: "",
    gt: "pre",
    k: game.time,
    time_text: game.status === "In Progress" ? game.time : game.status,
    possessionTeamAbbr: game.homeTeam.hasPosession ? game.homeTeam.name : game.awayTeam.name,
    down: "",
    yardsToGo: "",
    yardline: "",
    away_team_icon: game.awayTeam.img,
    home_team_icon: game.homeTeam.img
  }
  // return {
  //   d: game.gameSchedule.gameDate,
  //   t: game.gameSchedule.gameTimeEastern,
  //   q: game.score ? game.score.phase : "P",
  //   hnn: game.gameSchedule.homeNickname,
  //   hs: game.score ? game.score.homeTeamScore.pointTotal : "0",
  //   v: game.gameSchedule.visitorTeamAbbr,
  //   h: game.gameSchedule.homeTeamAbbr,
  //   vnn: game.gameSchedule.visitorNickname,
  //   vs: game.score ? game.score.visitorTeamScore.pointTotal : "0",
  //   rz: "0",
  //   ga: "",
  //   gt: game.gameSchedule.seasonType,
  //   k: game.score ? game.score.time : null,
  //   possessionTeamAbbr: game.score ? game.score.possessionTeamAbbr : null,
  //   down: game.score ? game.score.down : null,
  //   yardsToGo: game.score ? game.score.yardsToGo : null,
  //   yardline: game.score ? game.score.yardline : null,
  //   away_team_icon: makeUrl(game.gameSchedule.visitorTeamAbbr),
  //   home_team_icon: makeUrl(game.gameSchedule.homeTeamAbbr)
  // };
}

function addSpreadData(currentGame, pick) {
  const name = Object.keys(pick)[0];
  //Setup team vars.
  var betTeam = "";
  var betTeamScore = 0;
  var isBetTeamHome = false;

  var otherTeam = "";
  var otherTeamScore = 0;

  if (name.toLowerCase() === currentGame.hnn.toLowerCase()) {
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
  var spread = parseFloat(pick[name].spread);
  var risk = parseFloat(pick[name].risk);
  currentGame['vdisplay'] = currentGame.v
  currentGame['hdisplay'] = currentGame.h
  if (isBetTeamHome) {
    currentGame.hdisplay = `${currentGame.hdisplay} (${spread} | $${risk})`;
  } else {
    currentGame.vdisplay = `${currentGame.vdisplay} (${spread} | $${risk})`
  }

  currentGame.bet_team = betTeam;
  
  covering = parseFloat(betTeamScore) + spread - parseFloat(otherTeamScore);
  currentGame.covering = covering;
  currentGame.card_background = "#AFAFAF"
  if (currentGame.q !== "Scheduled" && currentGame.q !== "P") {
    if (covering > 0) {
      currentGame.covering_text = currentGame.q === "FINAL"
        ? "Covered"
        : `Covering by ${covering}!`;
      currentGame.card_background = COLOR_WINNING;
    } else {
      currentGame.covering_text = currentGame.q.includes("Final")
        ? covering === 0 ? "Push" : "Lost"
        : covering === 0 ? "Even" : `Losing by ${covering * -1}!`;
        if (covering !== 0) {
          currentGame.card_background = COLOR_LOSING;
        }
      if (currentGame.q == "F") {
        currentGame.panel_class = "panel-lost";
      }
    }
  }

  // if (currentGame.q !== "PREGAME" && currentGame.q !== "FINAL") {
  //   if (currentGame.possessionTeamAbbr) {
  //     const ball = ` 🏈`;
  //     const info = `${currentGame.down} down and ${currentGame.yardsToGo}. Ball on the ${currentGame.yardline}`;

  //     if (currentGame.possessionTeamAbbr === currentGame.v) {
  //       currentGame.vnn += ball;
  //       currentGame.vnn_info = info;
  //     } else {
  //       currentGame.hnn += ball;
  //       currentGame.hnn_info = info;
  //     }
  //   }
  // }


  // if (currentGame.q === "HALFTIME") {
  //   currentGame.time_text = "Half time";
  // } else if (currentGame.q.includes("FINAL")) {
  //   currentGame.time_text = "Final";
  // } else if (currentGame.q[0] === "Q") {
  //   currentGame.time_text = `${currentGame.q} - ${currentGame.k}`;
  // } else {
  //   currentGame.covering_text = "Not in progress";

  //   const gameDate = new Date(currentGame.d);
  //   const timeArray = currentGame.t.split(":");
  //   gameDate.setHours(timeArray[0], timeArray[1], timeArray[2]);

  //   const day = daysOfWeek[gameDate.getDay()];
  //   const hour = gameDate.getHours() > 12 ? gameDate.getHours() - 12 : gameDate.getHours();
  //   const minute = gameDate.getMinutes() < 10 ? `0${gameDate.getMinutes()}` : gameDate.getMinutes()
  //   currentGame.time_text = `${day} at ${hour}:${minute} ${gameDate.getHours() > 12 ? "PM" : "AM"}`;
  // }
}
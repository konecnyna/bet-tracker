const request = require("request-promise");
const fs = require("fs");
const cheerio = require("cheerio");

module.exports = class Picks {
  analyzeResult(game) {
    this.teamThatCoveredSpread(game);
    const expertsPicks = this.getExpertRating(game);
  }

  teamThatCoveredSpread(game) {
    const { homeScore, awayScore } = game.result;
    const spread = parseInt(game.spread);
    const cover = homeScore - awayScore + spread;
    if (cover > 0) {
      game.result.coveredSpread = true;
    } else {
      game.result.coveredSpread = false;
    }
  }

  getExpertRating(game) {
    const { picks } = game;
    const occurrences = picks.reduce((acc, curr) => {
      if (typeof acc[curr] == "undefined") {
        acc[curr] = 1;
      } else {
        acc[curr] += 1;
      }

      return acc;
    }, {});
    const winningTeam = game.result.coveredSpread ? game.result.homeTeam : game.result.awayTeam;
    console.log(`${(occurrences[winningTeam] / 8) * 100}%`, winningTeam);
  }
};

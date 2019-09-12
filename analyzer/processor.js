module.exports = class ProcessData {
  analyzeResult(game) {
    this.teamThatCoveredSpread(game);
    //const expertsPicks = this.getExpertRating(game);    
  }

  teamThatCoveredSpread(game) {
    const { homeScore, awayScore, homeTeam, awayTeam } = game.result;
    const spread = parseInt(game.spread);
    const cover = homeScore - awayScore + spread;
    if (cover > 0) {
      game.result.coveredSpread = true;
      game.result.coveringTeam = homeTeam
    } else {
      game.result.coveredSpread = false;
      game.result.coveringTeam = awayTeam
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

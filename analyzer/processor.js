module.exports = class ProcessData {
  analyzeGame(game) {
    this.teamThatCoveredSpread(game);
  }

  teamThatCoveredSpread(game) {
    const { homeScore, awayScore, homeTeam, awayTeam } = game.result;
    const spread = parseInt(game.spread);
    const cover = homeScore - awayScore + spread;
    if (cover > 0) {
      game.result.coveredSpread = true;
      game.result.coveringTeam = homeTeam;
    } else {
      game.result.coveredSpread = false;
      game.result.coveringTeam = awayTeam;
    }
  }

  getExpertRating(data) {
    const { games } = data;
    const playedGames = games.filter(it => it.result.awayTeam);
    const weekRating = [];
    playedGames.map(game => {
      const winner = game.result.coveringTeam;
      game.picks.forEach((value, i) => {
        if (!weekRating[i]) {
          weekRating[i] = 0;
        }

        if (value === winner) {
          weekRating[i] += 1 / playedGames.length;
        }
      });
    });

    return weekRating;    
  }
};

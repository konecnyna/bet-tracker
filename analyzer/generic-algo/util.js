module.exports = class Util {
  getResultData(game, confidence, keys, result) {
    const rez = {};
    const max = Math.max(confidence[keys[0]], confidence[keys[1]]);

    const confPts = Math.abs(confidence[keys[1]] - confidence[keys[0]]);
    rez["spreadTeam"] = game.spreadTeam;
    rez["spread"] = game.spread;
    rez["confidence"] = confidence;
    rez["confPts"] = 1 - confPts / 1000;
    rez["pickedTeam"] = confidence[0] > confidence[1] ? keys[0] : keys[1];
    if (result.coveringTeam) {
      rez["coveringTeam"] = result.coveringTeam;
      const { homeScore, homeTeam, awayScore, awayTeam } = game.result;
      rez["final"] = `${homeTeam}: ${homeScore} - ${awayTeam}: ${awayScore}`;
      rez["won"] = true;
      if (max !== confidence[result.coveringTeam]) {
        rez["won"] = false;
      }
    }
    return rez;
  }
};

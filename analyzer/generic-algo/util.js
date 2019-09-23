const average = data => data.reduce((sum, value) => sum + value) / data.length;
const standardDeviation = values => Math.sqrt(average(values.map(value => (value - average(values)) ** 2)))

module.exports = class Util {
  getResultData(game, confidence, keys, result) {
    const rez = {};
    const max = Math.max(confidence[keys[0]], confidence[keys[1]]);
    rez["spreadTeam"] = game.spreadTeam;
    rez["spread"] = game.spread;
    rez["confidence"] = confidence;
    rez["confPts"] = 1 - standardDeviation([confidence[keys[0]], confidence[keys[1]]]);
    rez["pickedTeam"] = confidence[keys[0]] > confidence[keys[1]] ? keys[0] : keys[1];

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

  printConfidence(confidencePoints, favorite) {
    const gameConfidence = confidencePoints;
    let color = "\x1b[32m";
    if (gameConfidence < 80 && gameConfidence > 50) {
      color = "\x1b[34m";
    } else if (gameConfidence < 50) {
      color = "\x1b[31m";
    }
    console.log(color, `${favorite} - ${gameConfidence}%`, "\x1b[37m");
  }
};

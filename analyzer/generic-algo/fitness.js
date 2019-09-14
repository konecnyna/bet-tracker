module.exports = class Fitness {
  constructor(verbose) {
    this.verbose = verbose;
    this.resultsArr = [];
  }

  calcScore(phenotype) {
    const { data, analyst_ratings } = phenotype;
    let won = 0;
    data.games.map((game, index) => {
      const { result } = game;

      const confidence = {};
      game.picks.map((pick, i) => {
        if (!confidence[pick]) {
          confidence[pick] = 0;
        }
        
        confidence[pick] += analyst_ratings[i];
      });

      const keys = Object.keys(confidence);
      const max = Math.max(confidence[keys[0]], confidence[keys[1]]);
      if (max === confidence[result.coveringTeam]) {
        won += 1;
      }

      if (this.verbose) {
        this.dumpData(confidence, keys, result);
      }
    });

    return won / data.games.length;
  }

  dumpData(confidence, keys, result) {
    const rez = {};
    const max = Math.max(confidence[keys[0]], confidence[keys[1]]);
    const favor = max === confidence[keys[0]] ? keys[0] : keys[1];
    const confPts = Math.abs(confidence[keys[0]]) + Math.abs(confidence[keys[1]]);
    rez["spreadTeam"] = favor;
    rez["confidence"] = confidence;
    rez["confPts"] = confPts;
    
    if (result.coveringTeam) {
      rez["spreadcovered"] = result.coveredSpread;
      if (max !== confidence[result.coveringTeam]) {
        rez["won"] = false;
      }
    }
    this.resultsArr.push(rez);
  }

  printConfidence(confidencePoints, favorite) {
    // const gameConfidence = (confidencePoints / 10).toFixed(2) * 100;
    const gameConfidence = confidencePoints;
    let color = "\x1b[32m";
    if (gameConfidence < 80 && gameConfidence > 50) {
      color = "\x1b[34m";
    } else if (gameConfidence < 50) {
      color = "\x1b[31m";
    }
    console.log(color, `${favorite} - ${gameConfidence}%`, "\x1b[37m");
  }

  isWin(pick, game) {
    if (pick == game.result.coveringTeam) {
      return true;
    }

    return false;
  }
};

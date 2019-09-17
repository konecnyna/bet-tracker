const util = new (require("./util"))();
module.exports = class Fitness {
  constructor(verbose) {
    this.verbose = verbose;
    this.resultsArr = [];
  }

  calcScore(phenotype) {
    const { data,  chromosome } = phenotype;    
    
    let won = 0;
    data.games.map((game) => {
      const { result } = game;
      const confidence = this.confidence(game, chromosome.genes, result);
      const keys = Object.keys(confidence);
      won += this.win(confidence, result, keys);

      if (this.verbose) {
        const resultData = util.getResultData(game, confidence, keys, result);
        this.resultsArr.push(resultData);
      }
    });

    return won / data.games.length;
  }

  win(confidence, result, keys) {
    const max = Math.max(confidence[keys[0]], confidence[keys[1]]);
    if (max === confidence[result.coveringTeam]) {
      return 1;
    }

    return 0;
  }

  confidence(game, genes, result) {
    const confidence = {};
    const picks = {};
    confidence[game.result.homeTeam] = 0;
    confidence[game.result.awayTeam] = 0;
    picks[game.result.homeTeam] = 0;
    picks[game.result.awayTeam] = 0;

    game.picks.map((pick, i) => {
      const rating = genes[i];

      if (pick === "MIA") {
        confidence[pick] += rating * .1;
        return;
      }

      confidence[pick] += rating;
      picks[pick] += 1;
    });

    Object.keys(picks).map(key => {
      if (picks[key] === 0) {
        return;
      }

      confidence[key] = confidence[key] / picks[key];
    });

    return confidence;
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

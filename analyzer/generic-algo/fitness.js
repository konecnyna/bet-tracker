const util = new (require("./util"))();
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
      const confidence = this.confidence(game, analyst_ratings, result);
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

  confidence(game, analyst_ratings, result) {
    const confidence = {};    
    confidence[game.result.homeTeam] = 0;
    confidence[game.result.awayTeam] = 0;
    
    game.picks.map((pick, i) => {
      
      const rating = analyst_ratings[i];

      if (pick === "MIA" || pick === "NO") {
        confidence[pick] += rating * -1 * 1/32;
        return;
      }
      
      if (result.homeTeam === pick) {
        confidence[pick] += rating * 1.5;
      } else {
        confidence[pick] += rating;
      }

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

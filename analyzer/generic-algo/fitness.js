const util = new (require("./util"))();
const { Chromosome } = require("./chromosome");
module.exports = class Fitness {
  constructor(verbose) {
    this.verbose = verbose;
    this.resultsArr = [];
  }

  calcScore(phenotype) {
    const { data, chromosome } = phenotype;

    let won = 0;
    const { analysts_overall } = data;    
    data.games.map(game => {
      const { result } = game;
      const confidence = this.confidence(game, chromosome.genes, result, analysts_overall);
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

  confidence(game, genes, result, analysts_overall) {
    const confidence = {};
    confidence[game.result.homeTeam] = 0;
    confidence[game.result.awayTeam] = 0;
    this.addAnalystScore(game, genes, confidence, analysts_overall)
    this.addHomeFieldAdvantage(game, genes, confidence)
    return confidence;
  }

  addHomeFieldAdvantage(game, genes, confidence) {
    confidence[game.result.homeTeam] += genes[Chromosome.homeFieldAdvantageGeneIndex] * .1
  }

  addAnalystScore(game, genes, confidence, analysts_overall) {
    const analystPicks = {};
    analystPicks[game.result.homeTeam] = 0;
    analystPicks[game.result.awayTeam] = 0;
    game.picks.map((pick, i) => {
      if (i > Chromosome.analystEndIndex) {
        return;
      }

      const rating = genes[i];

      if (pick === "MIA" || pick === "NYG") {
        confidence[pick] += rating * 0.1;
      } else {
        confidence[pick] += rating;
      }
      confidence[pick] += analysts_overall[i] * .5;
      confidence[game.result.homeTeam] += genes[Chromosome.homeFieldAdvantageGeneIndex] * 0.1;
      analystPicks[pick] += 1;
    });

    Object.keys(analystPicks).map(key => {
      if (analystPicks[key] === 0) {
        return;
      }

      confidence[key] = confidence[key] / analystPicks[key];
    });

    return analystPicks;
  }
};

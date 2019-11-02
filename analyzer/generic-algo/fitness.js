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
      const confidence = this.calcConfidence(
        game,
        chromosome.genes,
        analysts_overall
      );
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

  calcConfidence(game, genes, analysts_overall) {
    const confidence = Confidence(game.result);
    const tst = this.getAnalystConfidence(game, genes, confidence, analysts_overall);
    // console.log(tst);
    // this.addHomeFieldAdvantage(game, genes, confidence);
    // this.addSpreadMovement(game, genes, confidence);
    // this.addFavoriteAdvantage(game, genes, confidence);
    return confidence;
  }

  addFavoriteAdvantage(game, genes, confidence) {
    const favorite =
      game.spread < 0 ? game.result.homeTeam : game.result.awayTeam;
    const { GENE_INDEX_FAVORITE } = Chromosome.indexes;
    confidence[favorite] += genes[GENE_INDEX_FAVORITE] * 0.5;
  }

  addSpreadMovement(game, genes, confidence) {
    const { homeTeam, awayTeam } = game.result;
    const { GENE_INDEX_SPREAD_MOVE } = Chromosome.indexes;
    confidence[homeTeam] +=
      game.spreadData[homeTeam].spreadDiff * genes[GENE_INDEX_SPREAD_MOVE];
    confidence[awayTeam] +=
      game.spreadData[awayTeam].spreadDiff * genes[GENE_INDEX_SPREAD_MOVE];
  }

  addHomeFieldAdvantage(game, genes, confidence) {
    
    confidence[game.result.homeTeam] +=
      genes[Chromosome.homeFieldAdvantageGeneIndex] * 0.1;
  }

  getAnalystConfidence(game, genes, confidence, analysts_overall) {
    const analystPicks = {};
    analystPicks[game.result.homeTeam] = 0;
    analystPicks[game.result.awayTeam] = 0;
    game.picks.map((pick, i) => {
      if (i > Chromosome.analystEndIndex || !pick) {
        return;
      }

      const rating = genes[i];
      confidence[pick] += rating;       
      analystPicks[pick] += 1;
    });
    return analystPicks
  }
};

const Confidence = result => {
  const confidence = {};
  confidence[result.homeTeam] = 0;
  confidence[result.awayTeam] = 0;
  return confidence;
};

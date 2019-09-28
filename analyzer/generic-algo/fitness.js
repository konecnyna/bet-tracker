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
      const confidence = this.calcConfidence(game, chromosome.genes, analysts_overall);
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
    this.addAnalystScore(game, genes, confidence, analysts_overall)
    this.addHomeFieldAdvantage(game, genes, confidence)
    this.addSpreadMovement(game, genes, confidence);
    return confidence;
  }

  addSpreadMovement(game,genes,confidence) {
    const {homeTeam, awayTeam} = game.result;
    const {GENE_INDEX_SPREAD_MOVE} = Chromosome.indexes;
    confidence[homeTeam] += game.spreadData[homeTeam].spreadDiff * genes[GENE_INDEX_SPREAD_MOVE];
    confidence[awayTeam] += game.spreadData[awayTeam].spreadDiff * genes[GENE_INDEX_SPREAD_MOVE];
  }

  addHomeFieldAdvantage(game, genes, confidence) {
    confidence[game.result.homeTeam] += genes[Chromosome.homeFieldAdvantageGeneIndex] * .1
  }

  addAnalystScore(game, genes, confidence, analysts_overall) {
    const analystPicks = {};
    analystPicks[game.result.homeTeam] = 0;
    analystPicks[game.result.awayTeam] = 0;        
    game.picks.map((pick, i) => {
      if (i > Chromosome.analystEndIndex || !pick) {
        return;
      }

      const rating = genes[i];
      if (["MIA","NYG","CLE","SF"].includes(pick)) {
        confidence[pick] += rating * 0.8;
      } else {
        confidence[pick] += rating;
      }

      confidence[pick] += analysts_overall[i];
      if (pick === game.result.homeTeam) {
        confidence[game.result.homeTeam] += genes[Chromosome.homeFieldAdvantageGeneIndex];      
      }
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


const Confidence = (result) => {
  const confidence = {};
  confidence[result.homeTeam] = 0;
  confidence[result.awayTeam] = 0;
  return confidence
}
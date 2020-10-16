const Fitness = require("./generic-algo/fitness");

module.exports = class Verify {
  verifyModel(phenotype) {
    this.fitness = new Fitness(phenotype.verbose);
    this.fitness.calcScore(phenotype);
    const { resultsArr } = this.fitness;

    const sorted = resultsArr
      // .filter(it => {
      //   return !it.final;
      // })
      // .filter(it => {
      //   return !it.won;
      // })
      .sort((a, b) => {
        if (a.confPts > b.confPts) {
          return 1;
        }
        if (a.confPts < b.confPts) {
          return -1;
        }
        if (a.confPts == b.confPts) {
          return 0;
        }
      });

    const record = resultsArr.reduce(
      (total, x) => (x.won == true ? total + 1 : total),
      0
    );

    console.log(sorted);
    console.log(`===== ${record} / ${resultsArr.length} (${(record/resultsArr.length * 100).toFixed(2)}%) =====`);
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

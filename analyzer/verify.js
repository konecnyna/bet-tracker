const Fitness = require("./generic-algo/fitness");
const Phenotype = require("./generic-algo/phenotype");
module.exports = class Verify {
  constructor(data, verbose) {
    this.data = data;
    this.verbose = verbose;
  }

  verifyModel(model) {
    const phenotype = new Phenotype(this.data, 0.3, model, false);
    this.fitness = new Fitness(this.verbose);
    this.fitness.calcScore(phenotype);
    const { resultsArr } = this.fitness;

    const sorted = resultsArr
      // .filter(it => {
      //   return !it.won;
      // })
      .sort((a, b) => {
        if (a.confPts > b.confPts) {
          return -1;
        }
        if (a.confPts < b.confPts) {
          return 1;
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
};

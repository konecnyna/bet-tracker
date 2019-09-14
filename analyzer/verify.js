const Fitness = require("./generic-algo/fitness");
const Phenotype = require("./generic-algo/phenotype");
module.exports = class Verify {
  constructor(data, verbose) {
    this.data = data;
    this.verbose = verbose;
  }

  verifyModel(model) {
    const phenotype = new Phenotype(this.data, 0.3, model, false);
    const { analyst_ratings } = phenotype;
    this.fitness = new Fitness(this.verbose);
    this.fitness.calcScore(phenotype);

    const sorted = this.fitness.resultsArr
      .filter(it => {
        return it.spreadcovered === false;
      });
      // .sort((a, b) => {
      //   if (a.confPts > b.confPts) {
      //     return 1;
      //   }
      //   if (a.confPts < b.confPts) {
      //     return -1;
      //   }
      //   if (a.confPts == b.confPts) {
      //     return 0;
      //   }
      // });

    console.log(sorted);
  }
};

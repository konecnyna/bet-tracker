const Fitness = require('./generic-algo/fitness');
const Phenotype = require('./generic-algo/phenotype');
module.exports = class Verify {
  constructor(data, verbose) {
    this.data = data;
    this.verbose = verbose;
  }

  verifyModel(model) {
    const phenotype = new Phenotype(this.data, .1, model, false)
    this.fitness = new Fitness(this.verbose);
    console.log(this.fitness.calcScore(phenotype))
  }
}
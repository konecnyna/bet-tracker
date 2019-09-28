module.exports = class Phenotype {
  constructor(data, mutationSize, chromosome, verbose) {
    if (mutationSize > 1) {
      throw new Error("mutationSize needs to be less than 1");
    }
    this.data = data;
    this.mutationSize = mutationSize;
    this.chromosome = chromosome;
    this.verbose = true;
  }
};

// Mutation is an operation which is applied to a single individual
// in the population. It can e.g. introduce some noise in the chromosome.
// For example, if the chromosomes are binary, a mutation may simply be
// the flip of a (random) bit (gene).

module.exports = class Mutate {
  evolve(phenotype) {
    const { analyst_ratings } = phenotype;
    const gene1_index = Math.floor(Math.random() * analyst_ratings.length);
    analyst_ratings[gene1_index] = this.generateRating();
    return phenotype;
  }

  generateRating() {
    return Math.random();
  }
};

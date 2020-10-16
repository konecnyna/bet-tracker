// Mutation is an operation which is applied to a single individual
// in the population. It can e.g. introduce some noise in the chromosome.
// For example, if the chromosomes are binary, a mutation may simply be
// the flip of a (random) bit (gene).

module.exports = class Mutate {
  evolve(phenotype) {
    const { genes } = phenotype.chromosome;
    const gene1_index = Math.floor(Math.random() * genes.length);
    // genes[gene1_index] = this.generateRating(
    //   genes[gene1_index],
    //   phenotype.mutationSize
    // );
    let dir = 1;
    if (Math.floor(Math.random() * 10) > 5) {
      dir = -1;
    }
    genes[gene1_index] +=  phenotype.mutationSize * dir;    
    return phenotype;
  }

  generateRating(cur, mutationSize) {
    let number = Math.floor(Math.random() * 10);

    const max = mutationSize;
    const min = 0;    
    const step =  Math.random() * (max - min) + min;         
    if (number % 2 === 0) {
      return cur + step;
    }
    return cur - step;
  }
};

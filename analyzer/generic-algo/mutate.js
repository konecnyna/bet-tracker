module.exports = class Mutate {
  evolve(phenotype) {
    const { analyst_ratings, mutationSize } = phenotype;
    const gene1_index = Math.floor(Math.random() * analyst_ratings.length);
    const gene2_index = Math.floor(Math.random() * analyst_ratings.length);

    analyst_ratings[gene1_index] = analyst_ratings[gene1_index] + mutationSize;
    analyst_ratings[gene2_index] = analyst_ratings[gene2_index] - mutationSize;

    // this.fixNegative(phenotype, gene1_index);
    // this.fixNegative(phenotype, gene2_index);

    return phenotype;
  }

  fixNegative(phenotype, index) {
    const { analyst_ratings } = phenotype;
    if (analyst_ratings[index] > 0) {
      return;
    }

    const { mutationSize, data } = phenotype;
    analyst_ratings[index] = 0;
    const distribution = mutationSize / (analyst_ratings.length - 1);
    analyst_ratings.map((rating, i) => {
      if (i !== index) {
        const diff = analyst_ratings[i] - distribution;
        if (diff > 0) {
          analyst_ratings[i] = diff;
        } else {
          analyst_ratings[i] = 0;
        }
      }
    });
  }
};

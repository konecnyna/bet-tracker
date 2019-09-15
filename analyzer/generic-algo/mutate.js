module.exports = class Mutate {
  evolve(phenotype) {
    const { analyst_ratings, mutationSize } = phenotype;
    const gene1_index = Math.floor(Math.random() * analyst_ratings.length);
    const gene2_index = Math.floor(Math.random() * analyst_ratings.length);

    analyst_ratings[gene1_index] = analyst_ratings[gene1_index] + mutationSize;
    analyst_ratings[gene2_index] = analyst_ratings[gene2_index] - mutationSize;


    return phenotype;
  }
};

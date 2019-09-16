module.exports = class Mutate {
  evolve(phenotype) {
    const { analyst_ratings, mutationSize } = phenotype;
    const gene1_index = Math.floor(Math.random() * analyst_ratings.length);
    const gene2_index = Math.floor(Math.random() * analyst_ratings.length);

    analyst_ratings[gene1_index] = this.generateRating();
    analyst_ratings[gene2_index] = this.generateRating();
    
    return phenotype;
  }

  generateRating() {
    return Math.random();
  }
};

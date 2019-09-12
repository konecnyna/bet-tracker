const geneticAlgorithm = require('geneticAlgorithm');
const Fitness = require('./fitness');

module.exports = class GenericAlgo {
  constructor(data, generations) {
    this.generations = generations;
    const firstPhenotype = {
      data: data,
      mutationSize: 2,          
      analyst_ratings: [
        12.5,
        12.5,
        12.5,
        12.5,
        12.5,
        12.5,
        12.5,
        12.5,
      ]
    }
    
    this.geneticAlgorithm = geneticAlgorithm({
      mutationFunction: this.mutationFunction,
      crossoverFunction: this.crossoverFunction,
      fitnessFunction: this.fitnessFunction,
      population: [firstPhenotype]
    });
  }

  mutationFunction(phenotype) {
    const { analyst_ratings, mutationSize } = phenotype;

    const gene1_index = Math.floor(Math.random() * analyst_ratings.length )
    const gene2_index = Math.floor(Math.random() * analyst_ratings.length )
    analyst_ratings[ gene1_index ] = analyst_ratings[ gene1_index ] + mutationSize;
    analyst_ratings[ gene2_index ] = analyst_ratings[ gene2_index ] - mutationSize;
    
    return phenotype;
  }

  crossoverFunction(phenotypeA, phenotypeB) {
    // move, copy, or append some values from a to b and from b to a
    return [phenotypeA, phenotypeB]
  }

  fitnessFunction(phenotype) {
    const fitness = new Fitness(phenotype.data);
    return fitness.calcScore(phenotype);    
  }

  start() {
    console.log("Starting with:")
    for (var i = 0; i < this.generations; i++) {
      this.geneticAlgorithm.evolve()
    }
    var best = this.geneticAlgorithm.best()
    delete best.score
    console.log("Finished with:")
    console.log(best.analyst_ratings)

    const total =best.analyst_ratings.reduce((a,b) => a + b, 0)
    
    console.log(total);
  }
}




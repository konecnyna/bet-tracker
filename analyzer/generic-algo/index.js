'use strict'
const geneticAlgorithm = require('geneticAlgorithm');
const Fitness = require('./fitness');
const Phenotype = require('./phenotype');

module.exports = class GenericAlgo {
  constructor(data, generations, mutataionSize, verbose) {
    
    this.generations = generations;
    const firstPhenotype = new Phenotype(data, mutataionSize, [
      .125,
      .125,
      .125,
      .125,
      .125,
      .125,
      .125,
      .125,
    ], 3, false);

    this.geneticAlgorithm = geneticAlgorithm({
      mutationFunction: this.mutationFunction,
      crossoverFunction: this.crossoverFunction,
      fitnessFunction: this.fitnessFunction,
      doesABeatBFunction: this.doesABeatBFunction,
      population: [firstPhenotype]
    });
  }

  mutationFunction(phenotype) {
    const { analyst_ratings, mutationSize } = phenotype;
    const mutation = Math.floor(Math.random() * mutationSize) / 100;
    const gene1_index = Math.floor(Math.random() * analyst_ratings.length)
    const gene2_index = Math.floor(Math.random() * analyst_ratings.length)
    analyst_ratings[gene1_index] = analyst_ratings[gene1_index] + mutation;
    analyst_ratings[gene2_index] = analyst_ratings[gene2_index] - mutation;
    
    return phenotype;
  }

  crossoverFunction(phenotypeA, phenotypeB) {
    // move, copy, or append some values from a to b and from b to a
    // console.log(phenotypeA.analyst_ratings, phenotypeB.analyst_ratings);
    return [phenotypeA, phenotypeB]
  }

  fitnessFunction(phenotype) {
    const fitness = new Fitness(phenotype.verbose);
    return fitness.calcScore(phenotype);
  }

  start() {
    console.log("Starting...");
    for (var i = 0; i < this.generations; i++) {
      if (i % 100 === 0) {
        console.log(`Evolving ${i} generation || ${this.geneticAlgorithm.bestScore()}`);
      }
      this.geneticAlgorithm.evolve()
    }
    const best = this.geneticAlgorithm.best();
    const score = this.geneticAlgorithm.bestScore()
    console.log("Finished with:")
    console.log("Model:", best.analyst_ratings);
    console.log(`Final confidence: ${score}`)
    const total = best.analyst_ratings.reduce((a, b) => a + b, 0)
    if (total < 1) {
      console.log(`Sum isn't one!!! ${total}`);
    }

    return this.geneticAlgorithm;
  }
}




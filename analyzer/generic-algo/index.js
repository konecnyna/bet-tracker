"use strict";
const geneticAlgorithm = require("geneticAlgorithm");
const Fitness = require("./fitness");
const Crossover = require("./crossover");
const Mutate = require("./mutate");
const logger = require("./logger");

module.exports = class GenericAlgo {
  constructor(phenotype, generations) {
    this.generations = generations;
    const firstPhenotype = phenotype;

    this.geneticAlgorithm = geneticAlgorithm({
      mutationFunction: this.mutationFunction,
      crossoverFunction: this.crossoverFunction,
      fitnessFunction: this.fitnessFunction,
      population: [firstPhenotype],
    });

    process.on("SIGINT", () => {
      logger.dumpAlogInfo(this.geneticAlgorithm);
      this.save();
      process.exit(1);
    });
  }

  mutationFunction(phenotype) {
    const mutate = new Mutate();
    return mutate.evolve(phenotype);
  }

  crossoverFunction(phenotypeA, phenotypeB) {
    // move, copy, or append some values from a to b and from b to a
    const crossover = new Crossover();
    return crossover.mate(phenotypeA, phenotypeB);
  }

  fitnessFunction(phenotype) {
    const fitness = new Fitness(phenotype.verbose);
    return fitness.calcScore(phenotype);
  }

  async start() {
    console.log(`Starting...(${this.generations} gens)`);
    for (var i = 0; i < this.generations; i++) {
      if (i % 100 === 0) {
        console.log(
          `Evolving ${i} generation || ${this.geneticAlgorithm.bestScore()}`
        );
      }

      // if (this.geneticAlgorithm.bestScore() == 1) {
      //   console.log("BEST SOLUTION FOUND.");
      //   break;
      // }
      this.geneticAlgorithm.evolve();
      await this.pause();
    }

    logger.dumpAlogInfo(this.geneticAlgorithm);
    this.save();
    return this.geneticAlgorithm;
  }

  async save() {
    const jsonfile = require("jsonfile");
    const path = require("path");
    const file = path.join(__dirname, "../data/perf-data.json");

    const cache = await jsonfile.readFileSync(file);
    const obj = {
      score: this.geneticAlgorithm.bestScore(),
      phenotype: this.geneticAlgorithm.best(),
    };

    if (cache.score < obj.score || !cache.score) {
      console.log("*******************************");
      console.log("*******************************");
      console.log(
        `Improvement! ${this.geneticAlgorithm.bestScore()} <--- ${cache.score}`
      );
      console.log("*******************************");
      console.log("*******************************");
      await jsonfile.writeFile(file, obj, { spaces: 2 });
    }
  }

  pause() {
    return new Promise(res => setTimeout(res, 0));
  }
};

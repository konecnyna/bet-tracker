module.exports.dumpAlogInfo = geneticAlgorithm => {
  const best = geneticAlgorithm.best();
  const score = geneticAlgorithm.bestScore();
  console.log("Finished with:");
  console.log("Model:", best.chromosome.genes);
  console.log(`Final confidence: ${score}`);
};

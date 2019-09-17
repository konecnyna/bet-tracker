module.exports.dumpAlogInfo = geneticAlgorithm => {
  const best = geneticAlgorithm.best();
  const score = geneticAlgorithm.bestScore();
  console.log("Finished with:");
  console.log("Model:", best.analyst_ratings);
  console.log(`Final confidence: ${score}`);
};

const picks = new (require("./pick"))();
const Verify = require("./verify");
const GA = require("./generic-algo");
const Phenotype = require("./generic-algo/phenotype");
const { Builder } = require("./generic-algo/chromosome");

getPicks = async () => {
  const week1 = await picks.getPicks(1, false);
  // const week2 = await picks.getPicks(2, false);
  // const week3 = await picks.getPicks(3, false);
  // const week4 = await picks.getPicks(4, false);
  // const week5 = await picks.getPicks(5, false);
  const allGames = [
    ...week1.games,
    // ...week2.games,
    // ...week3.games,
    // ...week4.games,
    // ...week5.games,
  ];
  week1.games = allGames.filter(it => it.result.coveringTeam);
  return week1;
};

main = async () => {
  const completed = await getPicks();
  const generations = 1000;
  const phenotype = new Phenotype(completed, 0.1, new Builder().build(), false);
  const ga = new GA(phenotype, generations);
  const algo = await ga.start();
};

predictWeek = async week => {
  let gameData;
  if (week) {
    console.log(`Predicting Week: ${week}`);
    gameData = await picks.getPicks(week, true);
  } else {
    console.log(`Predicting All`);
    gameData = await getPicks();
  }
  const model = [
    -1.0464793567922819,
    -2.4010791869772845,
    0.4650016975131527,
    0.6646991495437146,
    0.2888468940324611,
    1.7407059046743494,
    -0.2335042938999865,
    1.0119818425323128,
    -0.6453059726557147,
    0.039608476486313215,
    0.2858923398482053,
  ];

  const phenotype = new Phenotype(
    gameData,
    0.1,
    new Builder().withGenes(model).build(),
    false
  );
  const verify = new Verify();
  verify.verifyModel(phenotype);
};

complete = async gens => {
  // I think just a prime number.
  const gameData = await getPicks();
  let chromosome = new Builder().build();
  let mutation = 0.9;
  let algo;
  // while (mutation > 0) {
    console.log(mutation);
    const phenotype = new Phenotype(
      gameData,
      mutation,
      new Builder().withGenes(chromosome.genes).build(),
      false
    );
    const ga = new GA(phenotype, gens);
    algo = await ga.start();
    chromosome = ga.geneticAlgorithm.best().chromosome;
    mutation -= 0.1;
  // }

  const verify = new Verify();
  verify.verifyModel(algo.best());
};

const args = process.argv.slice(2);
switch (args[0]) {
  case "predict":
    predictWeek(args[1]);
    break;
  case "complete":
    complete(args[1] || 100);
    break;
  case "weather":
    const weather = async () => {
      console.log(
        await new (require("./gene-data/weather"))().getWeatherForWeek(3)
      );
    };
    weather();
    break;
  case "spread":
    new (require("./spreads"))().getSpreads(5);
    break;
  default:
    console.log("Please choose predict, complete, weather, spread");
    break;
}

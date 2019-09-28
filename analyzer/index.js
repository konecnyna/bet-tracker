const picks = new (require("./pick"))();
const Verify = require("./verify");
const GA = require("./generic-algo");
const Phenotype = require("./generic-algo/phenotype");
const { Builder } = require("./generic-algo/chromosome");

getPicks = async () => {
  const week1 = await picks.getPicks(1, false);
  const week2 = await picks.getPicks(2, false);
  const week3 = await picks.getPicks(3, false);
  const week4 = await picks.getPicks(4, false);
  const allGames = [
    ...week1.games,
    ...week2.games,
    ...week3.games,
    ...week4.games,
  ];
  week4.games = allGames.filter(it => it.result.coveringTeam);
  return week4;
};

main = async () => {
  const completed = await getPicks();
  const generations = 1000;
  // This must be < 1 and > 0
  const mutationSize = 0.17;
  const ga = new GA(completed, generations, mutationSize);
  const algo = await ga.start();
};

predictWeek = async week => {
  let gameData;
  if (week) {
    console.log(`Predicting Week: ${week}`);
    gameData = await picks.getPicks(week);
  } else {
    console.log(`Predicting All`);
    gameData = await getPicks();
  }
  const model = [
    0.2117039236335021,
    0.19675175571960657,
    0.6706709324851114,
    0.5120877931563828,
    0.4862895585386269,
    0.9893719261741352,
    0.90649979852067,
    0.7421776430427918,
    0.0012979470313194685,
    0.03266330409260276,
    0,
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
  let mutationSize = 0.47;
  const completed = await getPicks();
  const generations = gens;
  const ga = new GA(completed, generations, mutationSize);
  const algo = await ga.start();
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
    new (require("./spreads"))().getSpreads();
    break;
  default:
    main();
    break;
}

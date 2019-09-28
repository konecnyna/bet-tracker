const picks = new (require("./pick"))();
const Verify = require("./verify");
const GA = require("./generic-algo");
const { Builder } = require("./generic-algo/chromosome");

getPicks = async () => {
  const week1 = await picks.getPicks(1, false);
  const week2 = await picks.getPicks(2, false)
  const week3 = await picks.getPicks(3, false)
  const week4 = await picks.getPicks(4, false)
  const allGames = [
    ...week1.games,
    ...week2.games,
    ...week3.games,
    ...week4.games,
  ]
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
  console.log(`Predicting Week: ${week}`);
  const test = await picks.getPicks(week);
  // test.games = test.games.filter(it => !it.result.coveringTeam);
  const model = [
    0.1271085412968258,
    0.042047077680865685,
    0.8408859794620731,
    0.4346945382313858,
    0.21675806236442163,
    0.9330058378326922,
    0.9570179559479206,
    0.8235262691269698,
    0.0005076928749638832,
    0.0547599358677342
  ];

  const verify = new Verify(test, true);
  verify.verifyModel(new Builder().withGenes(model).build());
};

complete = async gens => {
  // I think just a prime number.
  let mutationSize = 0.47;
  const completed = await getPicks();
  const generations = gens;
  const ga = new GA(completed, generations, mutationSize);
  const algo = await ga.start();
  const verify = new Verify(completed, true);
  verify.verifyModel(algo.best().chromosome);
};

const args = process.argv.slice(2);
switch (args[0]) {
  case "predict":
    predictWeek(args[1] || 1);
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
    new (require('./spreads'))().getSpreads(); 
    break;
  default:
    main();
    break;
}

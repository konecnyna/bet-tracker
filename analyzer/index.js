const picks = new (require("./pick"))();
const Verify = require("./verify");
const GA = require("./generic-algo");
const { Builder } = require("./generic-algo/chromosome");

getPicks = async () => {
  const week1 = await picks.getPicks(1, false);
  // const week1 = { games: [] };
  const week2 = await picks.getPicks(2, false);
  const week3 = await picks.getPicks(3, false);

  let allGames = [];
  allGames = allGames.concat(week1.games);
  allGames = allGames.concat(week2.games);
  allGames = allGames.concat(week3.games);
  week3.games = allGames.filter(it => it.result.coveringTeam);
  return week3;
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
  const test = await picks.getPicks(week);
  const model = [
    0.22795321983834338,
    0.08838380734990037,
    0.42607730498664953,
    0.25860645770494584,
    0.26784180782921485,
    0.6405194225757649,
    0.5677434188741377,
    0.3911503691449527,
    0.27301004489899516
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
    predictWeek(args[1]);
    break;
  case "complete":
    complete(args[1] || 100);
    break;
  case "weather":
    const weather = async () => {
      console.log(await new (require('./gene-data/weather'))().getWeatherForWeek(3))
    }
    weather();
    break;
  default:
    main();
    break;
}

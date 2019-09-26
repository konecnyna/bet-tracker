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
    0.29301132883122905,
    0.05086829726387343,
    0.6998697089686927,
    0.5839524611222289,
    0.012251201165289993,
    0.8746330937852225,
    0.47319771653626463,
    0.12412393430184765,
    0.09101433688987015
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
  default:
    main();
    break;
}

const picks = new (require("./pick"))();
const Verify = require("./verify");
const GA = require("./generic-algo");

getPicks = async () => {
  const week1 = await picks.getPicks(1, true);  
  const week2 = await picks.getPicks(2, true);
  const allGames = week1.games.concat(week2.games);
  week2.games = allGames.filter(it => it.result.coveringTeam);
  return week2;
};

main = async () => {
  const completed = await getPicks();
  const generations = 1000;
  // This must be < 1 and > 0
  const mutationSize = 0.67;
  const ga = new GA(completed, generations, mutationSize);
  ga.start();
};

predictWeek = async (week) => {
  console.log(week);
  const test = await picks.getPicks(2);
  //test.games = test.games.filter(it => !it.result.coveringTeam);  
  const model = [
    2.005,
    0.595,
    1.065,
    -2.6949999999999994,
    1.065,
    4.354999999999999,
    1.535,
    -6.924999999999997,
  ];

  const verify = new Verify(test, true);
  verify.verifyModel(model);
};

complete = async () => {
  // I think just a prime number.
  let mutationSize = 0.47;
  const completed = await getPicks();
  const generations = 1000;
  const ga = new GA(completed, generations, mutationSize);
  const algo = ga.start();
  const model = algo.best().analyst_ratings;
  const verify = new Verify(completed, true);
  verify.verifyModel(model);  
};

const args = process.argv.slice(2);
switch (args[0]) {
  case "predict":
    predictWeek(args[1]);
    break;
  case "complete":
    complete();
    break;
  default:
    main();
    break;
}

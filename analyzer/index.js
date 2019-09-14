const picks = new (require("./pick"))();
const Verify = require("./verify");
const GA = require("./generic-algo");

getPicks = async () => {
  const week1 = await picks.getPicks(true, 1);
  const week2 = await picks.getPicks(true, 2);
  const allGames = week1.games.concat(week2.games);
  week2.games = allGames.filter(it => it.result.coveringTeam);
  return week2;
};

main = async () => {
  const completed = await getPicks();
  const generations = 2;
  // This must be < 1 and > 0
  const mutationSize = 0.01;
  const ga = new GA(completed, generations, mutationSize);
  ga.start();
};

verifyModel = async () => {
  const test = await picks.getPicks(true, 2)
  test.games = test.games.filter(it => !it.result.coveringTeam);
  
  const model = [
    1.535,
    0.595,
    2.005,
    -3.634999999999999,
    1.535,
    5.294999999999998,
    2.005,
    -8.334999999999997
  ];

  const verify = new Verify(test, true);
  verify.verifyModel(model);
};

complete = async () => {
  let mutationSize = .47;
  
  // while (mutationSize < .8) {
    const completed = await getPicks();
    const generations = 1000;
    const ga = new GA(completed, generations, mutationSize);
    const algo = ga.start();
    const model = algo.best().analyst_ratings;
    const verify = new Verify(completed, true);
    verify.verifyModel(model);
    // mutationSize += .01;
  // }
  
};

const args = process.argv.slice(2);
switch (args[0]) {
  case "verify":
    verifyModel();
    break;
  case "complete":
    complete();
    break;
  default:
    main();
    break;
}

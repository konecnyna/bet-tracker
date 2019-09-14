const picks = new (require("./pick"))();
const Verify = require("./verify");
const GA = require("./generic-algo");

getPicks = async () => {
  const week1 = await picks.getPicks(true, 1);
  const week2 = await picks.getPicks(true, 2);
  // return week1.concat(week2).filter(it => it.result.coveringTeam);
  return week1;
};

main = async () => {
  const completed = await getPicks();
  const generations = 1000;
  // This must be < 1 and > 0
  const mutationSize = 0.01;
  const ga = new GA(completed, generations, mutationSize);
  ga.start();
};

verifyModel = async () => {
  // const completed = await getPicks();
  // const completed = (await picks.getPicks(true, 2)).filter(it => it.result.coveringTeam);
  const completed = await picks.getPicks(true, 1);
  const model = [
    96.80499999999999,
    52.82499999999999,
    195.775,
    -160.22500000000002,
    13.674999999999999,
    207.32500000000002,
    52.27499999999999,
    -457.455,
  ];

  const verify = new Verify(completed, true);
  verify.verifyModel(model);
};

complete = async () => {
  const completed = await getPicks();
  const generations = 1000;
  // This must be < 1 and > 0
  const mutationSize = 0.01;
  const ga = new GA(completed, generations, mutationSize);
  const algo = ga.start();
  const model = algo.best().analyst_ratings;
  const verify = new Verify(completed, true);
  verify.verifyModel(model);
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

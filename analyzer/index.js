const picks = new (require('./pick'))();
const Verify = require('./verify');
const GA = require('./generic-algo');


getPicks = async () => {
  const week1 = await picks.getPicks(true, 1);
  const week2 = await picks.getPicks(true, 2);
  return week1.concat(week2).filter(it => it.result.coveringTeam)
}

main = async () => {
  const completed = await getPicks();
  const ga = new GA(completed, 1000, 50);
  ga.start();
}


verifyModel = async () => {
  // const completed = await getPicks();
  // const completed = (await picks.getPicks(true, 2)).filter(it => it.result.coveringTeam);
  const completed = (await picks.getPicks(true, 2));
  const model = [
    3.1249999999999996,
    -2.275,
    3.425,
    0.42500000000000004,
    -4.074999999999999,
    0.4249999999999999,
    1.025,
    -1.0749999999999997
  ];

  const verify = new Verify(completed, true);
  verify.verifyModel(model);
}

// main();
verifyModel();
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
  const ga = new GA(completed, 1000);
  ga.start();  
}


verifyModel = async () => {
  const completed = await getPicks();
  const model = [
    0.2475799912514909,
    0.030005206049618982,
    0.1283455113403598,
    0.20096785701731948,
    0.019286064667963253,
    0.3047197663247464,
    0.05909560334850123,
    0.01
  ];

  const verify = new Verify(completed, true);
  verify.verifyModel(model);
}

main();
// verifyModel();
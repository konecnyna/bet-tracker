const picks = new (require("./pick"))();
const Verify = require("./verify");
const GA = require("./generic-algo");

getPicks = async () => {
  const week1 = await picks.getPicks(true, 1);
  const week2 = await picks.getPicks(true, 2);
  return week1.concat(week2).filter(it => it.result.coveringTeam);
};

main = async () => {
  const completed = await getPicks();
  const ga = new GA(completed, 1000, 5000);
  ga.start();
};

verifyModel = async () => {
  // const completed = await getPicks();
  // const completed = (await picks.getPicks(true, 2)).filter(it => it.result.coveringTeam);
  const completed = await picks.getPicks(true, 2);
  const model = [
    54.03499999999999,
    61.464999999999975,
    127.345,
    -199.755,
    30.664999999999996,
    211.045,
    126.295,
    -410.09499999999997
  ];

  const verify = new Verify(completed, true);
  verify.verifyModel(model);
};

main();
// verifyModel();

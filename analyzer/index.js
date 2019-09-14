const picks = new (require("./pick"))();
const Verify = require("./verify");
const GA = require("./generic-algo");
[1,2,3].flatMap(function callback(current_value, index, Array){
    // It returns the new array's elements.
});

getPicks = async () => {
  const week1 = await picks.getPicks(true, 1);
  const week2 = await picks.getPicks(true, 2);
  // return week1.concat(week2).filter(it => it.result.coveringTeam);  
  return week1;
};

main = async () => {
  const completed = await getPicks();
  const generations = 10000;
  // This must be < 1 and > 0
  const mutationSize = .01;
  const ga = new GA(completed, generations, mutationSize);
  ga.start();
};

verifyModel = async () => {
  // const completed = await getPicks();
  // const completed = (await picks.getPicks(true, 2)).filter(it => it.result.coveringTeam);
  const completed = await picks.getPicks(true, 1);
  const model = [
    14.874999999999993,
    15.814999999999998,
    22.484999999999992,
    -37.505,
    4.784999999999998,
    45.06500000000002,
    16.565,
    -81.08500000000002,
  ];

  const verify = new Verify(completed, true);
  verify.verifyModel(model);
};

var args = process.argv.slice(2);
console.log("myArgs: ", args);
switch (args[0]) {
  case "verify":
    verifyModel();
    break;
  default:
    main();
}

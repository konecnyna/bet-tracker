const picks = new (require("./pick"))();
const Verify = require("./verify");
const GA = require("./generic-algo");
const { Builder } = require("./generic-algo/chromosome");

getPicks = async () => {
  const week1 = await picks.getPicks(1, false);
  // const week1 = { games: [] };
  const week2 = await picks.getPicks(2, false);
  const allGames = week2.games.concat(week1.games);
  week2.games = allGames.filter(it => it.result.coveringTeam);
  return week2;
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
  // test.games = test.games.filter(it => !it.result.coveringTeam);
  const model = [
    0.1796389035956698,
    0.061342841637115786,
    0.5450172011760472,
    0.3487166427618258,
    0.3890104515170778,
    0.8846229543386783,
    0.866458443046201,
    0.6189058340588012,
    0.8480928414481717,
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

const picks = new (require('./pick'))();
const Verify = require('./verify');
const GA = require('./generic-algo');

main = async () => {
  const games = await picks.getPicks();
  //console.log(games);
  const ga = new GA(games, 1000);
  ga.start();
}


verifyModel = async () => {
  const games = await picks.getPicks();
  const model = [ 122.5, -41.5, 14.5, 8.5, 40.5, 214.5, 18.5, -277.5 ];
  
  const verify = new Verify(games);
  verify.verifyModel(model);
}

// main();
verifyModel();
module.exports = class Fitness {
  constructor(verbose) {
    this.verbose = verbose;
  }

  calcScore(phenotype) {
    const { data, analyst_ratings } = phenotype  
    let won = 0;
    data.map((game, index) => {
      const { result } = game;

      const confidence = {};
      game.picks.map((pick, i) => {
        if (!confidence[pick]) {
          confidence[pick] = 0;
        }
        confidence[pick] += analyst_ratings[i];
      });

      if (this.verbose) {
        console.log("************************************************************");
        console.log(`Winner: ${result.coveringTeam} (${confidence[result.coveringTeam]})`)
        console.log(confidence);
        console.log("************************************************************");
      }
      
      const keys = Object.keys(confidence);
      const max = Math.max(confidence[keys[0]], confidence[keys[1]]);
      if (max === confidence[result.coveringTeam]) {
        won += 1;
      }
    });
    
    return won / data.length
  }


  isWin(pick, game) {
    if (pick == game.result.coveringTeam) {
      return true;
    }

    return false;
  }
}
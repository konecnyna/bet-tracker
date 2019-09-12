module.exports = class Fitness {
  constructor(data) {
    this.data = data;
  }

  calcScore(phenotype) {
    const { data, analyst_ratings } = phenotype
    let totalConfidence = 0;
    data.map(game => {
      game.picks.map((pick, index) => {
        totalConfidence += this.isWin(pick, game) ? analyst_ratings[index] : analyst_ratings[index] * -1;
      });
    });    
    return totalConfidence / analyst_ratings.length;
  }


  isWin(pick, game) {        
    if (pick == game.result.coveringTeam) {      
      return true;
    }
    
    return false;
  }
}
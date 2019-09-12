module.exports = class Verify {
  constructor(data) {
    this.data = data;
  }

  verifyModel(model) {

    this.data.map((game, index) => {
      const { result } = game;
      let confidence = 0;
      game.picks.map((pick, i) => {
        if (model[i] > 0) {
          confidence += model[i];
        }
      });

      console.log("************************************************************");
      console.log(`Confidence ${result.awayTeam} @ ${result.homeTeam}: ${confidence}`);
      console.log("************************************************************");
    })
  }
}
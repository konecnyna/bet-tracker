// Crossover is an operation which takes as input two individuals
// (often called the "parents") and somehow combines their chromosomes,
// so as to produce usually two other chromosomes (the "children"),
// which inherit, in a certain way, the genes of both parents.
module.exports = class Crossover {
  cloneJSON(item) {
    return JSON.parse(JSON.stringify(item));
  }

  mate(a, b) {
    const x = this.cloneJSON(a);
    const y = this.cloneJSON(b);
    let cross = false;
    for (var i in a.numbers) {
      if (Math.random() * a.analyst_ratings.length <= 1) {
        cross = !cross;
      }
      if (cross) {
        x.numbers[i] = b.numbers[i];
        y.numbers[i] = a.numbers[i];
      }
    }
    return [x, y];
  }
};

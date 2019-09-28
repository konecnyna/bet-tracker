// Crossover is an operation which takes as input two individuals
// (often called the "parents") and somehow combines their chromosomes,
// so as to produce usually two other chromosomes (the "children"),
// which inherit, in a certain way, the genes of both parents.
module.exports = class Crossover {
  cloneJSON(item) {
    return JSON.parse(JSON.stringify(item));
  }

  mate(a, b) {
    const { genes } = a.chromosome;
    const x = this.cloneJSON(a);
    const y = this.cloneJSON(b);
    let cross = false;
    for (var i in a.genes) {
      if (Math.random() * genes.length <= 1) {
        cross = !cross;
      }
      if (cross) {
        x.chromosome.genes[i] = b.chromosome.genes[i];
        y.chromosome.genes[i] = a.chromosome.genes[i];
      }
    }
    return [x, y];
  }
};

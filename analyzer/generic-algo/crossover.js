module.exports = class Crossover {
  first = true;
  cloneJSON = item => {
    return JSON.parse(JSON.stringify(item));
  };

  mate(a, b) {
    const x = this.cloneJSON(a);
    const y = this.cloneJSON(b);
    let cross = false;
    for (var i in a.analyst_ratings) {
      if (x.analyst_ratings[i] < 0 || y.analyst_ratings[i] < 0) { 
        if (x.data.analyst_overall && x.data.analyst_overall[i] > .5) {
          cross = !cross; 
        }        
      }
      if (cross) {
        x.analyst_ratings[i] = b.analyst_ratings[i];
        y.analyst_ratings[i] = a.analyst_ratings[i];
      }
    }
    return [x, y];
  }
};

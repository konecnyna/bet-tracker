module.exports = class Chromosome {
  constructor(data) {
    this.genes = data ? data : Array.from({ length: 8 }, (x, i) => Math.random());
  }

  // static get Builder() {
  //   class Builder {
  //     constructor(gene) {
       
  //     }

  //     withGene() {

  //     }

  //     build() {
  //       return new Gene(this)
  //     }
  //   }
  // }
}


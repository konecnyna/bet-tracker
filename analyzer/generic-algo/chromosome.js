const GENE_INDEX_ANALYST_START = 0;
const GENE_INDEX_ANALYST_END = 7;
const GENE_INDEX_HOME_FIELD = 8;
class Chromosome {
  constructor(genes) {
    this.genes = genes
  }


  static get analystEndIndex() {
    return GENE_INDEX_ANALYST_END;
  }

  static get homeFieldAdvantageGeneIndex() {
    return GENE_INDEX_HOME_FIELD;
  }
}

class Builder {
  constructor() {
    this.genes = Array.from({ length: 9 }, (x, i) => Math.random());
  }

  withGenes(genes) {
    this.genes = genes
    return this;
  }

  build() {
    return new Chromosome(this.genes)
  }
}

module.exports = { Chromosome: Chromosome, Builder: Builder }
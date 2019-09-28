const GENE_INDEX_ANALYST_START = 0;
const GENE_INDEX_ANALYST_END = 7;
const GENE_INDEX_HOME_FIELD = 8;
const GENE_INDEX_SPREAD_MOVE = 9;
class Chromosome {
  constructor(genes) {
    this.genes = genes;
  }

  static get analystEndIndex() {
    return GENE_INDEX_ANALYST_END;
  }

  static get homeFieldAdvantageGeneIndex() {
    return GENE_INDEX_HOME_FIELD;
  }

  static get indexes() {
    return {
      GENE_INDEX_ANALYST_START: 0,
      GENE_INDEX_ANALYST_END: 7,
      GENE_INDEX_HOME_FIELD: 8,
      GENE_INDEX_SPREAD_MOVE: 9,
    };
  }
}

class Builder {
  constructor() {
    this.genes = Array.from({ length: 10 }, (x, i) => Math.random());
  }

  withGenes(genes) {
    if (genes.length != 10) {
      throw new Error("Genes length is wrong.");
    }

    this.genes = genes;
    return this;
  }

  build() {
    return new Chromosome(this.genes);
  }
}

module.exports = { Chromosome: Chromosome, Builder: Builder };

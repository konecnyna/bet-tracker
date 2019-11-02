const GENE_INDEX_ANALYST_END = 7;
const GENE_INDEX_HOME_FIELD = 8;
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
      GENE_INDEX_FAVORITE: 10,
    };
  }
}

class Builder {
  constructor() {
    this.genesLength = 8;
    this.genes = Array.from({ length: this.genesLength }, (x, i) =>
      // Math.random()
      0.125
    );
  }

  withGenes(genes) {
    if (genes.length != this.genesLength) {
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

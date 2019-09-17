module.exports = class Phenotype {
    constructor(data, mutationSize, chromosome, homeField, verbose) {
        this.data = data;
        this.mutationSize = mutationSize;
        this.chromosome = chromosome;
        this.homeField = homeField;
        this.verbose = verbose;
    }
}
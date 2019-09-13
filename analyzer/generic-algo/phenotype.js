module.exports = class Phenotype {
    constructor(data, mutationSize, analyst_ratings, homeField, verbose) {
        this.data = data;
        this.mutationSize = mutationSize;
        this.analyst_ratings = analyst_ratings;
        this.homeField = homeField;
        this.verbose = verbose;
    }
}
class DataCarrier {
  constructor(minPrice, maxPrice, urlDefault) {
    this.products = [];

    this.minPrice = minPrice;
    this.maxPrice = maxPrice;

    this.totalAmountOfResults;
    this.numberOfResultsPerCall;

    this.urlDefault = urlDefault;
    this.url = this.urlDefault + "?min=" + this.minPrice + "&max=" + this.maxPrice;

    this.finishedCalling = false;

    this.numberOfResultsPerCall;
    this.maxItemsPerCall;

    this.callsCount = 0;
    this.index;

    this.currentMin = this.minPrice;
    this.currentMax = this.maxPrice;
    this.latestResponse;
    this.currentResultsInRange;
  }
}

export { DataCarrier };

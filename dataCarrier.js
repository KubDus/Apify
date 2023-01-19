class DataCarrier {
  constructor(minPrice, maxPrice, urlDefault) {
    this.products = [];

    this.minPrice = parseInt(minPrice);
    this.maxPrice = parseInt(maxPrice);

    this.totalAmountOfResults;

    this.urlDefault = urlDefault;
    this.url = this.urlDefault + "?min=" + this.minPrice + "&max=" + this.maxPrice;

    this.numberOfResultsPerCall;
    this.maxItemsPerCall;

    this.callsCount = 0;
    this.finishedCalling = false;

    this.index;

    this.currentMin = this.minPrice;
    this.currentMax = this.maxPrice;
    this.currentPriceRange = this.currentMax - this.currentMin;
    this.currentResultsInRange;
    this.latestResponse;
  }

  async firstDataSetup() {
    this.totalAmountOfResults = this.latestResponse.total;
    this.maxItemsPerCall = this.latestResponse.count;
    this.callsCount = 1;
  }

  async wasPriceRangeOk() {
    if (this.latestResponse.total < this.maxItemsPerCall) {
      return true;
    } else {
      return false;
    }
  }

  async moveRangeUp() {
    // if latest response total is less than 80 % of max results per call, then increase range
    if (this.latestResponse.total / this.maxItemsPerCall < 0.8) {
      this.currentMin = this.currentMax + 1;
      this.currentMax += Math.floor(this.currentPriceRange * this.index);

      // if latest response total was in between 80 % and 100 % of max results per call, we happy
    } else {
      this.currentMin = this.currentMax + 1;
      this.currentMax += this.currentPriceRange;
    }
  }

  async moveMaxPriceDown() {
    this.currentMax = this.currentMin + Math.floor(this.currentPriceRange * this.index);
  }

  async checkIfFinished() {
    // callsCount > totalAmountOfResults => to make sure cycle stops if something goes wrong
    if (this.currentMin > this.maxPrice || this.callsCount > this.totalAmountOfResults) {
      this.finishedCalling = true;
    }
  }

  async changeAttributes() {
    this.callsCount++;

    this.url = this.urlDefault + "?min=" + this.currentMin + "&max=" + this.currentMax;
    this.currentPriceRange = this.currentMax - this.currentMin;

    if (this.currentMax > this.maxPrice) {
      this.url = this.urlDefault + "?min=" + this.currentMin + "&max=" + this.maxPrice;
    }

    console.log(this.currentMin);
    console.log(this.currentMax);
    console.log(this.index);
  }

  async setIndex() {
    this.index = (this.maxItemsPerCall / this.latestResponse.total) * 0.7;
  }
}

export { DataCarrier };

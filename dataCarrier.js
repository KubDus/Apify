class DataCarrier {
  constructor(minPrice, maxPrice, urlDefault) {
    // those 2 can be changed to try to optimize necessary amount of calls
    this.receivedItemsIndex = 0.8; // we aim to receive minimum 80% of possible items per call
    this.ratioIndex = 0.9; // decrease ItemsRatio not to breach maxItemsPerCall too often

    this.products = [];

    this.minPrice = parseInt(minPrice); // initial min, does not change
    this.maxPrice = parseInt(maxPrice); // initial max, does not change
    this.totalAmountOfResults; // total amount of items we should get
    this.maxItemsPerCall; // total amount of items we can receive per one call

    this.itemsRatio; // received items per call to maxItemsPerCall ratio

    this.urlDefault = urlDefault;
    this.url = this.urlDefault + "?min=" + this.minPrice + "&max=" + this.maxPrice;

    this.callsCount = -1; // calls counter
    this.finishedCalling = false; // finished

    this.currentMin = this.minPrice;
    this.currentMax = this.maxPrice;
    this.currentPriceRange = this.currentMax - this.currentMin;
    this.currentResultsInRange;
    this.latestResponse;
  }

  // will be executed only on the first call
  async firstDataSetup() {
    this.totalAmountOfResults = this.latestResponse.total;
    this.maxItemsPerCall = this.latestResponse.count;
    this.callsCount = 0;
  }

  // checks if the items per call limit was breached
  async wasPriceRangeOk() {
    return this.latestResponse.total <= this.maxItemsPerCall;
  }

  // move price range up of next apiCall
  async moveRangeUp() {
    // if received items amount bellow receivedItemsIndex, increase range for next call - we not happy
    if (this.latestResponse.total / this.maxItemsPerCall < this.receivedItemsIndex) {
      this.currentMin = this.currentMax + 1;
      this.currentMax += Math.floor(this.currentPriceRange * this.itemsRatio);

      //  if received items amount above receivedItemsIndex - we happy
    } else {
      this.currentMin = this.currentMax + 1;
      this.currentMax += this.currentPriceRange;
    }
  }

  // check if we breached max items per call
  async moveMaxPriceDown() {
    this.currentMax = this.currentMin + Math.floor(this.currentPriceRange * this.itemsRatio);
  }

  // also checking calls count to avoid infinite loop
  async checkIfFinished() {
    if (this.currentMin > this.maxPrice || this.callsCount > this.totalAmountOfResults) {
      this.finishedCalling = true;
    }
  }

  // change attributes after single call
  async changeAttributes() {
    this.callsCount++;

    this.url = this.urlDefault + "?min=" + this.currentMin + "&max=" + this.currentMax;
    this.currentPriceRange = this.currentMax - this.currentMin;

    // we got above our initial max price
    if (this.currentMax > this.maxPrice) {
      this.currentMax = this.maxPrice;
      this.url = this.urlDefault + "?min=" + this.currentMin + "&max=" + this.maxPrice;
    }
  }

  async setItemsRatio() {
    this.itemsRatio = (this.maxItemsPerCall / this.latestResponse.total) * this.ratioIndex;
  }
}

export { DataCarrier };

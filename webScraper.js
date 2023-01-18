import apifyReturn from "./apifyReturn.js";
import axios from "axios";

class WebScraper {
  // constructor(minPrice, maxPrice, urlDefault) {
  //   this.minPrice = minPrice;
  //   this.maxPrice = maxPrice;
  //   this.total;

  //   this.urlDefault = urlDefault;
  //   this.url = this.urlDefault + "?min=" + this.minPrice + "&max=" + this.maxPrice;

  //   this.products = [];

  //   this.isFinished = false;

  //   this.numberOfResultsPerCall;
  //   this.maxItemsPerCall;

  //   this.callsCount;

  //   this.currentMin;
  //   this.currentMax;
  //   this.latestResponse;
  //   this.currentResultsInRange;
  // }

  // async scrapeProducts() {
  //   return;

  //   while (this.currentResult.length >= this.callsCount) {
  //     await this.makeApiCall();
  //   }

  //   return this.currentResult;
  // }

  // repeatApiCalls() {
  //   while (this.callsCount < this.resultsCount && !this.checkIfFinished()) {
  //     // in case there are more calls than expected results, leave loop (infinite cycle protection)

  //     this.makeApiCall();

  //     this.changePriceRange().then;
  //     this.makeApiCall();
  //   }
  // }

  async makeFirstApiCall(dataCarrier) {
    dataCarrier.latestResponse = (await axios.get(dataCarrier.url)).data;
    dataCarrier.totalAmountOfResults = dataCarrier.latestResponse.total;
    dataCarrier.numberOfResultsPerCall = dataCarrier.latestResponse.count;

    if (dataCarrier.latestResponse.total === dataCarrier.latestResponse.count) {
      dataCarrier.isFinished = true;
      dataCarrier.products = dataCarrier.latestResponse.products;
    }

    return dataCarrier;
  }

  checkIfFinished(dataCarrier) {
    if (dataCarrier.isFinished) {
      return true;
    } else {
      return false;
    }
  }

  async makeApiCall(dataCarrier) {
    dataCarrier.latestResponse = (await axios.get(dataCarrier.url)).data;

    if (dataCarrier.latestResponse.total < dataCarrier.numberOfResultsPerCall) {
      // we happy
      if (dataCarrier.latestResponse.total / dataCarrier.numberOfResultsPerCall < 0.8) {
        // increase range
      }
      console.log("in if");
      dataCarrier.products.push(dataCarrier.latestResponse.products);
      dataCarrier.currentMin = dataCarrier.currentMax;
      dataCarrier.currentMax += 50;
      // dodej produkty
      // pokud pocet dost velky, nastav finished true
      // posun min a max nahoru
    } else {
      // posun max dolu
      dataCarrier.index = (dataCarrier.numberOfResultsPerCall / dataCarrier.latestResponse.total) * 0.9;
      dataCarrier.maxPrice = Math.floor(dataCarrier.maxPrice * dataCarrier.index);
      console.log(dataCarrier.maxPrice);
    }

    dataCarrier.callsCount++;
    if (dataCarrier.callsCount > dataCarrier.totalAmountOfResults) {
      dataCarrier.finishedCalling = true;
    }
    console.log(dataCarrier.callsCount);
    return dataCarrier;
  }
}

export { WebScraper };

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
    dataCarrier.maxItemsPerCall = dataCarrier.latestResponse.count;

    if (dataCarrier.latestResponse.total === dataCarrier.latestResponse.count) {
      dataCarrier.isFinished = true;
      dataCarrier.products = dataCarrier.latestResponse.products;
    }

    // console.log(dataCarrier);

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

    console.log("-------------------------------------- new cycle" + dataCarrier.callsCount + " --------------------------------------------------");

    console.log("total " + dataCarrier.latestResponse.total);

    // ratio of returned products to max products per call

    dataCarrier.index = (dataCarrier.maxItemsPerCall / dataCarrier.latestResponse.total) * 0.7;

    // latest response total amount is less than max results per call - we happy
    if (dataCarrier.latestResponse.total < dataCarrier.maxItemsPerCall) {
      console.log("in happy");

      // if latest response total is less than 50 % of max results per call, then increase range
      if (dataCarrier.latestResponse.total / dataCarrier.maxItemsPerCall < 0.8) {
        console.log("in <80%");

        dataCarrier.currentMin = dataCarrier.currentMax + 1;

        dataCarrier.currentMax += Math.floor(dataCarrier.currentPriceRange * dataCarrier.index);

        // if latest response total was in between 80 % and 100 % of max results per call, we happy
      } else {
        console.log("in 80-100");
        dataCarrier.currentMin = dataCarrier.currentMax + 1;
        dataCarrier.currentMax += dataCarrier.currentPriceRange;
      }

      // push products from latest response
      dataCarrier.products.push(...dataCarrier.latestResponse.products);

      // move range bottom to the next level
      // dataCarrier.currentMin = dataCarrier.currentMax + 1;
      // dataCarrier.currentMax = Math.floor(dataCarrier.currentMax * dataCarrier.index);

      // there are more products in the range than we got - we not happy
    } else {
      // move max down

      dataCarrier.currentMax = dataCarrier.currentMin + Math.floor(dataCarrier.currentPriceRange * dataCarrier.index);
    }

    dataCarrier.callsCount++;
    if (dataCarrier.currentMax > dataCarrier.maxPrice || dataCarrier.callsCount > dataCarrier.totalAmountOfResults) {
      dataCarrier.finishedCalling = true;
    }

    if (dataCarrier.callsCount > 15) {
      dataCarrier.finishedCalling = true;
    }

    dataCarrier = await this.changeAttributesOfDataCarrier(dataCarrier);

    return dataCarrier;
  }

  async changeAttributesOfDataCarrier(dataCarrier) {
    dataCarrier.url = dataCarrier.urlDefault + "?min=" + dataCarrier.currentMin + "&max=" + dataCarrier.currentMax;
    dataCarrier.currentPriceRange = dataCarrier.currentMax - dataCarrier.currentMin;

    if (dataCarrier.currentMax > dataCarrier.maxPrice) {
      dataCarrier.currentMax = dataCarrier.maxPrice;
    }

    console.log(dataCarrier.currentMin);
    console.log(dataCarrier.currentMax);

    console.log(dataCarrier.index);

    return dataCarrier;
  }
}

export { WebScraper };

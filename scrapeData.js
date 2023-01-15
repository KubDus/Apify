import apifyReturn from "./apifyReturn.js";

class ScrapeStart {
  startScraping(minPrice, maxPrice) {
    const resultsJson = apifyReturn.getItemsInRange(minPrice, maxPrice);
    const resultsObj = JSON.parse(resultsJson);
    const resultFinalCount = resultsObj.count;

    if (resultsObj.total === resultFinalCount) {
      return resultsJson;
    } else {
      const scrapeRepeat = new ScrapeRepeat(minPrice, maxPrice, resultsObj.count);

      while (scrapeRepeat.resultsCount < resultFinalCount) {


      }
    }
  }
}

class ScrapeRepeat {
  constructor(minPrice, maxPrice, resultsCount) {
    this.minPrice = minPrice;
    this.maxPrice = maxPrice;
    this.resultsCount = resultsCount;
    this.result = [];
  }

  getMaxPriceInObj(){
    
  }

  pushToResult() {}
}
const scrapeStart = new ScrapeStart();
export default scrapeStart;

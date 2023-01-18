import { DataCarrier } from "./dataCarrier.js";
import { WebScraper } from "./webScraper.js";

export async function scrapingProcess(minPrice, maxPrice, urlDefault) {
  let dataCarrier = new DataCarrier(minPrice, maxPrice, urlDefault);
  const webScraper = new WebScraper(minPrice, maxPrice, urlDefault);

  await webScraper
    .makeFirstApiCall(dataCarrier)
    .then((response) => {
      dataCarrier = response;
    })
    .then(() => {
      return webScraper.checkIfFinished(dataCarrier);
    })
    .then((response) => {
      if (!response) {
        dataCarrier = repeatApiCallsUntilDone(dataCarrier, webScraper);
      } else {
        dataCarrier = finishAfterFirstCall(dataCarrier);
      }
    });

  return dataCarrier.products;
}

async function repeatApiCallsUntilDone(dataCarrier, webScraper) {
  let index;

  // console.log(dataCarrier);

  index = dataCarrier.totalAmountOfResults / dataCarrier.numberOfResultsPerCall;

  while (!dataCarrier.finishedCalling) {
    await webScraper.makeApiCall(dataCarrier).then((response) => {
      dataCarrier = response;
      // if (dataCarrier.latestResponse.products.length < dataCarrier.numberOfResultsPerCall) {
      //   if (dataCarrier.latestResponse.products.length / dataCarrier.numberOfResultsPerCall < 0.8) {
      //     // increase range
      //     console.log("in if")
      //   }
      //   // dodej produkty
      //   // pokud pocet dost velky, nastav finished true
      //   // posun min a max nahoru
      // } else {
      //   console.log("in else")
      //   // posun max dolu
      // }

      // if happy, min price bude max price, max price se posune

      // if not happy, no funkce
      // while loop - snizuj podle procenta, dokud to nebude ok
    });

    // check what percentage of max items per call were returned - want to have between 0,8 and 100

    // if yes, increase price by the same range and repeat

    // if no, check how were were over, decrease max price and repeat
  }
}

function finishAfterFirstCall(dataCarrier) {
  return dataCarrier;
}

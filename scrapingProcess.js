import { DataCarrier } from "./dataCarrier.js";
import { WebScraper } from "./webScraper.js";

export async function scrapingProcess(minPrice, maxPrice, urlDefault) {
  let dataCarrier = new DataCarrier(minPrice, maxPrice, urlDefault);
  const webScraper = new WebScraper(minPrice, maxPrice, urlDefault);

  console.log("------------------------ I start ---------------------------------------");

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
  // let index;

  // console.log(dataCarrier);

  // index = dataCarrier.totalAmountOfResults / dataCarrier.numberOfResultsPerCall;

  while (!dataCarrier.finishedCalling) {
    await webScraper.makeApiCall(dataCarrier).then((response) => {
      dataCarrier = response;
    });
  }
}

function finishAfterFirstCall(dataCarrier) {
  return dataCarrier;
}

import { DataCarrier } from "./dataCarrier.js";
import { WebScraper } from "./webScraper.js";

export async function scrapingProcess(minPrice, maxPrice, urlDefault) {
  let dataCarrier = new DataCarrier(minPrice, maxPrice, urlDefault);
  const webScraper = new WebScraper(minPrice, maxPrice, urlDefault);

  while (!dataCarrier.finishedCalling) {
    await webScraper.makeApiCall(dataCarrier).then((response) => {
      dataCarrier = response;
    });
  }

  let itemsAmount = dataCarrier.products.length;
  console.log("this is number of items " + itemsAmount);

  return dataCarrier.products;
}

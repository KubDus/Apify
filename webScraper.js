import axios from "axios";

class WebScraper {
  async makeApiCall(dataCarrier) {

    dataCarrier.latestResponse = (await axios.get(dataCarrier.url)).data;

    if (dataCarrier.callsCount === 0) {
      await dataCarrier.firstDataSetup();
    }

    console.log("-------------------------------------- new cycle" + dataCarrier.callsCount + " --------------------------------------------------");

    dataCarrier.setIndex();

    if (await dataCarrier.wasPriceRangeOk()) {
      dataCarrier.products.push(...dataCarrier.latestResponse.products);
      await dataCarrier.moveRangeUp();

      let itemsAmount = dataCarrier.latestResponse.products.length;
      console.log("adding this amount " + itemsAmount);
    } else {
      await dataCarrier.moveMaxPriceDown();
      console.log("moving price down");
    }

    await dataCarrier.checkIfFinished();
    await dataCarrier.changeAttributes();
    

    let itemsAmount = dataCarrier.products.length;
    console.log("this is number of items " + itemsAmount);

    return dataCarrier;
  }
}

export { WebScraper };

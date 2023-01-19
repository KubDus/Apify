import axios from "axios";

class WebScraper {
  async makeApiCall(dataCarrier) {
    dataCarrier.latestResponse = (await axios.get(dataCarrier.url)).data;

    if (dataCarrier.callsCount === 0) {
      await dataCarrier.firstDataSetup();
    }

    dataCarrier.setItemsRatio();

    if (await dataCarrier.wasPriceRangeOk()) {
      dataCarrier.products.push(...dataCarrier.latestResponse.products);
      await dataCarrier.moveRangeUp();
    } else {
      await dataCarrier.moveMaxPriceDown();
    }

    await dataCarrier.checkIfFinished();
    await dataCarrier.changeAttributes();

    return dataCarrier;
  }
}

export { WebScraper };

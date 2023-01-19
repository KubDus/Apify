import Items from "./items.js";
const maxItems = 1000;

class ApifyReturn {
  getItemsInRange(min, max) {
    let limitedItems = [];
    let allItemsInRange = [];
    let allItemsInRangeCount;
    let resultJson;
    let resultObj; 

    allItemsInRange = Items.filter(function (item) {
      return item.price >= min && item.price <= max;
    });

    allItemsInRangeCount = allItemsInRange.length;

    limitedItems = allItemsInRange.splice(0, maxItems);

    resultObj = {
      total: allItemsInRangeCount,
      count: limitedItems.length,
      products: limitedItems,
    };

    resultJson = JSON.stringify(resultObj);

    return resultJson;
  }
}

const apifyReturn = new ApifyReturn();
export default apifyReturn;

import express from "express";
import bodyParser from "body-parser";
import apifyReturn from "./apifyReturn.js";
import { WebScraper } from "./webScraper.js";
import { scrapingProcess } from "./scrapingProcess.js";

const app = express();
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const urlDefault = "http://localhost:3000/api.ecommerce.com/products";

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/api.ecommerce.com/products", function (req, res) {
  let minPrice = req.query.min;
  let maxPrice = req.query.max;

  const returnedProductsJson = apifyReturn.getItemsInRange(minPrice, maxPrice);

  res.send(returnedProductsJson);
});

app.post("/request", async function (req, res) {
  const minPrice = req.body.min;
  const maxPrice = req.body.max;

  let products = await scrapingProcess(minPrice, maxPrice, urlDefault);

});

app.post("/results", function (req, res) {
  const resultsJson = apifyReturn.getItemsInRange(req.body.min, req.body.max);
  const resultsObject = JSON.parse(resultsJson);

  res.render("results", { resultsObject: resultsObject, resultsJson: resultsJson });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});

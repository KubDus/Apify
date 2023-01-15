import express from "express";
import bodyParser from "body-parser";
import Items from "./items.js";

const app = express();
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.render("home");
});

app.post("/results", function (req, res) {
  console.log(req.body.max);
  console.log(Items)
  res.render("results");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});

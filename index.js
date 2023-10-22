const { port, DB_CONFIG, ENV } = require("./src/const/constants.js");
const knex = require("knex");
const express = require("express");
const register = require("./src/handlers/registeration.js");
const login = require("./src/handlers/login.js");
const bookSlot = require("./src/handlers/book-slot.js");
const releaseSlot = require("./src/handlers/release-slot.js");
const app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    "https://parking-lot-api-64l4.onrender.com"
  );
  res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(express.json());
app.use(express.urlencoded());

const db = knex(DB_CONFIG);
app.set("db", db);

app.post("/login", function (req, res) {
  login(req, res);
});

app.post("/register", function (req, res) {
  register(req, res);
});

app.post("/book-slot", function (req, res) {
  bookSlot(req, res);
});

app.post("/release-slot", function (req, res) {
  releaseSlot(req, res);
});

console.log("enviroment", ENV);

app.listen(port, () => console.log(`App listening on port ${port}!`));

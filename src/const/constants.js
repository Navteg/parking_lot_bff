const port = 8000;
const DB_CONFIG = {
  client: "pg",
  connection: {
    host: "localhost", // use your local ip address here
    user: "postgres", // use your username here
    password: "password", // use your password here
    database: "parking", // use your database name here
  },
};

const regexGetNumber = /[0-9]/g;

const SMALL_SLOT = "small";
const MEDIUM_SLOT = "medium";
const LARGE_SLOT = "large";
const X_LARGE_SLOT = "xLarge";

const PRICE_MAP = {
  [SMALL_SLOT]: 20,
  [MEDIUM_SLOT]: 40,
  [LARGE_SLOT]: 60,
  [X_LARGE_SLOT]: 100,
};

const SLOT_AVAILABLE = "available";
const SLOT_BOOKED = "booked";

module.exports = {
  port,
  DB_CONFIG,
  regexGetNumber,
  SMALL_SLOT,
  MEDIUM_SLOT,
  LARGE_SLOT,
  X_LARGE_SLOT,
  SLOT_AVAILABLE,
  SLOT_BOOKED,
  PRICE_MAP,
};

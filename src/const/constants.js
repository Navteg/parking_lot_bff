const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT || 8000;
const ENV = process.env.ENV || "development";
const DB_CONFIG = {
  client: "pg",
  connection: {
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    ssl: { require: true },
  },
};

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_PUBLIC = process.env.JWT_PUBLIC;

const regexGetNumber = /[0-9]/g;

var tokenOption = {
  issuer: "parking-system",
  subject: "Parking System Info",
  audience: "https://parking-lot-api-64l4.onrender.com",
  expiresIn: "7d",
};

const SMALL_SLOT = "small";
const MEDIUM_SLOT = "medium";
const LARGE_SLOT = "large";
const X_LARGE_SLOT = "xLarge";

const vehicleTypeList = [SMALL_SLOT, MEDIUM_SLOT, LARGE_SLOT, X_LARGE_SLOT];

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
  vehicleTypeList,
  ENV,
  JWT_SECRET,
  JWT_PUBLIC,
  tokenOption
};

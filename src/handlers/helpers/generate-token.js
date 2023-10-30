const jwt = require("jsonwebtoken");
const { JWT_SECRET, tokenOption } = require("../../const/constants.js");
const generateToken = async (parkingId) => {
  const token = jwt.sign({ parkingId }, JWT_SECRET, tokenOption);
  return token;
};

module.exports = generateToken;

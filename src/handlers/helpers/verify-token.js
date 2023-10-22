const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../const/constants.js");

const verifyToken = (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const { exp } = decoded;
    if (exp * 1000 < Date.now()) {
      return res.status(401).send({
        message: "token expired",
      });
    }

    return decoded;
  } catch (error) {
    return res.status(401).send({
      message: "Invalid signature",
    });
  }
};

module.exports = verifyToken;

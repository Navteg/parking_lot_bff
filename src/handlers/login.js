const bcrypt = require("bcrypt");
const generateToken = require("./helpers/generate-token.js");

const login = (req, res) => {
  const { id, password } = req.body;
  const db = req.app.get("db");

  async function isPasswordCorrect(hashPassword) {
    try {
      const result = await bcrypt.compare(password, hashPassword);
      return result === true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  console.info({
    message: "logging in",
    id,
    password,
  });

  try {
    db("parking_system")
      .select("*")
      .where("id", id)
      .then(async (rows) => {
        if (rows.length === 0) {
          res.status(404).send({
            message: `parking system with id ${id} not found`,
          });
        } else {
          if (await isPasswordCorrect(rows[0].password)) {
            const token = generateToken(id);
            return res.status(200).send({
              message: "login successful",
              token: token,
            });
          } else {
            res.status(400).send({
              message: "password is incorrect",
            });
          }
        }
      });
  } catch (err) {
    res.status(400).send(err);
  }
};

module.exports = login;

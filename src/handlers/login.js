const bcrypt = require("bcrypt");
const generateToken = require("./helpers/generate-token.js");

const login = async (req, res) => {
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
    const user = await db("parking_system").select("*").where("id", id);

    if (user.length === 0 || user === undefined) {
      return res.status(404).send({
        message: "User not found",
      });
    }

    const isCorrect = await isPasswordCorrect(user[0].password);
    if (isCorrect) {
      const token = await generateToken(id);
      return res.status(200).send({
        message: "login successful",
        token: token,
      });
    }

    return res.status(400).send({
      message: "Incorrect password",
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

module.exports = login;

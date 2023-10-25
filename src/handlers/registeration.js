const {
  regexGetNumber,
  SLOT_AVAILABLE,
  SMALL_SLOT,
  MEDIUM_SLOT,
  LARGE_SLOT,
  X_LARGE_SLOT,
} = require("../const/constants.js");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const register = (req, res) => {
  const { floors, smallSlots, mediumSlots, largeSlots, xLargeSlots, password } =
    req.body;
  const db = req.app.get("db");

  async function getHashPassword() {
    return await bcrypt.hash(password, 10);
  }

  console.info({
    message: "registering new park system",
    floors,
    smallSlots,
    mediumSlots,
    largeSlots,
    xLargeSlots,
  });

  try {
    insertParkingData();
  } catch (err) {
    res.status(400).send(err);
  }

  function numberToLetters(number) {
    let result = "";
    while (number > 0) {
      const remainder = (number - 1) % 26;
      result = String.fromCharCode(65 + remainder) + result;
      number = Math.floor((number - 1) / 26);
    }
    return result;
  }

  async function insertSlots(parkingId) {
    const slots = [];

    for (let i = 1; i <= floors; i++) {
      for (let j = 1; j <= smallSlots; j++) {
        slots.push({
          bay_id: `SMALL - ${numberToLetters(i)}${j}`,
          parking_id: parkingId,
          type: SMALL_SLOT,
          floor: i,
          status: SLOT_AVAILABLE,
          id: uuidv4(),
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
      for (let j = 1; j <= mediumSlots; j++) {
        slots.push({
          bay_id: `MEDIUM - ${numberToLetters(i)}${j}`,
          parking_id: parkingId,
          type: MEDIUM_SLOT,
          floor: i,
          status: SLOT_AVAILABLE,
          id: uuidv4(),
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
      for (let j = 1; j <= largeSlots; j++) {
        slots.push({
          bay_id: `LARGE - ${numberToLetters(i)}${j}`,
          parking_id: parkingId,
          type: LARGE_SLOT,
          floor: i,
          status: SLOT_AVAILABLE,
          id: uuidv4(),
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
      for (let j = 1; j <= xLargeSlots; j++) {
        slots.push({
          bay_id: `XLARGE - ${numberToLetters(i)}${j}`,
          parking_id: parkingId,
          type: X_LARGE_SLOT,
          floor: i,
          status: SLOT_AVAILABLE,
          id: uuidv4(),
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
    }

    try {
      await db.batchInsert("slots", slots, 100);
      console.info({
        message: "new slots registered",
        parkingId,
      });
    } catch (error) {
      console.error({
        message: "failed to insert data in slots",
        error,
      });
      res.status(400).send(error);
    }
  }

  function insertParkingData() {
    db("parking_system")
      .select(db.raw("MAX(id) as max_id"))
      .then(async (rows) => {
        const maxId = rows[0].max_id || 0;

        let newParkingId;
        if (maxId === 0) {
          newParkingId = `PARK${String(parseInt(maxId) + 1).padEnd(3, "0")}`;
        } else {
          let digit = maxId.match(regexGetNumber).join("");
          newParkingId = `PARK${String(parseInt(digit) + 1).padEnd(3, "0")}`;
        }

        db("parking_system")
          .insert({
            id: newParkingId,
            password: await getHashPassword(),
            floors,
            smallSlots,
            mediumSlots,
            largeSlots,
            xLargeSlots,
            created_at: new Date(),
          })
          .then(() => {
            console.info({
              message: "new park system registered",
              id: newParkingId,
            });
            insertSlots(newParkingId)
              .then(() => {
                console.info({
                  message: "Inserted slots",
                  id: newParkingId,
                });
                return res.status(200).send({
                  id: newParkingId,
                });
              })
              .catch((e) => {
                console.error({
                  message: "failed to insert slots",
                  error,
                });
                return res.status(400).send(e);
              });
          })
          .catch((error) => {
            console.error({
              message: "failed to insert data",
              error,
            });
            res.status(400).send(error);
          });
      })
      .catch((error) => {
        console.error({
          message: "failed to get max id",
          error,
        });
        res.status(400).send(error);
      });
  }
};

module.exports = register;

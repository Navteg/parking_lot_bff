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
    db.schema.hasTable("parking_system").then(async function (exists) {
      if (!exists) {
        await db.schema.createTable("parking_system", function (table) {
          table.string("id").primary();
          table.string("password");
          table.string("floors");
          table.string("smallSlots");
          table.string("mediumSlots");
          table.string("largeSlots");
          table.string("xLargeSlots");
          table.string("created_at");
        });
      }
      insertParkingData();
    });
    db.schema.hasTable("slots").then(async function (exists) {
      if (!exists) {
        await db.schema.createTable("slots", function (table) {
          table.string("id").primary();
          table.string("parking_id");
          table.string("type");
          table.string("floor");
          table.string("status");
          table.string("bay_id");
          table.string("created_at");
          table.string("updated_at");
          table
            .foreign("parking_id")
            .references("id")
            .inTable("parking_system");
        });
      }
    });
  } catch (err) {
    res.status(400).send(err);
  }

  async function insertSlots(parkingId) {
    for (let i = 1; i <= floors; i++) {
      for (let j = 1; j <= smallSlots; j++) {
        db("slots")
          .insert({
            bay_id: `SMALL${String(i).padEnd(2, "0")}${String(j).padEnd(
              2,
              "0"
            )}`,
            parking_id: parkingId,
            type: SMALL_SLOT,
            floor: i,
            status: SLOT_AVAILABLE,
            id: uuidv4(),
            created_at: new Date(),
            updated_at: new Date(),
          })
          .then(() => {
            console.info({
              message: "new slot registered",
              id: `SLOT${String(i).padEnd(2, "0")}${String(j).padEnd(2, "0")}`,
            });
          })
          .catch((error) => {
            console.error({
              message: "failed to insert data in small slots",
              error,
            });
            res.status(400).send(error);
          });
      }
      for (let j = 1; j <= mediumSlots; j++) {
        db("slots")
          .insert({
            bay_id: `MEDIUM${String(i).padEnd(2, "0")}${String(j).padEnd(
              2,
              "0"
            )}`,
            parking_id: parkingId,
            type: MEDIUM_SLOT,
            floor: i,
            status: SLOT_AVAILABLE,
            id: uuidv4(),
            created_at: new Date(),
            updated_at: new Date(),
          })
          .then(() => {
            console.info({
              message: "new slot registered",
              id: `SLOT${String(i).padEnd(2, "0")}${String(j).padEnd(2, "0")}`,
            });
          })
          .catch((error) => {
            console.error({
              message: "failed to insert data in medium slot",
              error,
            });
            res.status(400).send(error);
          });
      }
      for (let j = 1; j <= largeSlots; j++) {
        db("slots")
          .insert({
            bay_id: `LARGE${String(i).padEnd(2, "0")}${String(j).padEnd(
              2,
              "0"
            )}`,
            parking_id: parkingId,
            type: LARGE_SLOT,
            floor: i,
            status: SLOT_AVAILABLE,
            id: uuidv4(),
            created_at: new Date(),
            updated_at: new Date(),
          })
          .then(() => {
            console.info({
              message: "new slot registered",
              id: `SLOT${String(i).padEnd(2, "0")}${String(j).padEnd(2, "0")}`,
            });
          })
          .catch((error) => {
            console.error({
              message: "failed to insert data in large slot",
              error,
            });
            res.status(400).send(error);
          });
      }
      for (let j = 1; j <= xLargeSlots; j++) {
        db("slots")
          .insert({
            bay_id: `XLARGE${String(i).padEnd(2, "0")}${String(j).padEnd(
              2,
              "0"
            )}`,
            parking_id: parkingId,
            type: X_LARGE_SLOT,
            floor: i,
            status: SLOT_AVAILABLE,
            id: uuidv4(),
            created_at: new Date(),
            updated_at: new Date(),
          })
          .then(() => {
            console.info({
              message: "new slot registered",
              id: `SLOT${String(i).padEnd(2, "0")}${String(j).padEnd(2, "0")}`,
            });
          })
          .catch((error) => {
            console.error({
              message: "failed to insert data in xLarge slot",
              error,
            });
            res.status(400).send(error);
          });
      }
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

const { v4: uuidv4 } = require("uuid");
const { SLOT_AVAILABLE, SLOT_BOOKED } = require("../const/constants.js");
const checkNextSlot = require("./helpers/check-next-slot.js");
const verifyToken = require("./helpers/verify-token.js");

const bookSlot = async (req, res) => {
  const { vehicleNumber, vehicleType } = req.body;

  const tokenVerify = verifyToken(req, res);
  console.info({
    message: "token verify",
    tokenVerify,
  });
  
  const { parkingId, } = tokenVerify;

  const db = req.app.get("db");
  console.info({
    message: "booking slot",
    vehicleNumber,
    vehicleType,
    parkingId,
  });
  try {
    const slots = await db("slots")
      .select("*")
      .where("parking_id", parkingId)
      .andWhere("type", vehicleType)
      .andWhere("status", SLOT_AVAILABLE);

    let nextSlot;
    if (slots.length === 0 || slots === undefined) {
      console.info({
        message: `Sorry, no ${vehicleType} slot available. Checking for next slot`,
      });

      nextSlot = await checkNextSlot(req);

      if (!nextSlot) {
        return res.status(400).send({
          message: `Sorry, no ${vehicleType} slot available`,
        });
      }
    }

    const slot = slots[0] || nextSlot;
    console.info({
      message: "slot found",
      slot,
    });

    const bookingTable = await db.schema.hasTable("booking");
    if (!bookingTable) {
      await db.schema.createTable("booking", function (table) {
        table.string("id").primary();
        table.string("slot_id");
        table.string("vehicle_number").unique();
        table.string("vehicle_type");
        table.string("created_at");
        table.string("updated_at");
        table.foreign("slot_id").references("id").inTable("slots");
      });
    }

    const bookingInfo = {
      id: uuidv4(),
      slot_id: slot.id,
      vehicle_number: vehicleNumber,
      vehicle_type: vehicleType,
      created_at: new Date(),
      updated_at: new Date(),
    };
    await db("booking").insert(bookingInfo);

    console.info({
      message: "slot booked successfully",
      bookingRes: JSON.stringify(bookingInfo),
    });

    await db("slots").where("id", slot.id).update({
      status: SLOT_BOOKED,
      updated_at: new Date(),
    });

    return res.status(200).send({
      message: "slot booked successfully",
      bookingId: bookingInfo.id,
      bay_id: slot.bay_id,
      floor: slot.floor,
    });
  } catch (err) {
    console.error({
      message: "failed to book slot",
      err,
    });
    res.status(400).send(err);
  }
};

module.exports = bookSlot;

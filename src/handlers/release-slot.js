const { PRICE_MAP, SLOT_AVAILABLE } = require("../const/constants.js");
const verifyToken = require("./helpers/verify-token.js");

const releaseSlot = async (req, res) => {
  const { vehicleNumber } = req.body;
  const db = req.app.get("db");

  console.info({
    message: "releasing slot",
    vehicleNumber,
  });

  try {
    verifyToken(req, res);
    console.info({
      message: "token verify",
    });

    const bookingInfo = await db("booking")
      .select("*")
      .where("vehicle_number", vehicleNumber);

    if (bookingInfo.length === 0 || !bookingInfo || bookingInfo === undefined) {
      return res.status(404).send({
        message: `no booking found for vehicle number ${vehicleNumber}`,
      });
    }

    const booking = bookingInfo[0];
    console.info({
      message: "booking found",
      booking,
    });

    const slotInfo = await db("slots").select("*").where("id", booking.slot_id);
    const slot = slotInfo[0];
    console.info({
      message: "slot found",
      slot,
    });

    await db("slots").where("id", slot.id).update({
      status: SLOT_AVAILABLE,
      updated_at: new Date(),
    });

    await db("booking").where("id", booking.id).del();
    console.info({
      message: "slot released",
    });
    const totalHrs = Math.ceil(
      (new Date().getTime() - new Date(booking.created_at).getTime()) /
        (1000 * 60 * 60)
    );

    const totalAmount = totalHrs * PRICE_MAP[slot.type];

    return res.status(200).send({
      message: "slot released successfully",
      totalAmount,
      totalHrs,
      entryTime: booking.created_at,
      exitTime: new Date().toISOString(),
    });
  } catch (e) {
    console.error({
      message: "failed to release slot",
      error: e,
    });
    return res.status(400).send({
      message: "failed to release slot",
    });
  }
};

module.exports = releaseSlot;

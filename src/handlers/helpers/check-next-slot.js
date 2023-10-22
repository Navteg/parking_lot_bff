const { vehicleTypeList, SLOT_AVAILABLE } = require("../../const/constants");

const checkNextSlot = async (req, parkingId) => {
  const { vehicleType } = req.body;
  const db = req.app.get("db");
  const nextSlot = vehicleTypeList.indexOf(vehicleType) + 1;

  for (let i = nextSlot; i < vehicleTypeList.length; i++) {
    const slots = await db("slots")
      .select("*")
      .where("parking_id", parkingId)
      .andWhere("type", vehicleTypeList[i])
      .andWhere("status", SLOT_AVAILABLE);

    if (slots.length > 0) {
      console.info({
        message: `Found next slot, ${vehicleTypeList[i]}`,
        slot: slots[0],
      });
      return slots[0];
    }
  }
  console.info({
    message: `Sorry, no ${vehicleType} slot available`,
  });
  return null;
};

module.exports = checkNextSlot;

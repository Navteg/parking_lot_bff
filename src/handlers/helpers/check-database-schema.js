const checkDatabaseSchema = async (app) => {
  console.log(app);
  const db = app.get("db");
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
    db.schema.hasTable("booking").then(async function (exists) {
      if (!exists) {
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
    });
  } catch (err) {
    console.error(err);
  }
};

module.exports = checkDatabaseSchema;

const app = require("express")();
const { DB_CONFIG } = require("../const/constants.js");
const register = require("./registeration.js");
const knex = require("knex");

describe("Registration Function", () => {
  let mockReq;
  let mockRes;

  const mockKnex = jest.genMockFromModule("knex");
  const mockDB = knex(DB_CONFIG);
  mockKnex.mockReturnValue(mockDB);
  app.set("db", mockKnex);

  const mockCode = jest.fn();
  const mockSend = jest.fn();
  mockRes = {
    status: (...args) => {
      mockCode(...args);
      return {
        send: (...args) => mockSend(...args),
      };
    },
  };
  beforeEach(() => {
    mockReq = {
      body: {},
      app,
    };
    mockCode.mockClear();
    mockSend.mockClear();
  });

  it("should insert new parking data and return 200 status code", async () => {
    const floors = "2",
      smallSlots = "2",
      mediumSlots = "2",
      largeSlots = "2",
      xLargeSlots = "2",
      password = "password";

    mockKnex.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      max: jest.fn().mockReturnThis(),
      as: jest.fn().mockReturnThis(),
      batchInsert: jest.fn().mockReturnThis(),
      then: jest.fn().mockImplementation((callback) => {
        callback([{ max_id: "PARK001" }]);
      }),
      insert: jest.fn().mockReturnThis(),
    });

    await register(
      {
        ...mockReq,
        body: {
          floors,
          smallSlots,
          mediumSlots,
          largeSlots,
          xLargeSlots,
          password,
        },
      },
      mockRes
    );

    expect(mockCode).toHaveBeenCalledWith(200);
    expect(mockSend).toHaveBeenCalledWith({ id: "PARK100" });
  });

  it("should handle error when failed to insert parking data", async () => {
    const floors = "2",
      smallSlots = "2",
      mediumSlots = "2",
      largeSlots = "2",
      xLargeSlots = "2",
      password = "password";

    mockKnex.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      raw: jest.fn().mockReturnThis(),
      max: jest.fn().mockReturnThis(),
      then: jest.fn().mockImplementation((callback) => {
        callback([{ max_id: "PARK001" }]);
      }),
      insert: jest.fn().mockImplementation(() => {
        throw new Error("Failed to insert data");
      }),
    });

    await register(
      {
        ...mockReq,
        body: {
          floors,
          smallSlots,
          mediumSlots,
          largeSlots,
          xLargeSlots,
          password,
        },
      },
      mockRes
    );

    expect(mockCode).toHaveBeenCalledWith(400);
  });

  it("throw an error", async () => {
    const floors = "2",
      smallSlots = "2",
      mediumSlots = "2",
      largeSlots = "2",
      xLargeSlots = "2",
      password = "password";

    mockKnex.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      raw: jest.fn().mockReturnThis(),
      max: jest.fn().mockReturnThis(),
      then: jest.fn().mockImplementation((callback) => {
        callback(new Error("error"));
      }),
      insert: jest.fn().mockReturnThis(),
    });

    await register(
      {
        ...mockReq,
        body: {
          floors,
          smallSlots,
          mediumSlots,
          largeSlots,
          xLargeSlots,
          password,
        },
      },
      mockRes
    );

    expect(mockCode).toHaveBeenCalledWith(400);
  });
});

const bookSlot = require("./book-slot.js");
const app = require("express")();
const { DB_CONFIG } = require("../const/constants.js");
const knex = require("knex");

describe("book slot test cases", () => {
  let mockReq;
  let mockRes;

  const mockKnex = jest.genMockFromModule("knex");
  const mockDB = knex(DB_CONFIG);

  mockKnex.mockReturnValue(mockDB);
  const trx = jest.fn();

  mockKnex.transaction = jest.fn().mockImplementation(async (cb) => {
    await cb(trx);
  });

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
      headers: {
        authorization:
          "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXJraW5nSWQiOiJQQVJLMTA4IiwiaWF0IjoxNjk4MjYwMjcwLCJleHAiOjE2OTg4NjUwNzAsImF1ZCI6Imh0dHBzOi8vcGFya2luZy1sb3QtYXBpLTY0bDQub25yZW5kZXIuY29tIiwiaXNzIjoicGFya2luZy1zeXN0ZW0iLCJzdWIiOiJQYXJraW5nIFN5c3RlbSBJbmZvIn0.8fAJCSyI347E9CMX1fgaHs4exMPZ_MzpnyYBrjne9P8",
      },
    };
    mockCode.mockClear();
    mockSend.mockClear();
  });

  it("should book a slot successfully", async () => {
    const vehicleNumber = "CG13C5052";
    const vehicleType = "small";

    trx.rollback = jest.fn();
    trx.commit = jest.fn();
    trx.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      forUpdate: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      then: jest.fn().mockImplementation((cb) => {
        cb([
          {
            id: 1,
          },
        ]);
      }),
    });

    await bookSlot(
      { ...mockReq, body: { vehicleNumber, vehicleType } },
      mockRes
    );
    expect(mockCode).toHaveBeenCalledWith(200);
  });

  it("No slot found", async () => {
    const vehicleNumber = "CG13C5052";
    const vehicleType = "small";
    trx.rollback = jest.fn();
    trx.commit = jest.fn();
    trx.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      forUpdate: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      then: jest.fn().mockImplementation((cb) => {
        cb([]);
      }),
    });

    await bookSlot(
      { ...mockReq, body: { vehicleNumber, vehicleType } },
      mockRes
    );
    expect(mockCode).toHaveBeenCalledWith(400);
  });

  it("Thow an error", async () => {
    const vehicleNumber = "CG13C5052";
    const vehicleType = "small";
    trx.rollback = jest.fn();
    trx.commit = jest.fn();
    trx.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      forUpdate: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      then: jest.fn().mockImplementation((cb) => {
        cb(new Error("error"));
      }),
    });

    await bookSlot(
      { ...mockReq, body: { vehicleNumber, vehicleType } },
      mockRes
    );
    expect(mockCode).toHaveBeenCalledWith(400);
  });
});

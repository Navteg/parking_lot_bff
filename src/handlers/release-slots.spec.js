const app = require("express")();
const { DB_CONFIG } = require("../const/constants.js");
const knex = require("knex");
const releaseSlot = require("./release-slot.js");

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
      headers: {
        authorization:
          "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXJraW5nSWQiOiJQQVJLMTA4IiwiaWF0IjoxNjk4MjYwMjcwLCJleHAiOjE2OTg4NjUwNzAsImF1ZCI6Imh0dHBzOi8vcGFya2luZy1sb3QtYXBpLTY0bDQub25yZW5kZXIuY29tIiwiaXNzIjoicGFya2luZy1zeXN0ZW0iLCJzdWIiOiJQYXJraW5nIFN5c3RlbSBJbmZvIn0.8fAJCSyI347E9CMX1fgaHs4exMPZ_MzpnyYBrjne9P8",
      },
    };
    mockCode.mockClear();
    mockSend.mockClear();
  });

  it("200 - Released Slot Successfully", async () => {
    const vehicleNumber = "CG13C5052";

    mockKnex.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      del: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      then: jest.fn().mockImplementation((callback) => {
        callback([
          {
            id: 1,
            parking_id: "PARK108",
            vehicle_number: vehicleNumber,
            slot_id: 1,
            booking_time: new Date(),
            created_at: new Date(),
            updated_at: new Date(),
          },
        ]);
      }),
    });

    await releaseSlot(
      {
        ...mockReq,
        body: {
          vehicleNumber,
        },
      },
      mockRes
    );

    expect(mockCode).toHaveBeenCalledWith(200);
  });

  it("404 - No Booking found", async () => {
    const vehicleNumber = "CG13C5052";

    mockKnex.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      del: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      then: jest.fn().mockImplementation((callback) => {
        callback([]);
      }),
    });

    await releaseSlot(
      {
        ...mockReq,
        body: {
          vehicleNumber,
        },
      },
      mockRes
    );

    expect(mockCode).toHaveBeenCalledWith(404);
  });

  it("400 - Vehicle is in different parking", async () => {
    const vehicleNumber = "CG13C5052";

    mockKnex.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      del: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      then: jest.fn().mockImplementation((callback) => {
        callback([
          {
            id: 1,
            parking_id: "PARK001",
            vehicle_number: vehicleNumber,
            slot_id: 1,
            booking_time: new Date(),
            created_at: new Date(),
            updated_at: new Date(),
          },
        ]);
      }),
    });

    await releaseSlot(
      {
        ...mockReq,
        body: {
          vehicleNumber,
        },
      },
      mockRes
    );

    expect(mockCode).toHaveBeenCalledWith(400);
  });
});

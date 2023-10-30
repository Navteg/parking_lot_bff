const bcrypt = require("bcrypt");
const generateToken = require("./helpers/generate-token.js");
const login = require("./login");
const app = require("express")();
const { port, DB_CONFIG, ENV } = require("../const/constants.js");
const knex = require("knex");

describe("Login Function", () => {
  let mockReq;
  let mockRes;

  const knex = require("knex");
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

  it("should return 200 and a token on successful login", async () => {
    const id = "user123";
    const password = "correctPassword";
    const hashedPassword = await bcrypt.hash(password, 10);

    mockKnex.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      then: jest.fn().mockImplementation((callback) => {
        callback([{ password: hashedPassword }]);
      }),
    });

    await login({ ...mockReq, body: { id: id, password: password } }, mockRes);

    expect(mockCode).toHaveBeenCalledWith(200);
  });

  it("should return 404 - user not found", async () => {
    const id = "user123";
    const password = "correctPassword";

    mockKnex.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      then: jest.fn().mockImplementation((callback) => {
        callback([]);
      }),
    });

    await login({ ...mockReq, body: { id: id, password: password } }, mockRes);

    expect(mockCode).toHaveBeenCalledWith(404);
  });

  it("should return 400 - Incorrect password", async () => {
    const id = "user123";
    const password = "correctPassword";

    mockKnex.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      then: jest.fn().mockImplementation((callback) => {
        callback([{
          password: hashedPassword,
        }]);
      }),
    });

    await login({ ...mockReq, body: { id: id, password: 'wrongpassword' } }, mockRes);

    expect(mockCode).toHaveBeenCalledWith(400);
  });
});

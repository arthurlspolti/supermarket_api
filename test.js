const axios = require("axios");

// Testes
describe("GET /classes/produtos", function () {
  it("responde com json contendo uma lista de produtos", async function () {
    const response = await axios.get(
      "http://localhost:3000/classes/produtos?ids=1,2,3"
    );
    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toEqual(
      expect.stringContaining("json")
    );
  });

  it("responde com erro quando nenhum id é fornecido", async function () {
    try {
      await axios.get("http://localhost:3000/classes/produtos");
    } catch (error) {
      expect(error.response.status).toBe(400);
    }
  });
});

describe("GET /classes", function () {
  it("responde com json contendo uma lista de classes", async function () {
    const response = await axios.get("http://localhost:3000/classes?ids=1,2,3");
    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toEqual(
      expect.stringContaining("json")
    );
  });

  it("responde com erro quando nenhum id é fornecido", async function () {
    try {
      await axios.get("http://localhost:3000/classes");
    } catch (error) {
      expect(error.response.status).toBe(400);
    }
  });

  it("responde com erro quando o formato do id é inválido", async function () {
    try {
      await axios.get("http://localhost:3000/classes?ids=a,b,c");
    } catch (error) {
      expect(error.response.status).toBe(400);
    }
  });
});

// Importando o módulo axios
const axios = require("axios");

// Definindo os testes
describe("GET /products", function () {
  // Teste para verificar se a rota responde com um JSON contendo uma lista de produtos para as classes fornecidas
  it("responde com json contendo uma lista de produtos para as classes fornecidas", async function () {
    // Fazendo uma requisição GET para a rota /products com classes como parâmetro de consulta
    const response = await axios.get(
      "http://localhost:3000/products?classes=1,2,3"
    );
    // Verificando se o status da resposta é 200
    expect(response.status).toBe(200);
    // Verificando se o tipo de conteúdo da resposta é json
    expect(response.headers["content-type"]).toEqual(
      expect.stringContaining("json")
    );
    // Verificando se a resposta contém produtos
    expect(response.data.length).toBeGreaterThan(0);
  });

  // Teste para verificar se a rota responde com um JSON contendo todos os produtos quando nenhuma classe é fornecida
  it("responde com json contendo todos os produtos quando nenhuma classe é fornecida", async function () {
    // Fazendo uma requisição GET para a rota /products sem parâmetros de consulta
    const response = await axios.get("http://localhost:3000/products");
    // Verificando se o status da resposta é 200
    expect(response.status).toBe(200);
    // Verificando se o tipo de conteúdo da resposta é json
    expect(response.headers["content-type"]).toEqual(
      expect.stringContaining("json")
    );
    // Verificando se a resposta contém produtos
    expect(response.data.length).toBeGreaterThan(0);
  });

  // Teste para verificar se a rota responde com um erro quando o formato da classe é inválido
  it("responde com erro quando o formato da classe é inválido", async function () {
    try {
      // Fazendo uma requisição GET para a rota /products com classes inválidas como parâmetro de consulta
      await axios.get("http://localhost:3000/products?classes=a,b,c");
    } catch (error) {
      // Verificando se o status da resposta é 500
      expect(error.response.status).toBe(500);
    }
  });

  // Teste para verificar se a rota responde com uma lista vazia quando as classes fornecidas não têm produtos
  it("responde com uma lista vazia quando as classes fornecidas não têm produtos", async function () {
    // Fazendo uma requisição GET para a rota /products com uma classe que não tem produtos como parâmetro de consulta
    const response = await axios.get(
      "http://localhost:3000/products?classes=9999"
    );
    // Verificando se o status da resposta é 200
    expect(response.status).toBe(200);
    // Verificando se a resposta é uma lista vazia
    expect(response.data.length).toBe(0);
  });
});

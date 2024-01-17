import ShoppingRoute from "../models/shoppingRoute.js";
import prisma from "../lib/prisma.js";

// Função para buscar produtos em promoção
const buscarProdutosAdicionais = async (produtos, idsProdutos) => {
  let produtosAdicionais = [];
  let idsAdicionais = []; // Novo array para armazenar os IDs dos produtos adicionais
  for (let id of idsProdutos) {
    const produto = produtos.find((produto) => produto.id === id);
    if (produto && produto.Category) {
      const produtosPromocao = await buscarProdutosPromocao(
        produto,
        idsProdutos,
        idsAdicionais // Passa o array de IDs para a função buscarProdutosPromocao
      );
      produtosAdicionais = [...produtosAdicionais, ...produtosPromocao];
      idsAdicionais = [
        ...idsAdicionais,
        ...produtosPromocao.map((produto) => produto.id),
      ]; // Adiciona os IDs dos novos produtos ao array
    }
  }
  return produtosAdicionais;
};

// Função para buscar produtos em promoção
const buscarProdutosPromocao = async (produto, idsProdutos, idsAdicionais) => {
  const produtosPromocao = await prisma.products.findMany({
    where: {
      Category: {
        id: produto.Category.id,
        localization: produto.Category.localization,
      },
      discount_percentage: {
        gt: 0,
      },
      id: {
        notIn: [...idsProdutos, ...idsAdicionais], // Verifica se o produto já foi adicionado
      },
    },
    include: {
      Category: true,
    },
  });
  return produtosPromocao;
};

// Função para agrupar produtos
const agruparProdutos = (todosProdutos, idsProdutos, todasCategorias) => {
  const agrupados = {};
  // Inicializar todas as categorias com listas de produtos vazias
  todasCategorias.forEach((categoria) => {
    agrupados[categoria.localization] = {
      AisleNumber: categoria.localization,
      products: [],
      promotions: [],
    };
  });
  todosProdutos.forEach((produto) => {
    const chave = produto.Category
      ? produto.Category.localization
      : "Sem categoria";
    if (idsProdutos.includes(produto.id)) {
      agrupados[chave].products.push(produto);
    } else {
      agrupados[chave].promotions.push(produto);
    }
  });
  // Converte o objeto agrupado em um array
  return Object.values(agrupados);
};

const shoppingRouteService = {
  getShoppingRoutes: async (idsProdutos) => {
    const produtos = await ShoppingRoute.findProductsByIds(idsProdutos);
    const produtosAdicionais = await buscarProdutosAdicionais(
      produtos,
      idsProdutos
    );
    const todosProdutos = [...produtos, ...produtosAdicionais];
    const todasCategorias = await ShoppingRoute.findAllCategories();
    const produtosAgrupados = agruparProdutos(
      todosProdutos,
      idsProdutos,
      todasCategorias
    );
    return produtosAgrupados;
  },
};

export default shoppingRouteService;

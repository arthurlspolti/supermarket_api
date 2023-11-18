// Função para buscar produtos
const buscarGrupos = async (prisma, idsProdutos) => {
  return await prisma.products.findMany({
    where: {
      id: {
        in: idsProdutos,
      },
    },
    include: {
      Category: true,
    },
  });
};

// Função para buscar produtos em promoção
const buscarProdutosAdicionais = async (prisma, produtos, idsProdutos) => {
  let produtosAdicionais = [];
  let idsAdicionais = []; // Novo array para armazenar os IDs dos produtos adicionais
  for (let id of idsProdutos) {
    const produto = produtos.find((produto) => produto.id === id);
    if (produto && produto.Category) {
      const produtosPromocao = await buscarProdutosPromocao(
        prisma,
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

const buscarProdutosPromocao = async (
  prisma,
  produto,
  idsProdutos,
  idsAdicionais
) => {
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
const agruparProdutos = (todosProdutos, idsProdutos) => {
  const agrupados = todosProdutos.reduce((agrupados, produto) => {
    const chave = produto.Category
      ? produto.Category.localization
      : "Sem categoria";
    if (!agrupados[chave]) {
      agrupados[chave] = { AisleNumber: chave, products: [], promotions: [] };
    }
    if (idsProdutos.includes(produto.id)) {
      agrupados[chave].products.push(produto);
    } else {
      agrupados[chave].promotions.push(produto);
    }
    return agrupados;
  }, {});

  // Converte o objeto agrupado em um array
  return Object.values(agrupados);
};

module.exports = { buscarGrupos, buscarProdutosAdicionais, agruparProdutos };

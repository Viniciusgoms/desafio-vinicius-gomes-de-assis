class CaixaDaLanchonete {
    cardapio = [
        { codigo: "cafe", descricao: "Café", valor: 300 },
        { codigo: "chantily", descricao: "Chantily (extra do Café)", valor: 150 },
        { codigo: "suco", descricao: "Suco Natural", valor: 620 },
        { codigo: "sanduiche", descricao: "Sanduíche", valor: 650 },
        { codigo: "queijo", descricao: "Queijo (extra do Sanduíche)", valor: 200 },
        { codigo: "salgado", descricao: "Salgado", valor: 725 },
        { codigo: "combo1", descricao: "1 Suco e 1 Sanduíche", valor: 950 },
        { codigo: "combo2", descricao: "1 Café e 1 Sanduíche", valor: 750 }
    ];

    validaEntradas(metodoDePagamento, itens) {
        const arrayDeItens = itens.map(item => item.split(','));
        const codigosRecebidos = arrayDeItens.map(item => item[0]);
        const quantidadesItens = arrayDeItens.map(item => item[1]);
        const formasDePagamento = ["dinheiro", "debito", "credito"];

        const possuiCodigoInvalido = !codigosRecebidos.every(codigo => {
            return this.cardapio.some(itemDoCardapio => itemDoCardapio.codigo === codigo);
        });

        const formaDePagamentoValida = formasDePagamento.includes(metodoDePagamento);
        const carrinhoVazio = !itens.length > 0;
        const extraSemPrincipal = codigosRecebidos.includes("chantily") && !codigosRecebidos.includes("cafe") || codigosRecebidos.includes("queijo") && !codigosRecebidos.includes("sanduiche");

        let campoInvalido = false;
        let mensagemErro = "";

        if (carrinhoVazio) {
            campoInvalido = true;
            mensagemErro = "Não há itens no carrinho de compra!";
        }

        if (extraSemPrincipal) {
            campoInvalido = true;
            mensagemErro = "Item extra não pode ser pedido sem o principal";
        }

        if (quantidadesItens.includes("0")) {
            campoInvalido = true;
            mensagemErro = "Quantidade inválida!";
        }

        if (possuiCodigoInvalido) {
            campoInvalido = true;
            mensagemErro = "Item inválido!";
        }

        if (!formaDePagamentoValida) {
            campoInvalido = true;
            mensagemErro = "Forma de pagamento inválida!";
        }

        return { campoInvalido, mensagemErro }
    }

    calcularValorDaCompra(metodoDePagamento, itens) {

        const validaDadosRecebidos = this.validaEntradas(metodoDePagamento, itens)

        if (validaDadosRecebidos.campoInvalido) {
            return validaDadosRecebidos.mensagemErro;
        }

        const arrayDeItens = itens.map(item => item.split(','));
        const codigosRecebidos = arrayDeItens.map(item => item[0]);
        const quantidadesItens = arrayDeItens.map(item => item[1]);

        const itensEncontradosCardapio = this.cardapio.filter(itemDoCardapio => codigosRecebidos.includes(itemDoCardapio["codigo"]));

        let total = 0;
        for (let i = 0; i < itensEncontradosCardapio.length; i++) {
            if (metodoDePagamento === "dinheiro") {
                total += itensEncontradosCardapio[i].valor * Number(quantidadesItens[i]) * 0.95;
            }
            if (metodoDePagamento === "credito") {
                total += itensEncontradosCardapio[i].valor * Number(quantidadesItens[i]) * 1.03;
            }
            if (metodoDePagamento === "debito") {
                total += itensEncontradosCardapio[i].valor * Number(quantidadesItens[i]);
            }
        }
        return `R$ ${(total / 100).toFixed(2).replace(".", ",")}`;
    }

}

export { CaixaDaLanchonete };

// Função para abrir o modal de cadastro
document.getElementById("cadastroBtn").addEventListener("click", () => {
    document.getElementById("modal-cadastro").style.display = "block";
});

// Função para fechar o modal de cadastro
document.getElementById("modal-fechar-cadastro").addEventListener("click", () => {
    document.getElementById("modal-cadastro").style.display = "none";
});

// Função para abrir o modal de balanço de estoque
document.getElementById("balancoBtn").addEventListener("click", () => {
    document.getElementById("modal-balanco").style.display = "block"; // Abre o modal de balanço
    mostrarBalançoEstoque(); // Preenche as informações do balanço
});

// Função para fechar o modal de balanço de estoque
document.getElementById("modal-fechar-balanco").addEventListener("click", () => {
    document.getElementById("modal-balanco").style.display = "none";
});

// Função para abrir o modal de edição (ao clicar no botão Editar)
function editarProduto(id) {
    const nome = document.getElementById(`nome-${id}`).value;
    const quantidade = document.getElementById(`quantidade-${id}`).value;
    const preco = document.getElementById(`preco-${id}`).value;

    document.getElementById("modal-editar-id").value = id;
    document.getElementById("modal-editar-nome").value = nome;
    document.getElementById("modal-editar-quantidade").value = quantidade;
    document.getElementById("modal-editar-preco").value = preco;

    document.getElementById("retirar-estoque").value = "";
    document.getElementById("adicionar-estoque").value = "";

    document.getElementById("modal-editar").style.display = "block";
}

// Função para fechar o modal de edição
document.getElementById("modal-fechar-editar").addEventListener("click", () => {
    document.getElementById("modal-editar").style.display = "none";
});

// Função para salvar as edições no produto
async function salvarEdicaoProduto() {
    const id = document.getElementById("modal-editar-id").value;
    const nome = document.getElementById("modal-editar-nome").value;
    let quantidade = parseInt(document.getElementById("modal-editar-quantidade").value);
    const preco = parseFloat(document.getElementById("modal-editar-preco").value);
    const retirarEstoque = document.getElementById("retirar-estoque").value;
    const adicionarEstoque = document.getElementById("adicionar-estoque").value;

    if (retirarEstoque) {
        quantidade -= parseInt(retirarEstoque);
    }
    if (adicionarEstoque) {
        quantidade += parseInt(adicionarEstoque);
    }

    const confirmar = confirm("Você tem certeza que quer salvar esses dados?");
    if (confirmar) {
        await fetch(`http://localhost:3000/produtos/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, quantidade, preco })
        });

        carregarProdutos();
        document.getElementById("modal-editar").style.display = "none";
    } else {
        document.getElementById("modal-editar").style.display = "none";
    }
}

// Função para carregar os produtos da tabela
async function carregarProdutos() {
    const res = await fetch("http://localhost:3000/produtos");
    const produtos = await res.json();
    const tabela = document.getElementById("tabela-produtos").getElementsByTagName("tbody")[0];
    tabela.innerHTML = "";

    produtos.forEach(produto => {
        const quantidade = parseFloat(produto.quantidade);
        const preco = parseFloat(produto.preco);
        const totalItem = quantidade * preco;

        const row = tabela.insertRow();
        row.innerHTML = `
            <td>${produto.id}</td>
            <td><input value="${produto.nome}" id="nome-${produto.id}" disabled></td>
            <td><input type="number" value="${quantidade}" id="quantidade-${produto.id}" disabled></td>
            <td><input type="number" value="${preco.toFixed(2)}" id="preco-${produto.id}" disabled></td>
            <td>
                <input type="text" value="${totalItem.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}" id="valor-total-${produto.id}" disabled>
            </td>
            <td>
                <button onclick="editarProduto(${produto.id})">Editar</button>
                <button onclick="deletarProduto(${produto.id})">Excluir</button>
            </td>
        `;
    });

    calcularValorTotalEstoque(produtos);
}

// Função para deletar produto
async function deletarProduto(id) {
    await fetch(`http://localhost:3000/produtos/${id}`, { method: "DELETE" });
    carregarProdutos();
}

// Função para adicionar produto
async function adicionarProduto() {
    const nome = document.getElementById("nome").value;
    const quantidade = document.getElementById("quantidade").value;
    const preco = document.getElementById("preco").value;

    await fetch("http://localhost:3000/produtos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, quantidade, preco })
    });

    carregarProdutos();
    document.getElementById("modal-cadastro").style.display = "none";
}

// Função para calcular e exibir o valor total do estoque
function calcularValorTotalEstoque(produtos) {
    let total = 0;
    produtos.forEach(produto => {
        total += parseFloat(produto.quantidade) * parseFloat(produto.preco);
    });

    document.getElementById("valor-total-estoque").innerText = `Valor Total do Estoque: ${total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
}

// Função para mostrar o balanço de estoque
function mostrarBalançoEstoque() {
    fetch("http://localhost:3000/produtos")
        .then(res => res.json())
        .then(produtos => {
            const quantidadeTotal = produtos.reduce((acc, produto) => acc + parseFloat(produto.quantidade), 0);
            const valorTotal = produtos.reduce((acc, produto) => acc + (parseFloat(produto.quantidade) * parseFloat(produto.preco)), 0);
            const quantidadeItens = produtos.length;

            document.getElementById("quantidade-total-itens").innerText = `Quantidade Total de Itens: ${quantidadeTotal}`;
            document.getElementById("valor-total-balanco").innerText = `Valor Total do Estoque: ${valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
            document.getElementById("quantidade-itens-cadastrados").innerText = `Quantidade de Itens Cadastrados: ${quantidadeItens}`;
        });
}

// Carrega os produtos ao iniciar a página
carregarProdutos();

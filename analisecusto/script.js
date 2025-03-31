const dados = {
    meses: [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ],
    diasNoMes: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    lucroBruto: [
        null, 183036.54, 243351.91, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ],
    lucroLiquido: [
        null, 35846.13, 61892.28, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ],
    custos: [
        null, 152309.08, 149160.28, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ]
};

// Função para formatar valores monetários
function formatarMoeda(valor) {
    return valor && valor !== 0 ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor) : 'N/A';
}

// Função para calcular a variação percentual
function calcularVariacao(atual, anterior) {
    if (anterior === null || anterior === 0 || atual === 0) return "N/A";
    let variacao = ((atual - anterior) / anterior) * 100;
    return variacao.toFixed(2) + "% " + (variacao > 0 ? "a mais" : "a menos");
}

// Função para calcular a variação ajustada considerando a diferença de dias no mês
function calcularVariacaoAjustada(atual, anterior, diasAtual, diasAnterior) {
    if (anterior === null || anterior === 0 || diasAnterior === 0 || atual === 0) return "N/A";
    let custoDiarioAnterior = anterior / diasAnterior;
    let custoEquivalenteAnterior = custoDiarioAnterior * diasAtual;
    let variacaoAjustada = ((atual - custoEquivalenteAnterior) / custoEquivalenteAnterior) * 100;
    return variacaoAjustada.toFixed(2) + "% " + (variacaoAjustada > 0 ? "a mais" : "a menos");
}

// Função para renderizar os meses
function renderizarMeses() {
    const container = document.querySelector('.meses-container');
    dados.meses.forEach((mes, index) => {
        if (index === 0 || dados.lucroBruto[index] === 0 || dados.lucroLiquido[index] === 0 || dados.custos[index] === 0) return; // Ignora meses sem dados carregados

        const custoAtual = dados.custos[index];
        const custoAnterior = dados.custos[index - 1];
        const lucroAtual = dados.lucroLiquido[index];
        const lucroAnterior = dados.lucroLiquido[index - 1];

        const diasAtual = dados.diasNoMes[index];
        const diasAnterior = dados.diasNoMes[index - 1];

        const variacaoCusto = calcularVariacao(custoAtual, custoAnterior);
        const variacaoLucro = calcularVariacao(lucroAtual, lucroAnterior);
        const variacaoCustoAjustada = calcularVariacaoAjustada(custoAtual, custoAnterior, diasAtual, diasAnterior);

        const mesDiv = document.createElement('div');
        mesDiv.className = 'mes';
        mesDiv.innerHTML = `
            <h2>${mes}</h2>
            <div class="valores">
                <p><strong>Lucro Bruto:</strong> <span class="valor">${formatarMoeda(dados.lucroBruto[index])}</span></p>
                <p><strong>Lucro Líquido:</strong> <span class="valor">${formatarMoeda(dados.lucroLiquido[index])}</span></p>
                <p><strong>Custo Total:</strong> <span class="valor">${formatarMoeda(custoAtual)}</span></p>
                <p><strong>Variação Custo:</strong> <span class="variacao">${variacaoCusto}</span></p>
                <p><strong>Variação Custo Ajustada:</strong> <span class="variacao">${variacaoCustoAjustada}</span></p>
                <p><strong>Variação Margem Líquida:</strong> <span class="variacao">${variacaoLucro}</span></p>
            </div>
        `;
        container.appendChild(mesDiv);
    });
}

// Função para calcular e exibir os totais
function calcularTotais() {
    const totalCustos = dados.custos.reduce((acc, custo) => custo ? acc + custo : acc, 0);
    const totalLucroBruto = dados.lucroBruto.reduce((acc, lucro) => lucro ? acc + lucro : acc, 0);
    const totalLucroLiquido = dados.lucroLiquido.reduce((acc, lucro) => lucro ? acc + lucro : acc, 0);
    const brutoReal = totalLucroBruto - totalLucroLiquido;

    document.getElementById('total-custos').textContent = formatarMoeda(totalCustos);
    document.getElementById('total-lucro-bruto').textContent = formatarMoeda(totalLucroBruto);
    document.getElementById('total-lucro-liquido').textContent = formatarMoeda(totalLucroLiquido);
    document.getElementById('bruto-real').textContent = formatarMoeda(brutoReal);
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    renderizarMeses();
    calcularTotais();
});
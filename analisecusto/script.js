const dados = {
    meses: [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ],
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
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
}

// Função para renderizar os meses
function renderizarMeses() {
    const container = document.querySelector('.meses-container');
    dados.meses.forEach((mes, index) => {
        const mesDiv = document.createElement('div');
        mesDiv.className = 'mes';
        mesDiv.innerHTML = `
            <h2>${mes}</h2>
            <div class="valores">
                <p><strong>Lucro Bruto:</strong> <span class="valor">${formatarMoeda(dados.lucroBruto[index])}</span></p>
                <p><strong>Lucro Líquido:</strong> <span class="valor">${formatarMoeda(dados.lucroLiquido[index])}</span></p>
                <p><strong>Custo Total:</strong> <span class="valor">${dados.custos[index] ? formatarMoeda(dados.custos[index]) : 'N/A'}</span></p>
            </div>
        `;
        container.appendChild(mesDiv);
    });
}

// Função para calcular e exibir os totais
// Função para calcular e exibir os totais
function calcularTotais() {
    const totalCustos = dados.custos.reduce((acc, custo) => acc + (custo || 0), 0);
    const totalLucroBruto = dados.lucroBruto.reduce((acc, lucro) => acc + lucro, 0);
    const totalLucroLiquido = dados.lucroLiquido.reduce((acc, lucro) => acc + lucro, 0);

    // Calcular Bruto Real
    const brutoReal = totalLucroBruto - totalLucroLiquido;

    // Atualizar os valores nos cards
    document.getElementById('total-custos').textContent = formatarMoeda(totalCustos);
    document.getElementById('total-lucro-bruto').textContent = formatarMoeda(totalLucroBruto);
    document.getElementById('total-lucro-liquido').textContent = formatarMoeda(totalLucroLiquido);
    document.getElementById('bruto-real').textContent = formatarMoeda(brutoReal);
}

// Função para renderizar gráficos
function renderizarGraficos() {
    const ctxCustos = document.getElementById('grafico-custos').getContext('2d');
    const ctxLucros = document.getElementById('grafico-lucros').getContext('2d');

    new Chart(ctxCustos, {
        type: 'bar',
        data: {
            labels: dados.meses,
            datasets: [{
                label: 'Custos',
                data: dados.custos,
                backgroundColor: '#FF6F00',
                borderColor: '#E65100',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    new Chart(ctxLucros, {
        type: 'line',
        data: {
            labels: dados.meses,
            datasets: [
                {
                    label: 'Lucro Bruto',
                    data: dados.lucroBruto,
                    borderColor: '#4CAF50',
                    borderWidth: 2
                },
                {
                    label: 'Lucro Líquido',
                    data: dados.lucroLiquido,
                    borderColor: '#2196F3',
                    borderWidth: 2
                }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    renderizarMeses();
    calcularTotais();
    renderizarGraficos();
});
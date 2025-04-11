const dados = {
    meses: [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ],
    diasNoMes: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    lucroBruto: new Array(12).fill(null),
    lucroLiquido: new Array(12).fill(null),
    custos: new Array(12).fill(null)
};

const TSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTtvK3X3YMZzQe3M1I5lz6AkpNcdR8RomqEPefP_meogRr3LeZXELjeHajUYf4Cv_lFItd7YFf84NLf/pub?gid=1283668224&single=true&output=tsv";

async function carregarDados() {
    try {
        const response = await fetch(TSV_URL);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const tsv = await response.text();
        processarTSV(tsv);
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        alert('Erro ao carregar dados. Verifique o console para detalhes.');
    }
}

function processarTSV(tsv) {
    const linhas = tsv.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

    const mesesMap = {
        'janeiro': 0, 'fevereiro': 1, 'marco': 2,
        'abril': 3, 'maio': 4, 'junho': 5,
        'julho': 6, 'agosto': 7, 'setembro': 8,
        'outubro': 9, 'novembro': 10, 'dezembro': 11
    };

    linhas.slice(1).forEach((linha, index) => {
        try {
            const colunas = linha.split('\t');
            if (colunas.length < 4) {
                console.warn(`Linha ${index + 1} ignorada: formato inválido`);
                return;
            }

            const mes = colunas[0].toLowerCase()
                .normalize('NFD').replace(/[\u0300-\u036f]/g, "")
                .replace(/ç/g, 'c');

            const mesIndex = mesesMap[mes];
            if (mesIndex === undefined) {
                console.warn(`Mês desconhecido: "${colunas[0]}"`);
                return;
            }

            const converterValor = (valor) => {
                if (!valor || valor.trim() === '-' || valor.trim() === 'R$') return null;
                try {
                    return parseFloat(
                        valor.replace(/[^0-9,]/g, '').replace(',', '.')
                    );
                } catch {
                    return null;
                }
            };

            dados.lucroBruto[mesIndex] = converterValor(colunas[1]);
            dados.lucroLiquido[mesIndex] = converterValor(colunas[2]);
            dados.custos[mesIndex] = converterValor(colunas[3]);

        } catch (error) {
            console.error(`Erro na linha ${index + 2}:`, error);
        }
    });
}

function formatarMoeda(valor) {
    return valor !== null && !isNaN(valor)
        ? new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(valor)
        : 'N/A';
}

function calcularProjecaoMesAtual() {
    const hoje = new Date();
    const mesAtual = hoje.getMonth(); // 0 = Janeiro
    const diaAtual = hoje.getDate(); // Dia de hoje
    const diasNoMesAtual = dados.diasNoMes[mesAtual];

    const lucroBruto = dados.lucroBruto[mesAtual];
    const lucroLiquido = dados.lucroLiquido[mesAtual];
    const custos = dados.custos[mesAtual];

    // Evita cálculos com dados faltando
    if ([lucroBruto, lucroLiquido, custos].some(v => v === null || isNaN(v))) {
        console.warn("Dados insuficientes para projeção.");
        return;
    }

    // Média diária
    const mediaLucroBruto = lucroBruto / diaAtual;
    const mediaLucroLiquido = lucroLiquido / diaAtual;

    // Projeção até o final do mês
    const projecaoLucroBruto = mediaLucroBruto * diasNoMesAtual;
    const projecaoLucroLiquido = mediaLucroLiquido * diasNoMesAtual;

    // Atualiza o conteúdo do card
    const projecaoEl = document.getElementById('projecao-mensal');
    if (projecaoEl) {
        const titulo = projecaoEl.querySelector('h2');
        if (titulo) {
            titulo.textContent = `Projeção de ${dados.meses[mesAtual]}`;
        }

        const box = projecaoEl.querySelector('.projecao-box');
        if (box) {
            box.innerHTML = `
                 Média diária: ${formatarMoeda(mediaLucroLiquido)}<br>
                 Projeção até dia ${diasNoMesAtual}: ${formatarMoeda(projecaoLucroLiquido)}
            `;
        }
    }
}



function calcularVariacao(atual, anterior) {
    if ([atual, anterior].some(v => v === null || v === 0 || isNaN(v))) return "N/A";
    const variacao = ((atual - anterior) / anterior) * 100;
    return `${variacao.toFixed(2)}%`;
}

function calcularVariacaoAjustada(atual, anterior, diasAtual, diasAnterior) {
    if ([atual, anterior, diasAtual, diasAnterior].some(v => v === null || v === 0 || isNaN(v))) return "N/A";
    const equivalente = (anterior / diasAnterior) * diasAtual;
    const variacao = ((atual - equivalente) / equivalente) * 100;
    return `${variacao.toFixed(2)}%`;
}

function renderizarMeses() {
    const container = document.querySelector('.meses-container');
    if (!container) {
        console.error('Container de meses não encontrado!');
        return;
    }

    container.innerHTML = '';

    dados.meses.forEach((mes, index) => {
        if (dados.lucroBruto[index] === null && dados.lucroLiquido[index] === null) return;

        const mesDiv = document.createElement('div');
        mesDiv.className = 'mes-card';
        mesDiv.innerHTML = `
            <h3>${mes}</h3>
            <div class="detalhes-mes">
                <p>💰 Lucro Bruto: ${formatarMoeda(dados.lucroBruto[index])}</p>
                <p>💵 Lucro Líquido: ${formatarMoeda(dados.lucroLiquido[index])}</p>
                <p>📉 Custos: ${formatarMoeda(dados.custos[index])}</p>
                <br>
                <div class="variacoes">
                    <h3>Comparação com o mês anterior:</h3>
                    <p>📈 Variação margem: ${calcularVariacao(dados.lucroLiquido[index], dados.lucroLiquido[index - 1])}</p>
                    <p>📅 Variação Custos: ${calcularVariacaoAjustada(
                        dados.custos[index],
                        dados.custos[index - 1],
                        dados.diasNoMes[index],
                        dados.diasNoMes[index - 1]
                    )}</p>
                </div>
            </div>
        `;
        container.appendChild(mesDiv);
    });
}

function calcularTotais() {
    const total = (arr) => arr.reduce((acc, val) => (val !== null ? acc + val : acc), 0);

    const atualizarElemento = (id, valor) => {
        const elemento = document.getElementById(id);
        if (elemento) elemento.textContent = formatarMoeda(valor);
    };

    const totalLucroBruto = total(dados.lucroBruto);
    const totalLucroLiquido = total(dados.lucroLiquido);
    const totalCustos = total(dados.custos);
    const brutoReal = totalLucroBruto - totalCustos;

    atualizarElemento('total-lucro-bruto', totalLucroBruto);
    atualizarElemento('total-lucro-liquido', totalLucroLiquido);
    atualizarElemento('total-custos', totalCustos);
    atualizarElemento('bruto-real', brutoReal);
}

function renderizarGraficos() {
    const canvas = document.getElementById('grafico-financeiro');
    if (!canvas) {
        console.error('Elemento canvas não encontrado!');
        return;
    }

    const labels = [];
    const filteredLucroBruto = [];
    const filteredLucroLiquido = [];
    const filteredCustos = [];

    dados.meses.forEach((mes, index) => {
        if (dados.lucroBruto[index] === null && dados.lucroLiquido[index] === null) return;
        labels.push(mes);
        filteredLucroBruto.push(dados.lucroBruto[index]);
        filteredLucroLiquido.push(dados.lucroLiquido[index]);
        filteredCustos.push(dados.custos[index]);
    });

    if (window.graficoAtual) {
        window.graficoAtual.destroy();
    }

    const ctx = canvas.getContext('2d');
    window.graficoAtual = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [
                {
                    label: 'Lucro Bruto',
                    data: filteredLucroBruto,
                    backgroundColor: 'rgba(54, 162, 235, 0.8)',
                    borderWidth: 1
                },
                {
                    label: 'Lucro Líquido',
                    data: filteredLucroLiquido,
                    backgroundColor: 'rgba(75, 192, 192, 0.8)',
                    borderWidth: 1
                },
                {
                    label: 'Custos',
                    data: filteredCustos,
                    backgroundColor: 'rgba(255, 99, 132, 0.8)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: (value) => 'R$ ' + value.toLocaleString('pt-BR')
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: (context) => `${context.dataset.label}: ${formatarMoeda(context.raw)}`
                    }
                }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    await carregarDados();
    renderizarMeses();
    calcularTotais();
    renderizarGraficos();
    calcularProjecaoMesAtual();
});

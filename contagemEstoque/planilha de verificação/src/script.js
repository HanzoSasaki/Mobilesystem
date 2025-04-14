const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRdekakm6lV43qL82uxwyrSXss_EkcApw8tc10GHTn7-ormbOn7c8F9us0et7lTAaZxzI1bTwThzhFR/pub?output=csv';
let dadosCompletos = [];
let dataSelecionada = { inicio: null, fim: null };

// Função para converter data brasileira com tratamento de fuso horário
function parseDataBr(dataString) {
    const [dataParte] = dataString.split(' ');
    const [dia, mes, ano] = dataParte.split('/').map(Number);
    
    // Criar data no fuso horário local
    return new Date(ano, mes - 1, dia);
}

// Função para criar data a partir do input type="date"
function criarDataLocal(dataString) {
    const partes = dataString.split('-');
    const ano = parseInt(partes[0]);
    const mes = parseInt(partes[1]) - 1; // Meses são 0-based
    const dia = parseInt(partes[2]);
    
    // Criar data no fuso horário local
    const data = new Date(ano, mes, dia);
    
    // Compensar diferença do fuso horário
    data.setMinutes(data.getMinutes() + data.getTimezoneOffset());
    
    return data;
}

async function carregarDados() {
    try {
        document.querySelector('.loading').style.display = 'block';
        const response = await fetch(CSV_URL);
        const csvData = await response.text();
        dadosCompletos = processarCSV(csvData);
        atualizarTabela(dadosCompletos);
    } catch (error) {
        alert('Erro ao carregar dados: ' + error.message);
    } finally {
        document.querySelector('.loading').style.display = 'none';
    }
}

function processarCSV(csv) {
    return csv.split('\n').slice(1).filter(Boolean).map(linha => {
        const [sku, produto, estoque, data] = linha.split(',');
        return {
            sku: sku.trim(),
            produto: produto.trim(),
            estoque: estoque.trim(),
            data: parseDataBr(data.trim())
        };
    });
}

document.getElementById('dateInput').addEventListener('change', (e) => {
    const dataInput = criarDataLocal(e.target.value);
    
    if (!dataSelecionada.inicio) {
        dataSelecionada.inicio = dataInput;
        dataSelecionada.fim = dataInput;
    } else {
        dataSelecionada.fim = dataInput;
        
        // Ordenar datas se necessário
        if (dataSelecionada.fim < dataSelecionada.inicio) {
            [dataSelecionada.inicio, dataSelecionada.fim] = 
            [dataSelecionada.fim, dataSelecionada.inicio];
        }
    }

    atualizarChips();
    aplicarFiltro();
});

function aplicarFiltro() {
    let dadosFiltrados = dadosCompletos;
    
    if (dataSelecionada.inicio) {
        const inicio = new Date(dataSelecionada.inicio);
        inicio.setHours(0, 0, 0, 0);
        
        const fim = new Date(dataSelecionada.fim || dataSelecionada.inicio);
        fim.setHours(23, 59, 59, 999);

        dadosFiltrados = dadosCompletos.filter(item => {
            const dataItem = new Date(item.data);
            return dataItem >= inicio && dataItem <= fim;
        });
    }
    
    atualizarTabela(dadosFiltrados);
}

function atualizarChips() {
    const container = document.getElementById('chipsData');
    container.innerHTML = '';

    if (dataSelecionada.inicio) {
        const chip = document.createElement('div');
        chip.className = 'chip';
        chip.innerHTML = `
            ${formatarData(dataSelecionada.inicio)} 
            ${dataSelecionada.fim.getTime() !== dataSelecionada.inicio.getTime() 
                ? `- ${formatarData(dataSelecionada.fim)}` 
                : ''}
            <button onclick="limparFiltro()">&times;</button>
        `;
        container.appendChild(chip);
    }
}

function formatarData(data) {
    return data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function limparFiltro() {
    dataSelecionada = { inicio: null, fim: null };
    document.getElementById('dateInput').value = '';
    atualizarChips();
    atualizarTabela(dadosCompletos);
}

function atualizarTabela(dados) {
    const tbody = document.querySelector('#dataTable tbody');
    tbody.innerHTML = dados.map(item => `
        <tr>
            <td>${item.sku}</td>
            <td>${item.produto}</td>
            <td>${item.estoque}</td>
            <td>${formatarData(item.data)}</td>
        </tr>
    `).join('');
}

async function baixarPlanilhaCompleta() {
    try {
        const response = await fetch(CSV_URL);
        const csvData = await response.text();
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `planilha_completa_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    } catch (error) {
        alert('Erro ao baixar a planilha');
    }
}

// Inicialização
carregarDados();
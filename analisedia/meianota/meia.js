// Configurações e estados globais
let todosDados = [];
let flatpickrInstance = null;

// Mapeamento das colunas (ajuste os números conforme sua planilha)
const COLUNAS = {
    ID: 0,
    NOME_PRODUTO: 1,
    VARIACAO: 2,
    CUSTO_POR_PRODUTO: 3,
    PRECO_VENDA: 5,
    MARGEM_LIQUIDA: 11,
    LOJA: 10, // Coluna que contém DIRETAMENTE o nome da loja
    DATA: 13,
    QUANTIDADE: 17,
    BRUTO_LIQUIDO: 19,
    AVALIACAO_PRECO: 16
};

// Inicialização do sistema
document.addEventListener('DOMContentLoaded', async () => {
    try {
        mostrarCarregamento();
        await carregarDados();
        configurarFlatpickr();
        console.log('Sistema inicializado com sucesso');
    } catch (error) {
        console.error('Erro na inicialização:', error);
        mostrarErro('Falha ao inicializar o sistema');
    } finally {
        ocultarCarregamento();
    }
});

// Função principal de carregamento de dados
async function carregarDados() {
    try {
        const dadosVendas = await carregarPlanilha(
            'https://docs.google.com/spreadsheets/d/e/2PACX-1vTtvK3X3YMZzQe3M1I5lz6AkpNcdR8RomqEPefP_meogRr3LeZXELjeHajUYf4Cv_lFItd7YFf84NLf/pub?output=tsv'
        );
        
        todosDados = processarVendas(dadosVendas);
        console.log('Dados processados:', todosDados);
    } catch (error) {
        throw new Error(`Erro no carregamento: ${error.message}`);
    }
}

// Função para carregar a planilha
async function carregarPlanilha(url) {
    try {
        const response = await fetch(url);
        const tsvData = await response.text();
        return new Promise((resolve, reject) => {
            Papa.parse(tsvData, {
                delimiter: '\t',
                header: true,
                skipEmptyLines: true,
                complete: (result) => resolve(result.data),
                error: (err) => reject(err)
            });
        });
    } catch (error) {
        throw new Error(`Falha ao carregar planilha: ${error.message}`);
    }
}

// Processa dados de vendas
function processarVendas(dadosBrutos) {
    return dadosBrutos.map(linha => {
        try {
            return {
                id: linha[Object.keys(linha)[COLUNAS.ID]],
                produto: linha[Object.keys(linha)[COLUNAS.NOME_PRODUTO]],
                variacao: linha[Object.keys(linha)[COLUNAS.VARIACAO]],
                quantidade: parseInt(linha[Object.keys(linha)[COLUNAS.QUANTIDADE]]) || 0,
                custo: converterValor(linha[Object.keys(linha)[COLUNAS.CUSTO_POR_PRODUTO]]),
                preco: converterValor(linha[Object.keys(linha)[COLUNAS.PRECO_VENDA]]),
                margemLiquida: converterValor(linha[Object.keys(linha)[COLUNAS.MARGEM_LIQUIDA]]),
                brutoLiquido: converterValor(linha[Object.keys(linha)[COLUNAS.BRUTO_LIQUIDO]]),
                data: parseData(linha[Object.keys(linha)[COLUNAS.DATA]]),
                avaliacao: linha[Object.keys(linha)[COLUNAS.AVALIACAO_PRECO]] || 'Manter',
                loja: linha[Object.keys(linha)[COLUNAS.LOJA]] || 'Loja não informada'
            };
        } catch (error) {
            console.error('Erro ao processar linha:', linha, error);
            return null;
        }
    }).filter(item => item !== null);
}

// Funções auxiliares de conversão
function converterValor(valor) {
    return parseFloat(
        String(valor)
            .replace(/[^0-9,]/g, '')
            .replace(',', '.')
    ) || 0;
}

function parseData(dataStr) {
    try {
        const [dia, mes, ano] = dataStr.split('/').map(Number);
        return new Date(ano, mes - 1, dia);
    } catch (error) {
        console.error('Data inválida:', dataStr);
        return null;
    }
}

// Configuração do Flatpickr
function configurarFlatpickr() {
    flatpickrInstance = flatpickr("#seletorData", {
        mode: "range",
        dateFormat: "d/m/Y",
        locale: "pt",
        onChange: (dates) => {
            if(dates.length === 2) aplicarFiltro(dates[0], dates[1]);
        }
    });
}

// Aplicação de filtros
function aplicarFiltro(dataInicio, dataFim) {
    try {
        mostrarCarregamento();
        
        const inicio = new Date(dataInicio.setHours(0, 0, 0, 0));
        const fim = new Date(dataFim.setHours(23, 59, 59, 999));

        const dadosFiltrados = todosDados.filter(item => {
            if (!item.data) return false;
            const dataItem = new Date(item.data);
            return dataItem >= inicio && dataItem <= fim;
        });

        if(dadosFiltrados.length === 0) {
            mostrarAviso('Nenhum resultado encontrado para o período selecionado');
            return;
        }

        exibirResultados(dadosFiltrados);
        atualizarResumo(dadosFiltrados);
    } catch (error) {
        console.error('Erro na filtragem:', error);
        mostrarErro('Erro ao aplicar filtro');
    } finally {
        ocultarCarregamento();
    }
}

// Exibição dos resultados na tabela
function exibirResultados(dados) {
    const tbody = document.getElementById('table-body');
    tbody.innerHTML = '';

    dados.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.produto}</td>
            <td>${item.variacao}</td>
            <td>${item.quantidade}</td>
            <td>${item.loja}</td>
            <td>R$ ${item.custo.toFixed(2)}</td>
            <td>R$ ${item.preco.toFixed(2)}</td>
            <td style="color: ${item.margemLiquida < 0 ? 'red' : 'green'}">
                R$ ${item.margemLiquida.toFixed(2)}
            </td>
            <td>${((item.margemLiquida / item.preco) * 100 || 0).toFixed(2)}%</td>
            <td>${item.data.toLocaleDateString('pt-BR')}</td>
            <td style="color: ${item.avaliacao === 'Alterar' ? 'red' : 'green'}">
                ${item.avaliacao}
            </td>
         
        `;
        tbody.appendChild(row);
    });

    document.getElementById('resultTable').style.display = 'table';
}

// Atualização do resumo financeiro
function atualizarResumo(dados) {
    const totalVendas = dados.reduce((acc, item) => acc + item.quantidade, 0);
    const totalMargem = dados.reduce((acc, item) => acc + item.margemLiquida, 0);
    const totalBruto = dados.reduce((acc, item) => acc + item.brutoLiquido, 0);

    document.getElementById('totalVendas').textContent = totalVendas;
    document.getElementById('margemTotal').textContent = `R$ ${totalMargem.toFixed(2)}`;
    document.getElementById('lucroBruto').textContent = `R$ ${totalBruto.toFixed(2)}`;
}

// Funções de interface
function mostrarCarregamento() {
    document.getElementById('loader').style.display = 'flex';
}

function ocultarCarregamento() {
    document.getElementById('loader').style.display = 'none';
}

function mostrarErro(mensagem) {
    const div = document.createElement('div');
    div.className = 'erro';
    div.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        ${mensagem}
    `;
    document.body.prepend(div);
    setTimeout(() => div.remove(), 5000);
}

function mostrarAviso(mensagem) {
    const div = document.createElement('div');
    div.className = 'aviso';
    div.innerHTML = `
        <i class="fas fa-info-circle"></i>
        ${mensagem}
    `;
    document.body.prepend(div);
    setTimeout(() => div.remove(), 3000);
}

// Controle do scroll
window.onscroll = () => {
    const btn = document.getElementById('scrollToTopBtn');
    btn.style.display = window.scrollY > 100 ? 'block' : 'none';
};

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};
// script.js - Código Completo com Filtro por Loja

// Variáveis globais
let dadosPlanilha = [];
let pdfGlobal = null;
const lojasDisponiveis = ["Armazem", "4pshopping", "Fastshop"];
const planilhaURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTxtg1eIAjlrA3A064lmdbR9-AczKj-ngXntN6Up1a4hQx-jTAeMV8pK406GmNXRQY3PtvtnE87PQVQ/pub?output=csv";

// Inicialização
document.addEventListener("DOMContentLoaded", function() {
  inicializarDatePickers();
  popularFiltroLojas();
  carregarDadosPlanilha();
});

// Configuração dos datepickers
function inicializarDatePickers() {
  flatpickr("#dataRange", {
    mode: "range",
    dateFormat: "d/m/Y",
    locale: {
      ...flatpickr.l10ns.pt,
      rangeSeparator: " até "
    }
  });
  
  flatpickr("#dataPDF", {
    mode: "range",
    dateFormat: "d/m/Y",
    locale: {
      ...flatpickr.l10ns.pt,
      rangeSeparator: " até "
    }
  });
}

// Preenche o filtro de lojas (lista suspensa)
function popularFiltroLojas() {
  const select = document.getElementById("filtroLoja");
  select.innerHTML = '<option value="">Todas as Lojas</option>';
  lojasDisponiveis.forEach(loja => {
    select.innerHTML += `<option value="${loja}">${formatarNomeLoja(loja)}</option>`;
  });
}

// Função para converter data do formato dd/mm/yyyy para objeto Date
function parseDataBr(dataString) {
  if (!dataString || dataString === "N/A") return null;
  const [dia, mes, ano] = dataString.split('/').map(Number);
  return new Date(ano, mes - 1, dia);
}

// Carrega os dados da planilha e gera o gráfico completo; a tabela inicia vazia
async function carregarDadosPlanilha() {
  try {
    const response = await fetch(planilhaURL);
    const data = await response.text();
    
    dadosPlanilha = data.split("\n")
      .slice(1)
      .filter(linha => linha.trim() !== "")
      .map(linha => {
        const cols = linha.split(",");
        return {
          id: cols[0]?.trim() || "N/A",
          data: cols[1]?.trim() || "N/A",
          motivo: cols[2]?.trim() || "N/A",
          especificacao: cols[3]?.trim() || "N/A",
          status: cols[4]?.trim() || "N/A",
          loja: cols[5]?.trim() || "N/A",
          quantidade: cols[6]?.trim() || "N/A"
        };
      });
    
    // Tabela inicia vazia
    preencherTabela([]);
    // Gera o gráfico com todos os dados
    gerarGrafico(dadosPlanilha);
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
    mostrarAlerta("Erro ao carregar dados da planilha!");
  }
}

// Preenche a tabela com os dados passados
function preencherTabela(dados) {
  const tbody = document.querySelector("#dataTable tbody");
  tbody.innerHTML = "";
  
  if (dados.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center;">Nenhum dado filtrado.</td></tr>`;
    return;
  }
  
  dados.forEach(registro => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${registro.id}</td>
      <td>${registro.data}</td>
      <td>${registro.motivo}</td>
      <td>${registro.especificacao}</td>
      <td><span class="status-badge" data-status="${registro.status.toLowerCase()}">${registro.status}</span></td>
      <td>${formatarNomeLoja(registro.loja)}</td>
      <td>${registro.quantidade}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Função de filtragem que considera data e loja
function filtrarTabela() {
  const dataRange = document.getElementById("dataRange").value;
  const lojaSelecionada = document.getElementById("filtroLoja").value;
  const [start, end] = dataRange.split(" até ");
  
  const startDate = start ? parseDataBr(start) : null;
  const endDate = end ? parseDataBr(end) : null;
  
  const dadosFiltrados = dadosPlanilha.filter(registro => {
    const dataRegistro = parseDataBr(registro.data);
    if (!dataRegistro) return false;
    
    // Filtro por data
    const dataValida = (!startDate || dataRegistro >= startDate) && 
                       (!endDate || dataRegistro <= endDate);
    // Filtro por loja: se alguma loja estiver selecionada, só aceita registros com essa loja
    const lojaValida = !lojaSelecionada || registro.loja === lojaSelecionada;
    
    return dataValida && lojaValida;
  });
  
  preencherTabela(dadosFiltrados);
  gerarGrafico(dadosFiltrados);
}

// Gera o gráfico (bar chart) com os dados informados
function gerarGrafico(dados) {
  const ctx = document.getElementById("myChart").getContext('2d');
  const { motivos } = calcularEstatisticas(dados);

  // Se já existir um gráfico, destrói a instância anterior
  if (window.chartInstance) {
    window.chartInstance.destroy();
  }

  window.chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(motivos),
      datasets: [{
        label: 'Ocorrências',
        data: Object.values(motivos),
        backgroundColor: '#2196F3',
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: 'Distribuição de Ocorrências por Motivo',
          font: { size: 16 }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { precision: 0 }
        }
      }
    }
  });
}

// Calcula estatísticas básicas (quantidade de ocorrências por motivo)
function calcularEstatisticas(dados) {
  const motivos = {};
  let totalOcorrencias = 0;

  dados.forEach(registro => {
    const motivo = registro.motivo || 'Desconhecido';
    motivos[motivo] = (motivos[motivo] || 0) + 1;
    totalOcorrencias++;
  });

  return { motivos, totalOcorrencias };
}

// Função para formatação de nomes de lojas
function formatarNomeLoja(nome) {
  const formatacoes = {
    'Armazem': 'Armazém',
    '4pshopping': '4P Shopping',
    'Fastshop': 'Fast Shop'
  };
  return formatacoes[nome] || nome;
}

// Função para exibir alertas
function mostrarAlerta(mensagem) {
  alert(mensagem);
}

// As funções abaixo são relativas à geração de PDF e podem ser utilizadas se necessário

async function previewPDF() {
  try {
    const loja = document.getElementById("filtroLoja").value;
    const dadosFiltrados = filtrarDadosParaPDF(loja);
    
    if (dadosFiltrados.length === 0) {
      mostrarAlerta("Nenhum dado encontrado para esta loja!");
      return;
    }
    
    const doc = await gerarPDF(dadosFiltrados, loja);
    exibirPreviewPDF(doc);
    pdfGlobal = doc;
    
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    mostrarAlerta("Erro ao gerar o relatório!");
  }
}

async function gerarPDF(dadosFiltrados, lojaFiltro) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const margin = 15;
  let yPos = margin;
  const pageWidth = doc.internal.pageSize.getWidth();

  // Cabeçalho
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Relatório de Erros e Devolução", pageWidth / 2, yPos, { align: 'center' });
  yPos += 10;
  
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 15;

  // Informações de cabeçalho
  doc.setFontSize(12);
  const dataGeracao = new Date().toLocaleDateString('pt-BR');
  const nomeFiltro = lojaFiltro ? formatarNomeLoja(lojaFiltro) : "Todas as Lojas";
  doc.text(`Data: ${dataGeracao}`, margin, yPos);
  const filtroWidth = doc.getTextWidth(`Loja: ${nomeFiltro}`);
  doc.text(`Loja: ${nomeFiltro}`, pageWidth - margin - filtroWidth, yPos);
  yPos += 20;

  // Seção de Porcentagens
  const { motivos, totalOcorrencias } = calcularEstatisticas(dadosFiltrados);
  const porcentagens = calcularPorcentagens(motivos, totalOcorrencias);
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Análise de Percentual de Ocorrências:", margin, yPos);
  yPos += 10;

  const ocorrenciasOrdenadas = Object.entries(porcentagens)
    .sort(([, a], [, b]) => b - a);

  const principais = ocorrenciasOrdenadas.slice(0, 3);
  const outros = ocorrenciasOrdenadas.slice(3).reduce((acc, [, p]) => acc + p, 0);

  let resumoTexto = [
    "De acordo com o filtro selecionado, os principais motivos foram:",
    ...principais.map(([motivo, p]) => `• ${motivo}: ${p.toFixed(1)}%`),
    outros > 0 ? `• Outros motivos: ${outros.toFixed(1)}%` : ''
  ].join('\n');

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(resumoTexto, margin, yPos, {
    maxWidth: pageWidth - margin * 2,
    lineHeightFactor: 1.8
  });

  yPos += (resumoTexto.split('\n').length * 7) + 15;

  // Tabela
  const headers = [["ID", "Data", "Motivo", "Loja", "Quantidade"]];
  const rows = dadosFiltrados.map(item => [
    item.id,
    item.data,
    item.motivo,
    formatarNomeLoja(item.loja),
    item.quantidade
  ]);

  doc.autoTable({
    startY: yPos,
    head: headers,
    body: rows,
    theme: 'grid',
    styles: { 
      fontSize: 10,
      cellPadding: 3,
      halign: 'center'
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: 'bold'
    },
    margin: { left: margin, right: margin }
  });

  yPos = doc.lastAutoTable.finalY + 15;

  // Estatísticas Avançadas
  const { motivoMaisFrequente, dataMaisReclamacoes } = calcularEstatisticasAvancadas(dadosFiltrados);
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Principais Estatísticas:", margin, yPos);
  yPos += 10;
  
  doc.setFont("helvetica", "normal");
  doc.text(`• Motivo mais frequente: ${motivoMaisFrequente.motivo} (${motivoMaisFrequente.quantidade} ocorrências)`, margin, yPos);
  yPos += 10;
  doc.text(`• Data com mais registros: ${dataMaisReclamacoes.data} (${dataMaisReclamacoes.quantidade} ocorrências)`, margin, yPos);
  yPos += 20;

  // Gráfico para o PDF
  const canvas = await criarGraficoTemporario(dadosFiltrados);
  const imgData = canvas.toDataURL('image/png');
  const imgProps = doc.getImageProperties(imgData);
  const imgWidth = pageWidth - (margin * 2);
  const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

  doc.addImage(imgData, 'PNG', margin, yPos, imgWidth, imgHeight);
  yPos += imgHeight + 15;

  // Rodapé
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Este relatório foi gerado automaticamente. Em caso de dúvidas, contatar o analista responsável.", 
    pageWidth / 2, yPos, { align: 'center' });

  return doc;
}

function calcularPorcentagens(motivos, total) {
  return Object.entries(motivos).reduce((acc, [motivo, quantidade]) => {
    acc[motivo] = (quantidade / total) * 100;
    return acc;
  }, {});
}

function calcularEstatisticasAvancadas(dados) {
  const motivos = {};
  const datas = {};

  dados.forEach(registro => {
    const motivo = registro.motivo || 'Não informado';
    motivos[motivo] = (motivos[motivo] || 0) + 1;
    
    const data = registro.data || 'Data desconhecida';
    datas[data] = (datas[data] || 0) + 1;
  });

  const motivoMaisFrequente = Object.entries(motivos)
    .reduce((acc, [motivo, quantidade]) => 
      quantidade > acc.quantidade ? { motivo, quantidade } : acc, 
    { motivo: '', quantidade: 0 });

  const dataMaisReclamacoes = Object.entries(datas)
    .reduce((acc, [data, quantidade]) => 
      quantidade > acc.quantidade ? { data, quantidade } : acc, 
    { data: '', quantidade: 0 });

  return { motivoMaisFrequente, dataMaisReclamacoes };
}

async function criarGraficoTemporario(dados) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const { motivos } = calcularEstatisticas(dados);

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(motivos),
      datasets: [{
        label: 'Ocorrências',
        data: Object.values(motivos),
        backgroundColor: '#2980b9',
        borderWidth: 0
      }]
    },
    options: {
      responsive: false,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: 'Distribuição de Ocorrências por Motivo',
          font: { size: 14 }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { precision: 0 }
        }
      }
    }
  });

  return canvas;
}

function filtrarDadosParaPDF(loja) {
  return dadosPlanilha.filter(registro => 
    !loja || registro.loja === loja
  );
}

function exibirPreviewPDF(doc) {
  const pdfBlob = doc.output("blob");
  const url = URL.createObjectURL(pdfBlob);
  document.getElementById("previewPDF").src = url;
  document.getElementById("modalPreview").style.display = "block";
}

// Funções de UI para modais e PDF
function abrirModalPDF() {
  document.getElementById("modalPDF").style.display = "block";
}

function fecharModalPDF() {
  document.getElementById("modalPDF").style.display = "none";
}

function fecharPreviewPDF() {
  document.getElementById("modalPreview").style.display = "none";
}

function salvarPDF() {
  if (pdfGlobal) {
    const loja = document.getElementById("filtroLoja").value;
    const nome = `Relatorio_${loja || "Geral"}_${new Date().toISOString().slice(0,10)}.pdf`;
    pdfGlobal.save(nome);
  }
}

// Exporta funções para acesso global
window.filtrarTabela = filtrarTabela;
window.abrirModalPDF = abrirModalPDF;
window.fecharModalPDF = fecharModalPDF;
window.previewPDF = previewPDF;
window.fecharPreviewPDF = fecharPreviewPDF;
window.salvarPDF = salvarPDF;

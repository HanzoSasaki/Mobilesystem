// Variáveis globais para armazenar o motivo de erro com maior ocorrência e o total de ocorrências
let motivoMaisFrequente = "";
let maiorCount = 0;
let totalOcorrencias = 0;

document.addEventListener("DOMContentLoaded", function () {
  carregarDadosPlanilha();
});

// URL da sua planilha pública no formato CSV
const planilhaURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTxtg1eIAjlrA3A064lmdbR9-AczKj-ngXntN6Up1a4hQx-jTAeMV8pK406GmNXRQY3PtvtnE87PQVQ/pub?output=csv";

// Função para carregar os dados da planilha
function carregarDadosPlanilha() {
  fetch(planilhaURL)
      .then(response => response.text())
      .then(data => {
          const linhas = data.split("\n").map(linha => linha.split(","));
          preencherTabela(linhas.slice(1)); // Remove cabeçalhos
          gerarGrafico(linhas.slice(1));
      })
      .catch(error => console.error("Erro ao carregar a planilha:", error));
}

// Preencher a tabela HTML com os dados da planilha
function preencherTabela(linhas) {
  const tabela = document.getElementById("dataTable").getElementsByTagName('tbody')[0];
  tabela.innerHTML = ""; // Limpa a tabela antes de preencher

  linhas.forEach(linha => {
      let novaLinha = tabela.insertRow();
      let id = linha[0] || "N/A";
      let data = linha[1] || "N/A";
      let motivo = linha[2] || "N/A";
      let especificacao = linha[3] || "N/A";
      let status = linha[4] || "N/A";
      let loja = linha[5] || "N/A";
      let quantidade = linha[6] || "N/A";

      novaLinha.innerHTML = `
          <td>${id}</td>
          <td>${data}</td>
          <td>${motivo}</td>
          <td>${especificacao}</td>
          <td>${status}</td>
          <td>${loja}</td>
          <td>${quantidade}</td>
      `;
  });
}

// Gerar gráfico de motivos de erro mais frequentes
function gerarGrafico(linhas) {
  const motivos = {};

  linhas.forEach(linha => {
      let motivo = linha[2] || "Desconhecido";
      motivos[motivo] = (motivos[motivo] || 0) + 1;
  });

  // Calcula o total de ocorrências e identifica o motivo com maior ocorrência
  motivoMaisFrequente = "";
  maiorCount = 0;
  totalOcorrencias = 0;
  for (let motivo in motivos) {
    totalOcorrencias += motivos[motivo];
    if (motivos[motivo] > maiorCount) {
      maiorCount = motivos[motivo];
      motivoMaisFrequente = motivo;
    }
  }

  const ctx = document.getElementById("myChart").getContext("2d");

  new Chart(ctx, {
      type: "bar",
      data: {
          labels: Object.keys(motivos),
          datasets: [{
              label: "Ocorrências",
              data: Object.values(motivos),
              backgroundColor: "#007BFF",
              borderColor: "#0056b3",
              borderWidth: 1
          }]
      },
      options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
              y: {
                  beginAtZero: true
              }
          }
      }
  });
}

// Função para gerar o PDF do relatório (versão aprimorada)
function gerarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF('p', 'pt', 'a4');
  
  // Configurações gerais
  const margin = 40;
  let yPos = margin;
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Cabeçalho profissional
  doc.setFillColor(0, 123, 255);
  doc.rect(0, 0, pageWidth, 60, 'F');
  doc.setFontSize(18);
  doc.setTextColor(255);
  doc.text("Relatório de Taxa de Erros e Devolução", margin, 40);
  
  // Data formatada
  const dataFormatada = new Date().toLocaleDateString("pt-BR", {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
  });
  
  // Informações do relatório
  doc.setTextColor(0);
  doc.setFontSize(11);
  yPos += 30;
  doc.text(`Data do relatório: ${dataFormatada}`, margin, yPos);
  doc.text(`Total de ocorrências: ${totalOcorrencias}`, pageWidth - margin - 100, yPos, { align: 'right' });
  
  // Seção de insights
  yPos += 30;
  doc.setFontSize(14);
  doc.setTextColor(0, 123, 255);
  doc.text("Principais Insights", margin, yPos);
  
  // Box de destaque
  yPos += 20;
  const porcentagem = totalOcorrencias > 0 ? ((maiorCount / totalOcorrencias) * 100).toFixed(2) : 0;
  const insights = [
      `Motivo mais frequente: ${motivoMaisFrequente}`,
      `Ocorrências: ${maiorCount} (${porcentagem}%)`,
      `Total geral de registros: ${totalOcorrencias}`
  ];
  
  doc.setFillColor(240, 248, 255);
  doc.rect(margin, yPos - 10, pageWidth - 2 * margin, 50, 'F');
  doc.setFontSize(12);
  doc.setTextColor(0);
  insights.forEach((text, index) => {
      doc.text(text, margin + 10, yPos + (index * 15));
  });
  
  // Seção do gráfico
  yPos += 80;
  doc.setFontSize(14);
  doc.setTextColor(0, 123, 255);
  doc.text("Distribuição de Ocorrências", margin, yPos);
  
  // Adiciona gráfico
  const canvas = document.getElementById("myChart");
  if (canvas) {
      const imgData = canvas.toDataURL("image/png", 1.0);
      const imgWidth = pageWidth - 2 * margin;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      doc.addImage(imgData, 'PNG', margin, yPos + 10, imgWidth, imgHeight);
      yPos += imgHeight + 30;
  }
  
  // Tabela de dados
  doc.setFontSize(14);
  doc.setTextColor(0, 123, 255);
  doc.text("Detalhamento das Ocorrências", margin, yPos);
  
  doc.autoTable({
      html: "#dataTable",
      startY: yPos + 10,
      margin: { left: margin, right: margin },
      headStyles: { 
          fillColor: [0, 123, 255],
          textColor: 255,
          fontSize: 10
      },
      bodyStyles: { fontSize: 9 },
      styles: { overflow: 'linebreak' },
      columnStyles: {
          0: { cellWidth: 40 },
          1: { cellWidth: 60 },
          6: { cellWidth: 30 }
      },
      theme: 'grid'
  });
  
  // Rodapé
  const finalY = doc.lastAutoTable.finalY + 20;
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Relatório gerado automaticamente pelo sistema - Confidencial", margin, finalY);
  doc.text(`Página 1/1`, pageWidth - margin, finalY, { align: 'right' });
  
  // Salva o PDF
  doc.save(`Relatorio_Erros_${dataFormatada.replace(/\//g, '-')}.pdf`);
}
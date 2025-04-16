const TSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSLMvW_H4myKI7V-V8jdljuss8Ck-bfHlGEsiTF04CBwvmTd6MM0XFTi_6lEce69ZZhlb7pmaxN_xh1/pub?output=tsv";

fetch(TSV_URL)
  .then(response => response.text())
  .then(tsv => {
    const linhas = tsv.trim().split('\n').map(linha => linha.split('\t'));
    const cabecalho = linhas[0];

    const idxData = cabecalho.findIndex(col => col.toLowerCase().includes("data"));
    const idxLucro = cabecalho.findIndex(col => col.toLowerCase().includes("lucro"));
    const idxValor = cabecalho.findIndex(col => col.toLowerCase().includes("valor"));

    if (idxData === -1 || idxValor === -1 || idxLucro === -1) {
      throw new Error('Coluna "Data", "Valor" ou "Lucro" não encontrada.');
    }

    const totaisPorDia = {};

    for (let i = 1; i < linhas.length; i++) {
      const linha = linhas[i];
      const dataCompleta = linha[idxData]?.trim();
      if (!dataCompleta) continue;

      const data = dataCompleta.split(' ')[0];
      const valor = parseFloat(linha[idxValor]?.replace(',', '.'));
      if (isNaN(valor)) continue;

      const lucro = parseFloat(linha[idxLucro]?.replace(',', '.')) || 0;

      if (!totaisPorDia[data]) {
        totaisPorDia[data] = { total: 0, count: 0, margem: 0 };
      }

      totaisPorDia[data].total += valor;
      totaisPorDia[data].margem += lucro;
      totaisPorDia[data].count += 1;
    }

    let htmlTotais = "<table><thead><tr><th>Data</th><th>Total Carregado</th><th>Margem Bruta</th><th>Total de Itens</th></tr></thead><tbody>";
    Object.keys(totaisPorDia).sort().forEach(data => {
      const { total, count, margem } = totaisPorDia[data];
      htmlTotais += `
        <tr>
          <td>${data}</td>
          <td>R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
          <td>R$ ${margem.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
          <td>${count}</td>
        </tr>
      `;
    });
    htmlTotais += "</tbody></table>";

    document.getElementById("resumoTotais").innerHTML = htmlTotais;
  })
  .catch(err => {
    console.error(err);
    document.getElementById("resumoTotais").innerHTML = '<div class="erro">Erro ao carregar os dados.</div>';
  });
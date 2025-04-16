 // Coloque aqui o link CSV da sua planilha (certifique-se de que a planilha esteja publicada)
 const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSLMvW_H4myKI7V-V8jdljuss8Ck-bfHlGEsiTF04CBwvmTd6MM0XFTi_6lEce69ZZhlb7pmaxN_xh1/pub?output=csv";

 fetch(CSV_URL)
   .then(response => response.text())
   .then(csv => {
     // Divide o conteúdo em linhas, considerando que o separador de colunas é a vírgula
     const linhas = csv.trim().split('\n').map(linha => linha.split(','));
     const cabecalho = linhas[0];

     // Identifica os índices das colunas "Data" e "Valor pedido"
     const idxData = cabecalho.findIndex(col => col.toLowerCase().includes("data"));
     const idxValor = cabecalho.findIndex(col => col.toLowerCase().includes("valor"));

     if (idxData === -1 || idxValor === -1) {
       throw new Error('Coluna "Data" ou "Valor" não encontrada.');
     }

     // Objeto para agrupar os totais por dia com os seguintes dados:
     // total -> soma dos valores; count -> quantidade de itens
     const totaisPorDia = {};

     // Itera sobre cada linha (exceto o cabeçalho)
     for (let i = 1; i < linhas.length; i++) {
       const linha = linhas[i];
       const dataCompleta = linha[idxData]?.trim();
       if (!dataCompleta) continue;
       // Para o formato "YYYY-MM-DD HH:mm", pegamos somente a parte da data
       const data = dataCompleta.split(' ')[0];

       // Converte o valor de "Valor pedido" para número (aceita tanto vírgula quanto ponto)
       const valor = parseFloat(linha[idxValor]?.replace(',', '.'));
       if (isNaN(valor)) continue;

       if (!totaisPorDia[data]) {
         totaisPorDia[data] = { total: 0, count: 0 };
       }
       totaisPorDia[data].total += valor;
       totaisPorDia[data].count += 1;
     }

     // Cria a tabela resumo com as colunas: Data, Total Carregado e Total de Itens
     let htmlTotais = "<table><thead><tr><th>Data</th><th>Total Carregado</th><th>Total de Itens</th></tr></thead><tbody>";
     Object.keys(totaisPorDia).sort().forEach(data => {
       const { total, count } = totaisPorDia[data];
       htmlTotais += `
         <tr>
           <td>${data}</td>
           <td>R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
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
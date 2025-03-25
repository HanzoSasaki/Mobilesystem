let resultados = [];
let dadosFixos = []; // Armazena os dados da planilha

function openModal(modalId) {
  document.getElementById('modal' + modalId).style.display = "block";
}

function closeModal(modalId) {
  document.getElementById('modal' + modalId).style.display = "none";
}

// Fechar o modal clicando fora da área do conteúdo
window.onclick = function(event) {
  if (event.target.className === "modal") {
    event.target.style.display = "none";
  }
}

// Função para mostrar o loader
function mostrarLoader() {
  const loader = document.getElementById('loader');
  loader.style.visibility = 'visible';
  loader.style.opacity = '1';
}

// Função para ocultar o loader
function ocultarLoader() {
  const loader = document.getElementById('loader');
  loader.style.opacity = '0';
  setTimeout(() => {
    loader.style.visibility = 'hidden';
  }, 500); // Espera o fade-out terminar
}

// Função auxiliar para converter "DD/MM/AAAA" para um número (AAAAMMDD) para comparação
function converterParaNumero(data) {
  let [dia, mes, ano] = data.split("/");
  return parseInt(ano + mes + dia);
}

// Função para encontrar a última data disponível dos resultados
function obterUltimaData(resultados) {
  let ultimaData = "";
  let maiorNumero = 0;
  resultados.forEach(item => {
    const dataItem = item[13]; // coluna de data
    if (dataItem) {
      const dataNum = converterParaNumero(dataItem);
      if (dataNum > maiorNumero) {
        maiorNumero = dataNum;
        ultimaData = dataItem;
      }
    }
  });
  return ultimaData;
}

// Função para carregar a planilha fixa
function carregarPlanilha() {
  mostrarLoader(); // Mostra o loader ao iniciar o carregamento
  
  fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vTtvK3X3YMZzQe3M1I5lz6AkpNcdR8RomqEPefP_meogRr3LeZXELjeHajUYf4Cv_lFItd7YFf84NLf/pub?gid=265979275&single=true&output=csv')
    .then(response => response.text())
    .then(data => {
      Papa.parse(data, {
        complete: function (result) {
          resultados = result.data;
          // Remove a linha de cabeçalho e linhas vazias
          resultados = resultados.slice(1).filter(row => row.length > 1);
          dadosFixos = resultados.map(row => [...row]);
          
          calcularMargens(resultados);
          calcularMargemTotalEMedia(resultados);
          
          // Exibir apenas os dados do último dia disponível
          const ultimaData = obterUltimaData(resultados);
          const resultadosUltimoDia = resultados.filter(item => item[13] === ultimaData);
          exibirResultados(resultadosUltimoDia);
          
          ocultarLoader(); // Oculta o loader ao terminar o processamento
        },
        header: false,
        skipEmptyLines: true
      });
    })
    .catch(error => {
      console.error("Erro ao carregar a planilha:", error);
      ocultarLoader(); // Oculta o loader em caso de erro
    });
}

function calcularMargens(resultados) {
  resultados.forEach(item => {
    let custo = parseFloat(item[3].replace('R$', '').replace(',', '.')) || 0;
    let precoVenda = parseFloat(item[4].replace('R$', '').replace(',', '.')) || 0;
    const imposto = parseFloat(item[5].replace('%', '').replace(',', '.')) / 100 || 0;
    const comissao = parseFloat(item[6].replace('%', '').replace(',', '.')) / 100 || 0;
    let taxaPedidos = parseFloat(item[7].replace('R$', '').replace(',', '.')) || 0;

    const impostoValor = imposto * precoVenda;
    const comissaoValor = comissao * precoVenda;
    const totalDespesas = impostoValor + comissaoValor + taxaPedidos;

    const margemLiquida = precoVenda - custo - totalDespesas;
    const margemPercentual = (margemLiquida / precoVenda) * 100;

    item.margemLiquida = isNaN(margemLiquida) ? 0 : margemLiquida;
    item.margemPercentual = isNaN(margemPercentual) ? 0 : margemPercentual;
  });
}

function calcularMargemTotalEMedia(resultados) {
  const margensLiquidas = resultados.map(item => item.margemLiquida);
  const margemLiquidaTotal = margensLiquidas.reduce((total, margem) => total + margem, 0);
  const mediaMargemTotal = margemLiquidaTotal / margensLiquidas.length;

  document.getElementById('margemLiquidaTotal').innerText = `Margem Líquida Total: R$ ${margemLiquidaTotal.toFixed(2)}`;
  document.getElementById('mediaMargemTotal').innerText = `Média da Margem Total: ${(mediaMargemTotal).toFixed(2)}%`;
}

function exibirResultados(resultados) {
  const tbody = document.querySelector('#resultTable tbody');
  tbody.innerHTML = ''; // Limpar a tabela antes de adicionar os novos dados

  resultados.forEach(item => {
    // Converte as colunas 11 e 12 para número, removendo qualquer possível caractere de 'R$' ou ',' 
    const margemLiquida = parseFloat(item[11].replace('R$', '').replace(',', '.')) || 0;  // Para margem líquida R$
    const margemPercentual = parseFloat(item[12].replace('%', '').replace(',', '.')) || 0;  // Para margem percentual (%)
    const porcentagemColuna14 = parseFloat(item[14].replace('%', '').replace(',', '.')) || 0;  // Para a porcentagem da coluna 14

    // Lógica para definir a cor com base nos valores das colunas 11 e 12
    const corMargemLiquida = margemLiquida < 0 ? 'color: red;' : 'color: green;';
    const corMargemPercentual = margemPercentual < 0 ? 'color: red; font-weight: bold;' : 'color: green; font-weight: bold;';

    const corManterAlterar = item[16].toLowerCase() === 'alterar' ? 'color: red; font-weight: bold;' : (item[16].toLowerCase() === 'manter' ? 'color: green; font-weight: bold;' : '');
    const corColuna14 = porcentagemColuna14 > 0 ? 'color: red; font-weight: bold;' : '';
    const corFundoLinha = item[16].toLowerCase() === 'alterar' ? 'background-color: #FFDDDD;' : 
                         (item[16].toLowerCase() === 'manter' ? 'background-color: #DFFFD6;' : '');

    const row = document.createElement('tr');
    row.style = corFundoLinha;
    row.innerHTML = `
      <td>${item[0]}</td>                                  <!-- número de pedido               -->
      <td>${item[1]}</td>                                  <!-- Nome produto                   -->
      <td>${item[2]}</td>                                  <!-- variação do produto            -->
      <td>${item[17]}</td>                                 <!-- quantidade                     -->
      <td>${item[10]}</td>                                 <!-- loja                           -->
      <td>${item[4]}</td>                                  <!-- custo real                     -->
      <td>${item[5]}</td>                                  <!-- preço venda                    -->
      <td style="${corMargemPercentual}">${item[11]}</td>   <!-- Coluna 11 (Margem Líquida)     -->
      <td style="${corMargemPercentual}">${item[12]}</td>   <!-- Coluna 12 (Margem Percentual)  -->
      <td>${item[13]}</td>                                 <!-- Coluna 13 (DATA)               -->
      <td style="${corColuna14}">${item[14]}</td>           <!-- Coluna 14 (Porcentagem)        -->
      <td style="${corManterAlterar}">${item[16]}</td>        <!-- Coluna 16 (Alterar/Mantener)   -->
      <td style="font-weight: bold;">${item[18]}</td>        <!-- OBS                          -->
    `;
    tbody.appendChild(row);
  });
}

document.querySelectorAll('.copy-link').forEach(link => {
  link.addEventListener('click', function(event) {
      event.preventDefault();  // Impede a navegação padrão do link

      // Cria um campo de input temporário
      const tempInput = document.createElement('input');
      document.body.appendChild(tempInput);
      tempInput.value = this.textContent;  // Define o valor do input como o conteúdo da célula
      tempInput.select();
      document.execCommand('copy');  // Copia o conteúdo para a área de transferência
      document.body.removeChild(tempInput);  // Remove o campo de input temporário

      alert('Texto copiado para a área de transferência!');
  });
});

// Função para filtrar dados pelo input de busca
function filtrarDados(filtro) {
  const resultadosFiltrados = dadosFixos.filter(item => {
    return item.some(valor => valor.toString().toLowerCase().includes(filtro.toLowerCase()));
  });
  exibirResultados(resultadosFiltrados);
}

function filtrar() {
  const filtro = document.getElementById('busca').value;
  filtrarDados(filtro);
}

carregarPlanilha();

// Exibe o botão quando o usuário rola para baixo
window.onscroll = function() {
  let scrollToTopBtn = document.getElementById("scrollToTopBtn");
  if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
    scrollToTopBtn.style.display = "block";  // Exibe o botão
  } else {
    scrollToTopBtn.style.display = "none";  // Esconde o botão
  }
};

// Função para rolar até o topo
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'  // Animação suave ao subir
  });
}

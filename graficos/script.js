document.addEventListener('DOMContentLoaded', () => {
  // Objeto com os dados dos gráficos para cada item
  // Cada gráfico possui título, descrição e URL do iframe
  const graphsData = {

    // array para criar um card onde é possivel armazenar um grafico titulo e descrição de forma organizada
    item1: [
      { title: "MARGEM LIQUIDA DIARIA", description: "Esse grafico analisa em tempo real como esta o desempenho das vendas sem direcionar a margem liquida", url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTtvK3X3YMZzQe3M1I5lz6AkpNcdR8RomqEPefP_meogRr3LeZXELjeHajUYf4Cv_lFItd7YFf84NLf/pubchart?oid=1548790145&format=interactive" },
      { title: "MARGEM BRUTA DIARIA", description: "analise diaria bruta onde não são descontados o custo do produto para retirar a visão liquida", url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTtvK3X3YMZzQe3M1I5lz6AkpNcdR8RomqEPefP_meogRr3LeZXELjeHajUYf4Cv_lFItd7YFf84NLf/pubchart?oid=1548790145&format=interactive" },
      { title: "MARGEM LIQUIDA DIARIA (MEIA NOTA)", description: "Esse grafico analisa em tempo real como esta o desempenho das vendas sem direcionar a margem liquida", url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTtvK3X3YMZzQe3M1I5lz6AkpNcdR8RomqEPefP_meogRr3LeZXELjeHajUYf4Cv_lFItd7YFf84NLf/pubchart?oid=1332090060&format=interactive" },
      { title: "MARGEM BRUTA DIARIA (MEIA NOTA)", description: "analise diaria bruta onde não são descontados o custo do produto para retirar a visão liquida", url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTtvK3X3YMZzQe3M1I5lz6AkpNcdR8RomqEPefP_meogRr3LeZXELjeHajUYf4Cv_lFItd7YFf84NLf/pubchart?oid=1407307787&format=interactive" },
      { title: "MARGEM TOTAL BRUTA (R$)", description: "calculo de ganhos totais ( baseado em ganho bruto", url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTtvK3X3YMZzQe3M1I5lz6AkpNcdR8RomqEPefP_meogRr3LeZXELjeHajUYf4Cv_lFItd7YFf84NLf/pubchart?oid=1639112706&format=interactive" },
      { title: "MARGEM TOTAL LIQUIDA (R$)", description: "calculo de ganhos totais ( baseado em ganho liquido", url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTtvK3X3YMZzQe3M1I5lz6AkpNcdR8RomqEPefP_meogRr3LeZXELjeHajUYf4Cv_lFItd7YFf84NLf/pubchart?oid=2041554572&format=interactive" },
      { title: "MARGEM TOTAL (%)", description: "porcentagem de margem baseados no desempenho da empresa ( precisão de 100%)", url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTtvK3X3YMZzQe3M1I5lz6AkpNcdR8RomqEPefP_meogRr3LeZXELjeHajUYf4Cv_lFItd7YFf84NLf/pubchart?oid=1297207589&format=interactive" }

    ],

    item2: [

      // avaliação de custo ( apenas graficos com relatorio de custo nessa area)

      { title: "Custo total por mês", description: "Valor gasto em CUSTO por mês pondendo compara redução de gastos ou aumento dos mesmos", url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTtvK3X3YMZzQe3M1I5lz6AkpNcdR8RomqEPefP_meogRr3LeZXELjeHajUYf4Cv_lFItd7YFf84NLf/pubchart?oid=242395382&format=interactive" },
      { title: "Comparação entre Custo e entradas", description: "Grafico que compara entrada e saida ( custo de produtos vendidos) de forma resumida", url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTtvK3X3YMZzQe3M1I5lz6AkpNcdR8RomqEPefP_meogRr3LeZXELjeHajUYf4Cv_lFItd7YFf84NLf/pubchart?oid=254614342&format=interactive" },
      { title: "Visão de custos cobertos", description: "Grafico comparativo para verificar lucro bruto, lucro liquido, e custos de operações ", url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTtvK3X3YMZzQe3M1I5lz6AkpNcdR8RomqEPefP_meogRr3LeZXELjeHajUYf4Cv_lFItd7YFf84NLf/pubchart?oid=13510029&format=interactive" },
      { title: "Comparação de desempenho (LUCRO)", description: "Com esse grafico é possivel ver o desempenho entre meses, em um pequeno relatorio março em 18 dias passou o mes de fevereiro todo ou seja, 10 dias de diferença em lucro, sendo isso muito positivo fazendo março ter 13 dias em superação de lucro podendo chegar a quase 200% do valor de lucro liquido de fev", url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTtvK3X3YMZzQe3M1I5lz6AkpNcdR8RomqEPefP_meogRr3LeZXELjeHajUYf4Cv_lFItd7YFf84NLf/pubchart?oid=1968396041&format=interactive" },


    ],

    item3: [

      // avaliação comparativa (comparação entre meses nessa area e relatorio de desempenho global)

      { title: "Comparativo entre meses ( LUCRO LIQUIDO )", description: "Grafico Responsavel por ver crescimendo do lucro liquido entre os meses.", url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTtvK3X3YMZzQe3M1I5lz6AkpNcdR8RomqEPefP_meogRr3LeZXELjeHajUYf4Cv_lFItd7YFf84NLf/pubchart?oid=920974288&format=interactive" },
      { title: "Comparativo entre meses ( LUCRO BRUTO )", description: "Grafico Responsavel por ver crescimento do lucro bruto entre os meses.", url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTtvK3X3YMZzQe3M1I5lz6AkpNcdR8RomqEPefP_meogRr3LeZXELjeHajUYf4Cv_lFItd7YFf84NLf/pubchart?oid=245168936&format=interactive" },
      { title: "Comparativo entre meses ( LUCRO EM (%) )", description: "Grafico Responsavel por ver crescimento do lucro em (%).", url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTtvK3X3YMZzQe3M1I5lz6AkpNcdR8RomqEPefP_meogRr3LeZXELjeHajUYf4Cv_lFItd7YFf84NLf/pubchart?oid=4865653&format=interactive" },



    ],

    item4: [
      // analise fev
      { title: "Desempenho Global Bruto Fev", description: "Desempenho Global sobre o lucro bruto de Fevereiro comparando as 3 lojas e entregando o resultado total.", url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTtvK3X3YMZzQe3M1I5lz6AkpNcdR8RomqEPefP_meogRr3LeZXELjeHajUYf4Cv_lFItd7YFf84NLf/pubchart?oid=1417539863&format=interactive" },
      { title: "Desempenho Global Liquido Fev", description: "Desempenho Global sobre o lucro liquido de Fevereiro comparando as 3 lojas e entregando resultado total.", url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTtvK3X3YMZzQe3M1I5lz6AkpNcdR8RomqEPefP_meogRr3LeZXELjeHajUYf4Cv_lFItd7YFf84NLf/pubchart?oid=2141014369&format=interactive" },
      { title: "Desempenho FastShop Fev", description: "Desempenho da Fastshop no mes de Fevereiro.", url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTtvK3X3YMZzQe3M1I5lz6AkpNcdR8RomqEPefP_meogRr3LeZXELjeHajUYf4Cv_lFItd7YFf84NLf/pubchart?oid=2065557381&format=interactive" },
      { title: "Desempenho 4pshopping Fev", description: "Desempenho da 4pshopping no mes de Fevereiro.", url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTtvK3X3YMZzQe3M1I5lz6AkpNcdR8RomqEPefP_meogRr3LeZXELjeHajUYf4Cv_lFItd7YFf84NLf/pubchart?oid=381605449&format=interactive" },
      { title: "Desempenho Armazem Fev", description: "Desempenho do Armazem no mes de Fevereiro.", url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTtvK3X3YMZzQe3M1I5lz6AkpNcdR8RomqEPefP_meogRr3LeZXELjeHajUYf4Cv_lFItd7YFf84NLf/pubchart?oid=590794491&format=interactive" },


    ],
    item5: [

      // analise mar
      { title: "Desempenho Global Bruto Mar", description: "Desempenho Global sobre o lucro bruto de Março comparando as 3 lojas e entregando o resultado total.", url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTtvK3X3YMZzQe3M1I5lz6AkpNcdR8RomqEPefP_meogRr3LeZXELjeHajUYf4Cv_lFItd7YFf84NLf/pubchart?oid=1824049677&format=interactive" },
      { title: "Desempenho Global Liquido Mar", description: "Desempenho Global sobre o lucro liquido de Março comparando as 3 lojas e entregando resultado total.", url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTtvK3X3YMZzQe3M1I5lz6AkpNcdR8RomqEPefP_meogRr3LeZXELjeHajUYf4Cv_lFItd7YFf84NLf/pubchart?oid=1654114998&format=interactive" },
      { title: "Desempenho Fastshop Mar", description: "Desempenho da Fastshop no mes de Março.", url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTtvK3X3YMZzQe3M1I5lz6AkpNcdR8RomqEPefP_meogRr3LeZXELjeHajUYf4Cv_lFItd7YFf84NLf/pubchart?oid=725685167&format=interactive" },
      { title: "Desempenho 4pshopping Mar", description: "Desempenho da 4pshopping no mes de Março.", url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTtvK3X3YMZzQe3M1I5lz6AkpNcdR8RomqEPefP_meogRr3LeZXELjeHajUYf4Cv_lFItd7YFf84NLf/pubchart?oid=1833775770&format=interactive" },
      { title: "Desempenho Armazem Mar", description: "Desempenho do Armazem no mes de Março.", url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTtvK3X3YMZzQe3M1I5lz6AkpNcdR8RomqEPefP_meogRr3LeZXELjeHajUYf4Cv_lFItd7YFf84NLf/pubchart?oid=36390683&format=interactive" },



    ],
 

//  meia nota a baixo
    item16: [

    //  comparativa

      { title: "Comparativo entre meses ( LUCRO LIQUIDO )", description: "Grafico Responsavel por ver crescimendo do lucro liquido entre os meses.", url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTtvK3X3YMZzQe3M1I5lz6AkpNcdR8RomqEPefP_meogRr3LeZXELjeHajUYf4Cv_lFItd7YFf84NLf/pubchart?oid=3462284&format=interactive" },
      { title: "Comparativo entre meses ( LUCRO BRUTO )", description: "Grafico Responsavel por ver crescimento do lucro bruto entre os meses.", url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTtvK3X3YMZzQe3M1I5lz6AkpNcdR8RomqEPefP_meogRr3LeZXELjeHajUYf4Cv_lFItd7YFf84NLf/pubchart?oid=1849107478&format=interactive" },
      { title: "Comparativo entre meses ( LUCRO EM (%) )", description: "Grafico Responsavel por ver crescimento do lucro em (%).", url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTtvK3X3YMZzQe3M1I5lz6AkpNcdR8RomqEPefP_meogRr3LeZXELjeHajUYf4Cv_lFItd7YFf84NLf/pubchart?oid=1868001360&format=interactive" },
      { title: "Total Bruto", description: "Grafico Responsavel por mostrar o desempenho somado entre todos os meses atualizando em tempo real margem bruta.", url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTtvK3X3YMZzQe3M1I5lz6AkpNcdR8RomqEPefP_meogRr3LeZXELjeHajUYf4Cv_lFItd7YFf84NLf/pubchart?oid=1868001360&format=interactive" },
      { title: "Total Liquido", description: "Grafico Responsavel por mostrar o desempenho somado entre todos os meses atualizando em tempo real margem Liquida.", url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTtvK3X3YMZzQe3M1I5lz6AkpNcdR8RomqEPefP_meogRr3LeZXELjeHajUYf4Cv_lFItd7YFf84NLf/pubchart?oid=1868001360&format=interactive" },




    ],



    item17: [

      // analise mes de fevereiro

      { title: "Desempenho Global Bruto Fev", description: "Desempenho Global sobre o lucro bruto de Fevereiro comparando as 3 lojas e entregando o resultado total.", url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTtvK3X3YMZzQe3M1I5lz6AkpNcdR8RomqEPefP_meogRr3LeZXELjeHajUYf4Cv_lFItd7YFf84NLf/pubchart?oid=57948653&format=interactive" },
      { title: "Desempenho Global Liquido Fev", description: "Desempenho Global sobre o lucro liquido de Fevereiro comparando as 3 lojas e entregando resultado total.", url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTtvK3X3YMZzQe3M1I5lz6AkpNcdR8RomqEPefP_meogRr3LeZXELjeHajUYf4Cv_lFItd7YFf84NLf/pubchart?oid=2005556126&format=interactive" },
      { title: "Desempenho FastShop Fev", description: "Desempenho da Fastshop no mes de Fevereiro.", url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTtvK3X3YMZzQe3M1I5lz6AkpNcdR8RomqEPefP_meogRr3LeZXELjeHajUYf4Cv_lFItd7YFf84NLf/pubchart?oid=1868747347&format=interactive" },
      { title: "Desempenho 4pshopping Fev", description: "Desempenho da 4pshopping no mes de Fevereiro.", url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTtvK3X3YMZzQe3M1I5lz6AkpNcdR8RomqEPefP_meogRr3LeZXELjeHajUYf4Cv_lFItd7YFf84NLf/pubchart?oid=517184150&format=interactive" },
      { title: "Desempenho Armazem Fev", description: "Desempenho do Armazem no mes de Fevereiro.", url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTtvK3X3YMZzQe3M1I5lz6AkpNcdR8RomqEPefP_meogRr3LeZXELjeHajUYf4Cv_lFItd7YFf84NLf/pubchart?oid=891562439&format=interactive" },



    ],


    item18: [

    //  analise mes de março

      { title: "Desempenho Global Bruto Mar", description: "Desempenho Global sobre o lucro bruto de Março comparando as 3 lojas e entregando o resultado total.", url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTtvK3X3YMZzQe3M1I5lz6AkpNcdR8RomqEPefP_meogRr3LeZXELjeHajUYf4Cv_lFItd7YFf84NLf/pubchart?oid=339059910&format=interactive" },
      { title: "Desempenho Global Liquido Mar", description: "Desempenho Global sobre o lucro liquido de Março comparando as 3 lojas e entregando resultado total.", url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTtvK3X3YMZzQe3M1I5lz6AkpNcdR8RomqEPefP_meogRr3LeZXELjeHajUYf4Cv_lFItd7YFf84NLf/pubchart?oid=1012612885&format=interactive" },
      { title: "Desempenho Fastshop Mar", description: "Desempenho da Fastshop no mes de Março.", url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTtvK3X3YMZzQe3M1I5lz6AkpNcdR8RomqEPefP_meogRr3LeZXELjeHajUYf4Cv_lFItd7YFf84NLf/pubchart?oid=1252783054&format=interactive" },
      { title: "Desempenho 4pshopping Mar", description: "Desempenho da 4pshopping no mes de Março.", url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTtvK3X3YMZzQe3M1I5lz6AkpNcdR8RomqEPefP_meogRr3LeZXELjeHajUYf4Cv_lFItd7YFf84NLf/pubchart?oid=1245768309&format=interactive" },
      { title: "Desempenho Armazem Mar", description: "Desempenho do Armazem no mes de Março.", url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTtvK3X3YMZzQe3M1I5lz6AkpNcdR8RomqEPefP_meogRr3LeZXELjeHajUYf4Cv_lFItd7YFf84NLf/pubchart?oid=615885945&format=interactive" },




    ]






































  };

  const sidebarLinks = document.querySelectorAll('.sidebar a');
  const cardGrid = document.getElementById('graph-cards');

  // Elementos do modal
  const modal = document.getElementById('graph-modal');
  modal.style.display = 'none';
  const modalClose = modal.querySelector('.close');
  const modalTitle = document.getElementById('graph-title');
  const modalDescription = document.getElementById('graph-description');
  const modalIframe = document.getElementById('graph-iframe');

  // Função para carregar os cards de um item
  function loadCards(itemId) {
    cardGrid.innerHTML = "";
    const graphs = graphsData[itemId];
    if (!graphs || graphs.length === 0) {
      cardGrid.innerHTML = "<p>Nenhum gráfico encontrado para este item.</p>";
      return;
    }

    // Calcula o número de colunas para ter duas linhas (ou o mais próximo disso)
    const columns = Math.ceil(graphs.length / 2);
    // Define dinamicamente o grid com a quantidade calculada de colunas
    cardGrid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;

    graphs.forEach((graph) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `<h2>${graph.title}</h2><p>${graph.description}</p>`;
      card.addEventListener('click', () => {
        openModal(graph);
      });
      cardGrid.appendChild(card);
    });
  }

  document.querySelectorAll('.submenu-toggle').forEach(function(toggle) {
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentElement.classList.toggle('active');
    });
  });



  // Abre o modal e carrega os dados do gráfico
  function openModal(graph) {
    modalTitle.textContent = graph.title;
    modalDescription.textContent = graph.description;
    modalIframe.src = graph.url;
    modal.style.display = 'block';
  }

  // Fecha o modal e limpa o iframe
  function closeModal() {
    modal.style.display = 'none';
    modalIframe.src = "";
  }

  modalClose.addEventListener('click', closeModal);
  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  // Evento para os links da sidebar
  sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const itemId = link.getAttribute('data-item');
      loadCards(itemId);
    });
  });

  // Carrega o primeiro item por padrão (opcional)
  loadCards("item1");
});

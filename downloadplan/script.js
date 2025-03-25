  // Exibir a data atual no rodapé
  const downloadDateElement = document.getElementById("download-date");
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
  downloadDateElement.textContent = `Data atual: ${formattedDate}`;

  // Função para download de planilhas
  function downloadPlanilha(planilhaName) {
    alert(`Fazendo download de ${planilhaName}`);
    // Simulação: você deve substituir por uma URL válida onde as planilhas estejam hospedadas
    const link = document.createElement("a");
    link.href = `caminho/para/suas/planilhas/${planilhaName}`;
    link.download = planilhaName;
    link.click();
  }

  // Quando a página carregar, esconder o loader após 2-3 segundos
window.addEventListener('load', function() {
  setTimeout(function() {
      document.body.classList.add('loaded'); // Adiciona a classe 'loaded' para esconder o loader
  }, 2000); // Tempo do carregamento (em milissegundos), ajustável para 2000 ou 3000
});
// Função para adicionar efeitos de luz ao passar o mouse (opcional, caso precise de um efeito mais dinâmico)
const menuItems = document.querySelectorAll('.menu-item');

menuItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.6)';
    });

    item.addEventListener('mouseleave', () => {
        item.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
    });
});

document.getElementById("previsao-link").addEventListener("click", function(event) {
    event.preventDefault();
    document.getElementById("popup-overlay").style.display = "block";
});

document.getElementById("close-popup").addEventListener("click", function() {
    document.getElementById("popup-overlay").style.display = "none";
});

// Funções para o Modal de Configurações
function abrirConfigModal() {
    document.getElementById("config-modal").style.display = "flex";
  }
  
  function fecharConfigModal() {
    document.getElementById("config-modal").style.display = "none";
  }
  
  // Funções de exemplo (implemente conforme necessidade)
  function atualizarSistema() {
    alert("Sistema atualizado com sucesso!");
    fecharConfigModal();
  }
  
  function limparCache() {
    if(confirm("Tem certeza que deseja limpar o cache?")) {
      localStorage.clear();
      alert("Cache limpo com sucesso!");
    }
    fecharConfigModal();
  }
  
  function alterarTema() {
    document.body.classList.toggle("dark-theme");
    // Adicione aqui a lógica para salvar preferência do tema
  }
  
  function sairSistema() {
    if(confirm("Deseja realmente sair do sistema?")) {
      window.location.href = "logout.html"; // Altere para sua URL de logout
    }
  }
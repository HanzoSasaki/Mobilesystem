// Função para adicionar efeitos de luz (mantido se necessário)
const menuItems = document.querySelectorAll('.menu-item');

menuItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.6)';
    });

    item.addEventListener('mouseleave', () => {
        item.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
    });
});

// Modal Previsão (mantido)
document.getElementById("previsao-link").addEventListener("click", function(event) {
    event.preventDefault();
    document.getElementById("popup-overlay").style.display = "block";
});

document.getElementById("close-popup").addEventListener("click", function() {
    document.getElementById("popup-overlay").style.display = "none";
});

// Configurações (mantido)
function abrirConfigModal() { /* ... */ }
function fecharConfigModal() { /* ... */ }
function atualizarSistema() { /* ... */ }
function limparCache() { /* ... */ }
function alterarTema() { /* ... */ }
function sairSistema() { /* ... */ }

// Correção Principal: Controle de Menu e Iframe
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        const targetUrl = this.href;

        // Atualiza iframe
        document.getElementById('contentFrame').src = targetUrl;

        // Remove classe ativa de todos
        document.querySelectorAll('.nav-item').forEach(nav => {
            nav.classList.remove('active');
        });
        
        // Adiciona classe ativa no item clicado
        this.classList.add('active');
        
        // Atualiza URL no navegador (opcional)
        window.history.pushState({}, '', targetUrl);
    });
});

// Correção: Ativar item ao carregar página/iframe
window.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;
    
    document.querySelectorAll('.nav-item').forEach(item => {
        const itemPath = new URL(item.href).pathname;
        
        if (itemPath === currentPath) {
            item.classList.add('active');
        }
    });
});

// Correção extra: Sincronizar com navegação no iframe
document.getElementById('contentFrame').addEventListener('load', function() {
    const iframePath = this.contentWindow.location.pathname;
    
    document.querySelectorAll('.nav-item').forEach(item => {
        const itemPath = new URL(item.href).pathname;
        
        if (itemPath === iframePath) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
});
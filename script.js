// ==== [1. FUNÇÕES GLOBAIS] ==== //
// Função de formatação monetária segura
function formatCurrency(value) {
    try {
        return Number(value || 0).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    } catch (error) {
        console.error('Erro na formatação:', error);
        return 'R$ 0,00';
    }
}

// ==== [2. CONTROLE DE ESTADO] ==== //
let funcionarios = JSON.parse(localStorage.getItem("funcionarios")) || [];
let funcionarioEditando = null;

// Inicialização segura dos dados
function inicializarDados() {
    funcionarios = funcionarios.map(func => ({
        nome: func.nome || 'Não informado',
        salarioBase: Number(func.salarioBase) || 0,
        bonificacao: Number(func.bonificacao) || 0,
        faltas: Array.isArray(func.faltas) ? func.faltas : [],
        horasExtras: Array.isArray(func.horasExtras) ? func.horasExtras : []
    }));
    localStorage.setItem('funcionarios', JSON.stringify(funcionarios));
}

// ==== [3. CONTROLE DE INTERFACE] ==== //
document.addEventListener('DOMContentLoaded', () => {
    // Garante inicialização mesmo em iframes
    if (window.self === window.top) { // Somente na janela principal
        inicializarDados();
        setupMenu();
        setupSenha();
        setupModais();
    } else { // Código específico para iframes
        window.parent.postMessage({ type: 'iframeLoaded' }, '*');
    }
});
function setupMenu() {
    const sidebar = document.querySelector('.sidebar');
    const toggleButton = document.querySelector('.menu-toggle');

    if (toggleButton) {
        toggleButton.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    } else {
        console.warn('Botão .menu-toggle não encontrado no DOM.');
    }

    // Controle de itens do menu
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const targetUrl = this.href;

            document.querySelectorAll('.nav-item').forEach(nav => {
                nav.classList.remove('active');
            });
            this.classList.add('active');

            document.getElementById('contentFrame').src = targetUrl;
            sidebar.classList.remove('open');
        });
    });

    // Sincronização com iframe
    window.addEventListener('message', (e) => {
        if (e.data.type === 'updateMenu') {
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.toggle('active', item.href === e.data.url);
            });
        }
    });
}

// ==== [4. CONTROLE DE MENU/IFRAME] ==== //
function setupMenu() {
    const sidebar = document.querySelector('.sidebar');
    
    // Controle do menu hamburguer
    document.querySelector('.menu-toggle').addEventListener('click', toggleMenu);
    
    function toggleMenu() {
        sidebar.classList.toggle('open');
    }

    // Controle de itens do menu
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const targetUrl = this.href;
            
            document.querySelectorAll('.nav-item').forEach(nav => {
                nav.classList.remove('active');
            });
            this.classList.add('active');
            
            document.getElementById('contentFrame').src = targetUrl;
            sidebar.classList.remove('open');
        });
    });

    // Sincronização com iframe
    window.addEventListener('message', (e) => {
        if (e.data.type === 'updateMenu') {
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.toggle('active', item.href === e.data.url);
            });
        }
    });
}

// ==== [5. CONTROLE DE SEGURANÇA] ==== //
function setupSenha() {
    const senhaCorreta = "246851";
    const tempoBloqueio = 2 * 60 * 60 * 1000;
    const passwordModal = document.getElementById("password-modal");

    // Verificação inicial
    let ultimaVerificacao = localStorage.getItem("ultimaVerificacao");
    if (ultimaVerificacao && (Date.now() - ultimaVerificacao < tempoBloqueio)) {
        passwordModal.style.display = "none";
    } else {
        passwordModal.style.display = "flex";
    }

    // Event listeners
    document.getElementById("password-input").addEventListener("keyup", function(e) {
        if (e.key === "Enter") verificarSenha();
    });

    function verificarSenha() {
        const senha = document.getElementById("password-input").value;
        const errorMsg = document.getElementById("error-message");
        
        if (senha === senhaCorreta) {
            localStorage.setItem("ultimaVerificacao", Date.now());
            passwordModal.style.display = "none";
        } else {
            errorMsg.textContent = "Senha incorreta! Tente novamente.";
        }
    }
}

// ==== [6. CONTROLE DE MODAIS] ==== //
function setupModais() {
    // Modal Previsão
    document.getElementById("previsao-link").addEventListener("click", function(e) {
        e.preventDefault();
        document.getElementById("popup-overlay").style.display = "block";
    });

    document.getElementById("close-popup").addEventListener("click", function() {
        document.getElementById("popup-overlay").style.display = "none";
    });

    // Outros modais
    window.abrirModalUsers = function() {
        document.getElementById("users-modal").style.display = "flex";
    }

    window.fecharModalUsers = function() {
        document.getElementById("users-modal").style.display = "none";
    }
}

// ==== [7. FUNÇÕES COMPARTILHADAS] ==== //
// Disponibiliza funções globais para iframes
window.formatCurrency = formatCurrency;
window.funcionarios = funcionarios;
window.atualizarDados = function() {
    localStorage.setItem('funcionarios', JSON.stringify(funcionarios));
    window.parent.postMessage({ type: 'dataUpdated' }, '*');
};

// ==== [8. COMUNICAÇÃO ENTRE FRAMES] ==== //
// Atualiza o menu quando um iframe é carregado
window.addEventListener('message', (e) => {
    if (e.data.type === 'iframeLoaded') {
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            if (iframe.contentWindow === e.source) {
                const parentItem = [...document.querySelectorAll('.nav-item')]
                    .find(item => item.href === iframe.src);
                if (parentItem) parentItem.classList.add('active');
            }
        });
    }
});
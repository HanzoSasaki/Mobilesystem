// Elementos do sistema
const form = document.getElementById('form');
if (!form) throw new Error('Formulário não encontrado!');

const btnEnviar = form.querySelector('button[type="submit"]');
const animacaoSucesso = document.getElementById('animacao');
const mensagemErro = document.getElementById('mensagem');
const historicoList = document.getElementById('historicoList');

// Verificação de elementos essenciais
const elementosObrigatorios = {
    sku: document.getElementById('sku'),
    produto: document.getElementById('produto'),
    estoque: document.getElementById('estoque')
};

// Verificar se todos os campos existem
Object.entries(elementosObrigatorios).forEach(([nome, elemento]) => {
    if (!elemento) {
        throw new Error(`Campo '${nome}' não encontrado! Verifique o ID no HTML.`);
    }
});

// Configuração dos campos (agora seguro)
const campos = elementosObrigatorios;

// ... (o restante do código permanece igual ao anterior)
// Configuração do Web App

const scriptURL = 'https://script.google.com/macros/s/AKfycbyKD3AGd_vwN4Jus6jD78z1tssYZrvguxpCo5TC8vCU2BksHr14KXSEKUINaiVein6x/exec';
// Configurações do histórico
const HISTORICO_KEY = 'cadastros_recentes';
const VINTE_E_QUATRO_HORAS = 86400000;
const LIMITE_REGISTROS = 50;

// Controle de estado
let isEnviando = false;

// Funções de histórico
const salvarNoHistorico = (dados) => {
    const historico = JSON.parse(localStorage.getItem(HISTORICO_KEY)) || [];
    historico.unshift({
        ...dados,
        timestamp: Date.now()
    });
    localStorage.setItem(HISTORICO_KEY, JSON.stringify(historico.slice(0, LIMITE_REGISTROS)));
};

const carregarHistorico = () => {
    const historico = JSON.parse(localStorage.getItem(HISTORICO_KEY)) || [];
    return historico.filter(item => (Date.now() - item.timestamp) < VINTE_E_QUATRO_HORAS);
};

const formatarData = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const excluirDoHistorico = (timestamp) => {
    const historico = JSON.parse(localStorage.getItem(HISTORICO_KEY)) || [];
    const novoHistorico = historico.filter(item => item.timestamp !== timestamp);
    localStorage.setItem(HISTORICO_KEY, JSON.stringify(novoHistorico));
    atualizarListaHistorico();
};

const atualizarListaHistorico = () => {
    const historico = carregarHistorico();
    
    historicoList.innerHTML = historico.map(item => `
        <li class="historico-item" data-timestamp="${item.timestamp}">
            <div class="historico-info">
                <strong>${item.sku}</strong> - ${item.produto}
                <div>Estoque: ${item.estoque}</div>
            </div>
            <div class="historico-actions">
                <div class="historico-time">${formatarData(item.timestamp)}</div>
                <button class="btn-delete" title="Excluir registro">
                    🗑️
                </button>
            </div>
        </li>
    `).join('');

    // Eventos para botões de exclusão
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const timestamp = Number(btn.closest('.historico-item').dataset.timestamp);
            mostrarFeedback.confirmarExclusao(() => {
                excluirDoHistorico(timestamp);
            });
        });
    });
};

// Sistema de feedback
const mostrarFeedback = {
    sucesso: (dados) => {
        animacaoSucesso.style.display = 'block';
        salvarNoHistorico(dados);
        atualizarListaHistorico();
        
        setTimeout(() => {
            animacaoSucesso.style.display = 'none';
            form.reset();
        }, 2000);
    },
    
    erro: (mensagem) => {
        mensagemErro.textContent = mensagem;
        mensagemErro.className = 'error';
        setTimeout(() => {
            mensagemErro.textContent = '';
            mensagemErro.className = '';
        }, 5000);
    },
    
    confirmarExclusao: (callback) => {
        if (confirm('Deseja excluir este registro permanentemente?')) {
            callback();
        }
    }
};

// Validação do formulário
const validarFormulario = () => {
    let valido = true;
    
    Object.values(campos).forEach(campo => {
        const valor = campo.value.trim();
        if (!valor) {
            campo.classList.add('error');
            valido = false;
        } else {
            campo.classList.remove('error');
        }
    });
    
    return valido;
};

// Evento de envio
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (isEnviando) return;

    isEnviando = true;
    btnEnviar.classList.add('loading');

    try {
        if (!validarFormulario()) {
            throw new Error('Preencha todos os campos corretamente!');
        }

        const dadosEnviados = {
            sku: campos.sku.value.trim(),
            produto: campos.produto.value.trim(),
            estoque: campos.estoque.value.trim()
        };

        const formData = new FormData();
        Object.entries(dadosEnviados).forEach(([key, value]) => {
            formData.append(key, value);
        });

        const response = await fetch(scriptURL, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error('Falha na comunicação com o servidor');

        mostrarFeedback.sucesso(dadosEnviados);
    } catch (error) {
        mostrarFeedback.erro(error.message);
        console.error('Erro:', error);
    } finally {
        isEnviando = false;
        btnEnviar.classList.remove('loading');
    }
});

// Validação em tempo real
Object.values(campos).forEach(campo => {
    campo.addEventListener('input', () => {
        if (campo.value.trim()) {
            campo.classList.remove('error');
        }
    });
});

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    atualizarListaHistorico();
    setInterval(atualizarListaHistorico, 60000); // Atualiza a cada minuto
});
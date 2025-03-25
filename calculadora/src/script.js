let funcionarios = JSON.parse(localStorage.getItem("funcionarios")) || [];
funcionarios = funcionarios.map(func => ({
    ...func,
    faltas: func.faltas || [],
    horasExtras: func.horasExtras || [],
    bonificacao: func.bonificacao || 0
}));
let funcionarioEditando = null;

// Controle de Modais
function abrirModal(tipo) {
    document.getElementById(`modal${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`).style.display = 'flex';
}

function fecharModal(tipo) {
    document.getElementById(`modal${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`).style.display = 'none';
}

// Funções para Campos Dinâmicos
function adicionarFalta(containerId) {
    const container = document.getElementById(containerId);
    const novoGrupo = document.createElement('div');
    novoGrupo.className = 'item-flex';
    novoGrupo.innerHTML = `
        <input type="number" class="dias-falta" placeholder="Dias" min="0">
        <select class="com-atestado">
            <option value="nao">Sem atestado</option>
            <option value="sim">Com atestado</option>
        </select>
        <button type="button" class="btn btn-excluir" onclick="this.parentElement.remove()">×</button>
    `;
    container.appendChild(novoGrupo);
}

function adicionarHoraExtra(containerId) {
    const container = document.getElementById(containerId);
    const novoGrupo = document.createElement('div');
    novoGrupo.className = 'item-flex';
    novoGrupo.innerHTML = `
        <input type="number" class="horas-extra" placeholder="Horas">
        <select class="tipo-extra">
            <option value="50">50% (Dia útil)</option>
            <option value="100">100% (Feriado)</option>
            <option value="60">60% (Noturno)</option>
        </select>
        <button type="button" class="btn btn-excluir" onclick="this.parentElement.remove()">×</button>
    `;
    container.appendChild(novoGrupo);
}

// CRUD Funcionários
function adicionarFuncionario(event) {
    event.preventDefault();

    const novoFuncionario = {
        nome: document.getElementById('nomeCadastro').value,
        salarioBase: parseFloat(document.getElementById('salarioBaseCadastro').value),
        bonificacao: parseFloat(document.getElementById('bonificacaoCadastro').value) || 0,
        faltas: [],
        horasExtras: []
    };

    // Coletar Faltas
    document.querySelectorAll('#ausenciasContainer .item-flex').forEach(grupo => {
        novoFuncionario.faltas.push({
            dias: parseInt(grupo.querySelector('.dias-falta').value) || 0,
            atestado: grupo.querySelector('.com-atestado').value
        });
    });

    // Coletar Horas Extras
    document.querySelectorAll('#horasExtrasContainer .item-flex').forEach(grupo => {
        novoFuncionario.horasExtras.push({
            horas: parseFloat(grupo.querySelector('.horas-extra').value) || 0,
            percentual: parseFloat(grupo.querySelector('.tipo-extra').value) || 0
        });
    });

    funcionarios.push(novoFuncionario);
    atualizarDados();
    fecharModal('cadastro');
    limparFormulario('cadastro');
}

function editarFuncionario(index) {
    funcionarioEditando = index;
    const func = funcionarios[index];

    // Preencher dados básicos
    document.getElementById('editNome').value = func.nome;
    document.getElementById('editSalarioBase').value = func.salarioBase;
    document.getElementById('editBonificacao').value = func.bonificacao;

    // Preencher Faltas
    const editAusencias = document.getElementById('editAusenciasContainer');
    editAusencias.innerHTML = '';
    func.faltas.forEach(f => {
        adicionarFalta('editAusenciasContainer');
        const ultimoGrupo = editAusencias.lastElementChild;
        ultimoGrupo.querySelector('.dias-falta').value = f.dias;
        ultimoGrupo.querySelector('.com-atestado').value = f.atestado;
    });

    // Preencher Horas Extras
    const editHorasExtras = document.getElementById('editHorasExtrasContainer');
    editHorasExtras.innerHTML = '';
    func.horasExtras.forEach(h => {
        adicionarHoraExtra('editHorasExtrasContainer');
        const ultimoGrupo = editHorasExtras.lastElementChild;
        ultimoGrupo.querySelector('.horas-extra').value = h.horas;
        ultimoGrupo.querySelector('.tipo-extra').value = h.percentual;
    });

    abrirModal('edicao');
}

function salvarEdicao(event) {
    event.preventDefault();
    if (funcionarioEditando === null) return;

    const func = funcionarios[funcionarioEditando];

    // Atualizar dados básicos
    func.nome = document.getElementById('editNome').value;
    func.salarioBase = parseFloat(document.getElementById('editSalarioBase').value);
    func.bonificacao = parseFloat(document.getElementById('editBonificacao').value) || 0;

    // Atualizar Faltas
    func.faltas = [];
    document.querySelectorAll('#editAusenciasContainer .item-flex').forEach(grupo => {
        func.faltas.push({
            dias: parseInt(grupo.querySelector('.dias-falta').value) || 0,
            atestado: grupo.querySelector('.com-atestado').value
        });
    });

    // Atualizar Horas Extras
    func.horasExtras = [];
    document.querySelectorAll('#editHorasExtrasContainer .item-flex').forEach(grupo => {
        func.horasExtras.push({
            horas: parseFloat(grupo.querySelector('.horas-extra').value) || 0,
            percentual: parseFloat(grupo.querySelector('.tipo-extra').value) || 0
        });
    });

    atualizarDados();
    fecharModal('edicao');
}

function removerFuncionario(index) {
    if (confirm('Tem certeza que deseja excluir este funcionário?')) {
        funcionarios.splice(index, 1);
        atualizarDados();
    }
}

// Utilitários
function limparFormulario(tipo) {
    if (tipo === 'cadastro') {
        document.getElementById('nomeCadastro').value = '';
        document.getElementById('salarioBaseCadastro').value = '';
        document.getElementById('bonificacaoCadastro').value = '';
        document.getElementById('ausenciasContainer').innerHTML = '';
        document.getElementById('horasExtrasContainer').innerHTML = '';
        adicionarFalta('ausenciasContainer');
        adicionarHoraExtra('horasExtrasContainer');
    }
}

function atualizarDados() {
    localStorage.setItem('funcionarios', JSON.stringify(funcionarios));
    exibirFuncionarios();
}

// Exibição de Dados
function exibirFuncionarios() {
    const tbody = document.getElementById('tabelaFuncionarios');
    tbody.innerHTML = '';

    funcionarios.forEach((func, index) => {
        const calculo = calcularSalario(func);

        tbody.innerHTML += `
            <tr>
                <td>${func.nome}</td>
                <td>R$ ${func.salarioBase.toFixed(2)}</td>
                <td>${func.faltas.reduce((acc, f) => acc + f.dias, 0)}</td>
                <td>R$ ${calculo.descontos.toFixed(2)}</td>
                <td>R$ ${calculo.totalLiquido.toFixed(2)}</td>
                <td>
                    <div class="acoes-cell">
                        <button class="btn" onclick="editarFuncionario(${index})">Editar</button>
                        <button class="btn" onclick="gerarHolerite(${index})">Holerite</button>
                        <button class="btn btn-excluir" onclick="removerFuncionario(${index})">Excluir</button>
                    </div>
                </td>
            </tr>
        `;
    });
}

// Cálculos
function calcularSalario(func) {
    const diasUteis = parseInt(document.getElementById('diasUteis').value) || 22;
    const valorDia = func.salarioBase / diasUteis;

    // Descontos por Faltas
    let descontosFaltas = 0;
    func.faltas.forEach(f => {
        if (f.atestado === 'nao') descontosFaltas += f.dias * valorDia;
    });

    // Horas Extras
    let totalHorasExtras = 0;
    let valorTotalHE = 0;
    const valorHoraNormal = func.salarioBase / 160;
    func.horasExtras.forEach(h => {
        totalHorasExtras += h.horas;
        valorTotalHE += h.horas * valorHoraNormal * (1 + h.percentual / 100);
    });

    // Cálculos Legais
    const inss = calcularINSS(func.salarioBase);
    const irrf = calcularIRRF(func.salarioBase - inss);

    const totalDescontos = descontosFaltas + inss + irrf;
    const totalLiquido = (func.salarioBase - totalDescontos) + valorTotalHE + func.bonificacao;

    return {
        totalLiquido,
        descontos: totalDescontos,
        detalhes: {
            inss,
            irrf,
            descontosFaltas,
            totalHorasExtras,
            valorTotalHE,
            bonificacao: func.bonificacao
        }
    };
}

function calcularINSS(salario) {
    const tetoINSS = 8157.41;
    const faixas = [
        [0, 1518.00, 0.075],
        [1518.01, 2783.88, 0.09],
        [2783.89, 4190.83, 0.12],
        [4190.84, tetoINSS, 0.14]
    ];

    // Verifica se o salário ultrapassa o teto do INSS
    if (salario > tetoINSS) {
        // Calcula o desconto máximo aplicando todas as faixas até o teto
        let descontoMaximo = 0;
        for (const [min, max, aliquota] of faixas) {
            const base = max - min;
            descontoMaximo += base * aliquota;
        }
        return parseFloat(descontoMaximo.toFixed(2));
    }

    let desconto = 0;
    for (const [min, max, aliquota] of faixas) {
        if (salario > min) {
            // Calcula a base de contribuição na faixa atual
            const baseCalculo = Math.min(salario, max) - min;
            if (baseCalculo > 0) {
                desconto += baseCalculo * aliquota;
            }
        }
    }
    return parseFloat(desconto.toFixed(2));
}

function calcularIRRF(baseCalculo) {
    const faixas = [
        [0, 2112.00, 0, 0],
        [2112.01, 2826.65, 0.075, 158.40],
        [2826.66, 3751.05, 0.15, 370.40],
        [3751.06, 4664.68, 0.225, 651.73],
        [4664.69, Infinity, 0.275, 884.96]
    ];

    for (const [min, max, aliquota, deducao] of faixas) {
        if (baseCalculo >= min && baseCalculo <= max) {
            return Math.max((baseCalculo * aliquota) - deducao, 0);
        }
    }
    return 0;
}

/// Gerador de PDF
function gerarHolerite(index) {
    const { jsPDF } = window.jspdf;
    const func = funcionarios[index];
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    const calculo = calcularSalario(func);

    const doc = new jsPDF();

    // Cabeçalho
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("HOLERITE - Moras & Barbosa Ltda", 105, 20, { align: "center" });
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("CNPJ: 40.811.585/0001-44", 105, 28, { align: "center" });
    
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35); // Linha separadora
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Funcionário: ${func.nome}`, 20, 42);
    doc.text(`Data: ${dataAtual}`, 150, 42);

    // Tabela de Valores
    const dados = [
        ["Salário Base", `R$ ${func.salarioBase.toFixed(2)}`],
        ["Horas Extras", `R$ ${calculo.detalhes.valorTotalHE.toFixed(2)}`],
        ["Bonificação", `R$ ${calculo.detalhes.bonificacao.toFixed(2)}`],
        ["INSS", `R$ ${calculo.detalhes.inss.toFixed(2)}`],
        ["IRRF", `R$ ${calculo.detalhes.irrf.toFixed(2)}`],
        ["Descontos por Faltas", `R$ ${calculo.detalhes.descontosFaltas.toFixed(2)}`],
        [{ content: "TOTAL LÍQUIDO", styles: { fontStyle: 'bold' } }, { content: `R$ ${calculo.totalLiquido.toFixed(2)}`, styles: { fontStyle: 'bold', textColor: [0, 128, 0] } }]
    ];

    doc.autoTable({
        startY: 50,
        head: [["Descrição", "Valor (R$)"]],
        body: dados,
        theme: 'grid',
        headStyles: {
            fillColor: [255, 107, 53],
            textColor: [255, 255, 255],
            fontSize: 12
        },
        styles: {
            fontSize: 11,
            cellPadding: 4
        },
        columnStyles: {
            0: { cellWidth: 120 },
            1: { cellWidth: 60, halign: 'right' }
        }
    });

    // Declaração e Assinaturas
    const finalY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(10);
    doc.text(`Eu, ${func.nome}, declaro estar ciente que:`, 20, finalY);
    doc.text(`- Meu valor líquido é de R$ ${calculo.totalLiquido.toFixed(2)}`, 20, finalY + 5);
    doc.text(`- Total de horas extras: ${calculo.detalhes.totalHorasExtras}h`, 20, finalY + 10);
    doc.text(`- Valor total das horas extras: R$ ${calculo.detalhes.valorTotalHE.toFixed(2)}`, 20, finalY + 15);
    doc.text(`- Bonificação: R$ ${calculo.detalhes.bonificacao.toFixed(2)}`, 20, finalY + 20);

    // Assinaturas
    const assinaturaY = finalY + 30;
    doc.text("Assinatura do Funcionário: ___________________________", 20, assinaturaY);
    doc.text("Assinatura do Responsável: ___________________________", 20, assinaturaY + 10);
    doc.text(`Data: ${dataAtual}`, 160, assinaturaY + 10);

    // Rodapé informativo
    const rodapeY = 270;
    doc.setLineWidth(0.5);
    doc.line(20, rodapeY - 10, 190, rodapeY - 10); // Linha separadora acima do rodapé

    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text(
        "Este documento é um documento de ciência. Após assinado, todas as informações são oficializadas sem possibilidade de alteração.",
        105,
        rodapeY,
        { align: "center", maxWidth: 170 }
    );
    doc.text(
        "Verificar os valores antes de assinar é um direito do trabalhador. (Artigo 464 da CLT).",
        105,
        rodapeY + 8,
        { align: "center", maxWidth: 170 }
    );
    doc.text(
        "Nossa empresa segue todas as leis trabalhistas para garantir a segurança dos pagamentos e o bem-estar do funcionário.",
        105,
        rodapeY + 16,
        { align: "center", maxWidth: 170 }
    );

    doc.save(`Holerite_${func.nome}_${dataAtual.replace(/\//g, '-')}.pdf`);
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    adicionarFalta('ausenciasContainer');
    adicionarHoraExtra('horasExtrasContainer');
    exibirFuncionarios();
});


function getFifthBusinessDay(year, month) {
    let count = 0;
    let currentDate = new Date(year, month, 1);
    
    while (count < 5) {
        if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
            count++;
        }
        if (count < 5) {
            currentDate.setDate(currentDate.getDate() + 1);
        }
    }
    return currentDate;
}

function updateCard() {
    const card = document.getElementById("diaUtilCard");
    const today = new Date();
    let fifthBusinessDay = getFifthBusinessDay(today.getFullYear(), today.getMonth());
    
    if (today > fifthBusinessDay) {
        fifthBusinessDay = getFifthBusinessDay(today.getFullYear(), today.getMonth() + 1);
    }
    
    let formattedDate = fifthBusinessDay.toLocaleDateString("pt-BR");
    
    if (today.toDateString() === fifthBusinessDay.toDateString()) {
        card.classList.add("red");
    }
    
    card.textContent = "Próximo Quinto dia útil: " + formattedDate;
}

updateCard();
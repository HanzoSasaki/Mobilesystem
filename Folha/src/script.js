// Função utilitária para formatação de moeda
function formatCurrency(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

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

    document.querySelectorAll('#ausenciasContainer .item-flex').forEach(grupo => {
        novoFuncionario.faltas.push({
            dias: parseInt(grupo.querySelector('.dias-falta').value) || 0,
            atestado: grupo.querySelector('.com-atestado').value
        });
    });

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

    document.getElementById('editNome').value = func.nome;
    document.getElementById('editSalarioBase').value = func.salarioBase;
    document.getElementById('editBonificacao').value = func.bonificacao;

    const containerFaltas = document.getElementById('editAusenciasContainer');
    containerFaltas.innerHTML = '';
    func.faltas.forEach(falta => {
        adicionarFalta('editAusenciasContainer');
        const ultimoItem = containerFaltas.lastElementChild;
        ultimoItem.querySelector('.dias-falta').value = falta.dias;
        ultimoItem.querySelector('.com-atestado').value = falta.atestado;
    });

    const containerHoras = document.getElementById('editHorasExtrasContainer');
    containerHoras.innerHTML = '';
    func.horasExtras.forEach(he => {
        adicionarHoraExtra('editHorasExtrasContainer');
        const ultimoItem = containerHoras.lastElementChild;
        ultimoItem.querySelector('.horas-extra').value = he.horas;
        ultimoItem.querySelector('.tipo-extra').value = he.percentual;
    });

    abrirModal('edicao');
}

function salvarEdicao(event) {
    event.preventDefault();
    if (funcionarioEditando === null) return;
    const func = funcionarios[funcionarioEditando];
    
    func.nome = document.getElementById('editNome').value;
    func.salarioBase = parseFloat(document.getElementById('editSalarioBase').value);
    func.bonificacao = parseFloat(document.getElementById('editBonificacao').value) || 0;

    func.faltas = [];
    document.querySelectorAll('#editAusenciasContainer .item-flex').forEach(grupo => {
        func.faltas.push({
            dias: parseInt(grupo.querySelector('.dias-falta').value) || 0,
            atestado: grupo.querySelector('.com-atestado').value
        });
    });

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

function limparFormulario(tipo) {
    if (tipo === 'cadastro') {
        document.getElementById('nomeCadastro').value = '';
        document.getElementById('salarioBaseCadastro').value = '';
        document.getElementById('bonificacaoCadastro').value = '0';
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

function exibirFuncionarios() {
    const tbody = document.getElementById('tabelaFuncionarios');
    tbody.innerHTML = '';
    funcionarios.forEach((func, index) => {
        const calculo = calcularSalario(func);
        tbody.innerHTML += `
            <tr>
                <td>${func.nome}</td>
                <td>${formatCurrency(func.salarioBase)}</td>
                <td>${func.faltas.reduce((acc, f) => acc + f.dias, 0)}</td>
                <td>${formatCurrency(calculo.descontos)}</td>
                <td>${formatCurrency(calculo.totalLiquido)}</td>
                <td>
                    <div class="acoes-cell">
                        <button class="btn" onclick="editarFuncionario(${index})">Editar</button>
                        <button class="btn" onclick="gerarHolerite(${index})">Holerite</button>
                        <button class="btn" onclick="gerarNotaHoraExtra(${index})">Nota Hora Extra</button>
                        <button class="btn btn-excluir" onclick="removerFuncionario(${index})">Excluir</button>
                    </div>
                </td>
            </tr>
        `;
    });
}

// Cálculos do Salário
function calcularSalario(func) {
    const diasUteis = parseInt(document.getElementById('diasUteis') ? document.getElementById('diasUteis').value : 22) || 22;
    const valorDia = func.salarioBase / diasUteis;
    
    let descontosFaltas = func.faltas
        .filter(f => f.atestado === 'nao')
        .reduce((acc, f) => acc + (f.dias * valorDia), 0);

    const valorHoraNormal = func.salarioBase / 160;
    const valorTotalHE = func.horasExtras
        .reduce((acc, he) => acc + (he.horas * valorHoraNormal * (1 + he.percentual / 100)), 0);

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
            valorTotalHE,
            bonificacao: func.bonificacao
        }
    };
}

function calcularINSS(salario) {
    const tetoINSS = 908.85;
    const faixas = [
        { min: 0,        max: 1518.00,  aliquota: 0.075 },
        { min: 1518.01,  max: 2793.88,  aliquota: 0.09 },
        { min: 2793.89,  max: 4190.84,  aliquota: 0.12 },
        { min: 4190.85,  max: 8157.41,  aliquota: 0.14 }
    ];

    let desconto = 0;
    let salarioRestante = salario;

    for (const faixa of faixas) {
        if (salarioRestante <= 0) break;
        const base = Math.min(salarioRestante, faixa.max - faixa.min);
        desconto += base * faixa.aliquota;
        salarioRestante -= base;
    }

    return Math.min(desconto, tetoINSS);
}

function calcularIRRF(baseCalculo) {
    const faixas = [
        { min: 0, max: 2112.00, aliquota: 0, deducao: 0 },
        { min: 2112.01, max: 2826.65, aliquota: 0.075, deducao: 158.40 },
        { min: 2826.66, max: 3751.05, aliquota: 0.15, deducao: 370.40 },
        { min: 3751.06, max: 4664.68, aliquota: 0.225, deducao: 651.73 },
        { min: 4664.69, max: Infinity, aliquota: 0.275, deducao: 884.96 }
    ];

    const faixa = faixas.find(f => baseCalculo >= f.min && baseCalculo <= f.max);
    return Math.max((baseCalculo * faixa.aliquota) - faixa.deducao, 0);
}

// Geradores de PDF (Versões Corrigidas)
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
    doc.line(20, 35, 190, 35);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Funcionário: ${func.nome}`, 20, 42);
    doc.text(`Data: ${dataAtual}`, 150, 42);

    // Tabela de Valores
    const dados = [
        ["Salário Base", formatCurrency(func.salarioBase)],
        ["Horas Extras", formatCurrency(calculo.detalhes.valorTotalHE)],
        ["Bonificação", formatCurrency(calculo.detalhes.bonificacao)],
        ["FGTS", formatCurrency(calculo.detalhes.inss)],
        ["IRRF", formatCurrency(calculo.detalhes.irrf)],
        ["Descontos por Faltas", formatCurrency(calculo.detalhes.descontosFaltas)],
        [{ content: "TOTAL LÍQUIDO", styles: { fontStyle: 'bold' } }, { content: formatCurrency(calculo.totalLiquido), styles: { fontStyle: 'bold', textColor: [0, 128, 0] } }]
    ];

    doc.autoTable({
        startY: 50,
        head: [["Descrição", "Valor"]],
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
    doc.text(`- Meu valor líquido é de ${formatCurrency(calculo.totalLiquido)}`, 20, finalY + 5);
    doc.text(`- Total de horas extras: ${calculo.detalhes.totalHorasExtras}h`, 20, finalY + 10);
    doc.text(`- Valor total das horas extras: ${formatCurrency(calculo.detalhes.valorTotalHE)}`, 20, finalY + 15);
    doc.text(`- Bonificação: ${formatCurrency(calculo.detalhes.bonificacao)}`, 20, finalY + 20);

    // Assinaturas
    const assinaturaY = finalY + 30;
    doc.text("Assinatura do Funcionário: ___________________________", 20, assinaturaY);
    doc.text("Assinatura do Responsável: ___________________________", 20, assinaturaY + 10);
    doc.text(`Data: ${dataAtual}`, 160, assinaturaY + 10);

    // Rodapé informativo
    const rodapeY = 270;
    doc.setLineWidth(0.5);
    doc.line(20, rodapeY - 10, 190, rodapeY - 10);
    
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


function gerarNotaHoraExtra(index) {
    const { jsPDF } = window.jspdf;
    const func = funcionarios[index];
    const now = new Date();
    const dataAtual = now.toLocaleDateString('pt-BR');
  
    // Calcula o mês de referência (mês anterior)
    const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const mesReferencia = previousMonth.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
  
    const valorHoraNormal = func.salarioBase / 160;
    let totalValorExtras = 0;
    const tableData = [];
  
    // Monta a lista de registros de horas extras para a tabela
    if (func.horasExtras && func.horasExtras.length > 0) {
      func.horasExtras.forEach(he => {
        const valorHE = he.horas * valorHoraNormal * (1 + he.percentual / 100);
        totalValorExtras += valorHE;
        tableData.push([he.horas, he.percentual + "%", formatCurrency(valorHE)]);
      });
    }
  
    const doc = new jsPDF();
  
    // Cabeçalho do PDF
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Nota de Horas Extras", 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Funcionário: ${func.nome}`, 20, 30);
    doc.text(`Data: ${dataAtual}`, 150, 30);
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);
  
    let posY = 40;
  
    // Texto informativo
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    let informativo = 
      `Estou ciente e de acordo que meu salário bruto de ${formatCurrency(func.salarioBase)} ` +
      `foi utilizado para calcular o valor total das horas extras, conforme descrito abaixo.`;
    let linhasInformativo = doc.splitTextToSize(informativo, 170);
    doc.text(linhasInformativo, 20, posY);
    posY += linhasInformativo.length * 7 + 5;
  
    // Tabela de Horas Extras
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Detalhes das Horas Extras", 20, posY);
    posY += 5;
  
    // Cabeçalho da tabela
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Horas", 25, posY);
    doc.text("Adicional", 65, posY);
    doc.text("Valor", 120, posY);
    posY += 3;
    doc.setLineWidth(0.2);
    doc.line(20, posY, 190, posY);
    posY += 7;
  
    // Registros da tabela
    doc.setFont("helvetica", "normal");
    if (tableData.length > 0) {
      tableData.forEach(row => {
        doc.text(String(row[0]), 25, posY);
        doc.text(String(row[1]), 65, posY);
        doc.text(String(row[2]), 120, posY);
        posY += 7;
      });
    } else {
      doc.text("Nenhuma hora extra registrada.", 25, posY);
      posY += 7;
    }
  
    // Total de Horas Extras em destaque (verde)
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 128, 0);
    doc.text(`Total de Horas Extras: ${formatCurrency(totalValorExtras)}`, 20, posY);
    doc.setTextColor(0, 0, 0);
  
    // Espaço reservado para não interferir com a área de assinatura (deixa o conteúdo acima mais "limpo")
    // Vamos posicionar a área de assinaturas próximo à parte inferior da página
    const signatureY = 230;
  
    // Área de assinaturas na parte inferior
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    
    // Linha e campo para "Nome do Responsável"
    doc.text("Nome do Responsável:", 20, signatureY);
    doc.line(70, signatureY + 2, 190, signatureY + 2); // linha para assinatura do responsável
    
    // Linha e campo para "Assinatura do Funcionário"
    doc.text("Assinatura do Funcionário:", 20, signatureY + 20);
    doc.line(75, signatureY + 22, 190, signatureY + 22); // linha para assinatura do funcionário
    
    // Nome do Funcionário abaixo da linha de assinatura do funcionário
    doc.text(`Nome do Funcionário: ${func.nome}`, 20, signatureY + 35);
  
    // Rodapé informativo
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    let rodapeText = `De acordo com este documento, declaro ciência e aceitação dos valores das horas extras aqui descritas, ` +
                     `referentes ao mês de ${mesReferencia}.`;
    let rodapeLines = doc.splitTextToSize(rodapeText, 170);
    doc.text(rodapeLines, 20, signatureY + 45);
  
    // Linha e mensagem final no rodapé
    const rodapeY = 270;
    doc.setLineWidth(0.5);
    doc.line(20, rodapeY - 10, 190, rodapeY - 10);
    doc.text("Nota gerada automaticamente.", 105, rodapeY, { align: "center" });
  
    doc.save(`NotaHoraExtra_${func.nome}_${dataAtual.replace(/\//g, '-')}.pdf`);
  }
  

// Funções Auxiliares
function getFifthBusinessDay(year, month) {
    let count = 0;
    let currentDate = new Date(year, month, 1);
    while (count < 5) {
        if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) count++;
        if (count < 5) currentDate.setDate(currentDate.getDate() + 1);
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
    
    card.textContent = `Próximo Quinto dia útil: ${fifthBusinessDay.toLocaleDateString("pt-BR")}`;
    if (today.toDateString() === fifthBusinessDay.toDateString()) {
        card.classList.add("red");
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    adicionarFalta('ausenciasContainer');
    adicionarHoraExtra('horasExtrasContainer');
    exibirFuncionarios();
    updateCard();
});
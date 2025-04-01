function calcularMargem() {
    let produto = document.getElementById("produto").value;
    let precoCusto = parseFloat(document.getElementById("precoCusto").value);
    let precoVenda = parseFloat(document.getElementById("precoVenda").value);
    let plataforma = document.getElementById("plataforma").value;

    if (!produto || isNaN(precoCusto) || isNaN(precoVenda)) {
        alert("Preencha todos os campos corretamente!");
        return;
    }

    let imposto = 0.0108;
    let comissao = plataforma === "shopee" ? 0.20 : 0.13;
    let taxaPedido = plataforma === "shopee" ? 4.00 : 1.00;

    let custoTotal = precoCusto + (precoVenda * imposto) + (precoVenda * comissao) + taxaPedido;
    let margemR = precoVenda - custoTotal;
    let margemP = (margemR / precoVenda) * 100;

    let status = "Manter";
    let classe = "positivo";
    
    if (margemR < 0) {
        status = "Alterar URGENTE";
        classe = "negativo";
    } else if (margemP < 10) {
        status = "Manter, porém fora da margem meta";
        classe = "fora-meta";
    }

    document.getElementById("resultado").innerHTML = `<tr class="${classe}">
        <td>${produto}</td>
        <td>R$ ${margemR.toFixed(2)}</td>
        <td>${margemP.toFixed(2)}%</td>
        <td>${status}</td>
    </tr>`;

    let simulacaoHTML = "";
    for (let desconto = 5; desconto <= 90; desconto += 5) {
        let precoFinal = precoVenda * (1 - desconto / 100);
        let lucro = precoFinal - custoTotal;
        let classeLucro = lucro > 0 ? "positivo" : lucro === 0 ? "fora-meta" : "negativo";
        simulacaoHTML += `<tr class="${classeLucro}">
            <td>${desconto}%</td>
            <td>R$ ${precoFinal.toFixed(2)}</td>
            <td>R$ ${lucro.toFixed(2)}</td>
            <td>${lucro > 0 ? "Lucro" : lucro === 0 ? "Empate" : "Prejuízo"}</td>
        </tr>`;
    }
    document.getElementById("simulacao").innerHTML = simulacaoHTML;
}
function gerarRelatorioPDF() {
    const { jsPDF } = window.jspdf;
    let doc = new jsPDF();

    let produto = document.getElementById("produto").value;
    let precoCusto = parseFloat(document.getElementById("precoCusto").value);
    let precoVenda = parseFloat(document.getElementById("precoVenda").value);
    let plataforma = document.getElementById("plataforma").value;

    if (!produto || isNaN(precoCusto) || isNaN(precoVenda)) {
        alert("Preencha todos os campos corretamente!");
        return;
    }

    let imposto = 0.0108;
    let comissao = plataforma === "shopee" ? 0.20 : 0.13;
    let taxaPedido = plataforma === "shopee" ? 4.00 : 1.00;

    let custoTotal = precoCusto + (precoVenda * imposto) + (precoVenda * comissao) + taxaPedido;
    let margemR = precoVenda - custoTotal;
    let margemP = (margemR / precoVenda) * 100;

    let status = " Manter";
    let precoRecomendado = null;
    let tabelaAlternativa = []; // Para armazenar preços sugeridos

    if (margemR < 0) {
        status = " Alterar URGENTE!";
        precoRecomendado = custoTotal * 1.10; // Preço mínimo recomendado com 10% de margem
        tabelaAlternativa = [
            ["10%", `R$ ${(custoTotal * 1.10).toFixed(2)}`],
            ["20%", `R$ ${(custoTotal * 1.20).toFixed(2)}`],
            ["30%", `R$ ${(custoTotal * 1.30).toFixed(2)}`],
            ["40%", `R$ ${(custoTotal * 1.40).toFixed(2)}`]
        ];
    } else if (margemP < 10) {
        status = " Fora da margem meta";
    }

    // Cabeçalho do relatório
    doc.setFontSize(18);
    doc.text("Relatório de Análise de Preço", 15, 15);
    doc.setFontSize(12);
    doc.text(`Produto: ${produto}`, 15, 25);
    doc.text(`Plataforma: ${plataforma.toUpperCase()}`, 15, 32);

    // Tabela com os dados principais
    let dadosTabela = [
        [`R$ ${precoCusto.toFixed(2)}`, `R$ ${precoVenda.toFixed(2)}`, `R$ ${custoTotal.toFixed(2)}`, `R$ ${margemR.toFixed(2)}`, `${margemP.toFixed(2)}%`, status]
    ];

    if (precoRecomendado) {
        dadosTabela[0].push(` R$ ${precoRecomendado.toFixed(2)}`);
    }

    doc.autoTable({
        startY: 40,
        head: precoRecomendado
            ? [["Preço de Custo", "Preço de Venda", "Custo Total", "Margem R$", "Margem %", "Status", "Preço Recomendado"]]
            : [["Preço de Custo", "Preço de Venda", "Custo Total", "Margem R$", "Margem %", "Status"]],
        body: dadosTabela,
    });

    // Se estiver no prejuízo, mostra a tabela de preços recomendados
    if (margemR < 0) {
        doc.text("Sugestão de Preços Recomendados", 15, doc.lastAutoTable.finalY + 10);
        doc.autoTable({
            startY: doc.lastAutoTable.finalY + 15,
            head: [["Margem de Lucro", "Preço Recomendado"]],
            body: tabelaAlternativa,
        });
    } else {
        // Se estiver no lucro, faz a simulação de descontos
        let simulacao = [];
        for (let desconto = 5; desconto <= 90; desconto += 5) {
            let precoFinal = precoVenda * (1 - desconto / 100);
            let lucro = precoFinal - custoTotal;
            simulacao.push([`${desconto}%`, `R$ ${precoFinal.toFixed(2)}`, `R$ ${lucro.toFixed(2)}`, lucro > 0 ? "Lucro" : lucro === 0 ? "Empate" : "Prejuízo"]);
        }

        doc.text(" Simulação de Preços com Descontos", 15, doc.lastAutoTable.finalY + 10);
        doc.autoTable({
            startY: doc.lastAutoTable.finalY + 15,
            head: [["Desconto", "Preço Final", "Lucro", "Status"]],
            body: simulacao,
        });
    }

    // Salvar PDF
    doc.save(`Relatorio_${produto}.pdf`);
}
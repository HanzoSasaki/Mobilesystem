document.addEventListener("DOMContentLoaded", function () {
    flatpickr("#filtroData", {
        mode: "range", // Permite selecionar intervalo de datas
        dateFormat: "d/m/Y", // Formato DD/MM/AAAA
        onClose: function (selectedDates) {
            if (selectedDates.length > 0) {
                let dataInicio = formatarData(selectedDates[0]);
                let dataFim = selectedDates.length > 1 ? formatarData(selectedDates[1]) : dataInicio;
                filtrarPorData(dataInicio, dataFim);
            }
        }
    });
});

function formatarData(data) {
    let dia = String(data.getDate()).padStart(2, '0');
    let mes = String(data.getMonth() + 1).padStart(2, '0');
    let ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

function filtrarPorData(dataInicio, dataFim) {
    if (!dataInicio || !dataFim) return;

    const resultadosFiltrados = dadosFixos.filter(item => {
        const dataItem = item[13]; // Ajuste a coluna de data conforme necessário
        return compararDatas(dataItem, dataInicio, dataFim);
    });

    exibirResultados(resultadosFiltrados);
}

function compararDatas(dataItem, dataInicio, dataFim) {
    // Converte "DD/MM/AAAA" para um número no formato AAAAMMDD para comparação
    function converterParaNumero(data) {
        let [dia, mes, ano] = data.split("/");
        return parseInt(ano + mes + dia);
    }

    let dataNum = converterParaNumero(dataItem);
    let inicioNum = converterParaNumero(dataInicio);
    let fimNum = converterParaNumero(dataFim);

    return dataNum >= inicioNum && dataNum <= fimNum;
}

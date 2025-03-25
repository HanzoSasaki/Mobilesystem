// Valores atualizados dos fretes conforme intervalo e método
const shippingFees = {
  "Até 300 g": { full: 19.95, outros: 31.45 },
  "De 300 g a 500 g": { full: 21.45, outros: 34.05 },
  "De 500 g a 1 kg": { full: 22.45, outros: 36.05 },
  "De 1 kg a 2 kg": { full: 23.45, outros: 42.85 },
  "De 2 kg a 3 kg": { full: 24.95, outros: 55.40 },
  "De 3 kg a 4 kg": { full: 26.95, outros: 59.20 },
  "De 4 kg a 5 kg": { full: 28.45, outros: 61.80 },
  "De 5 kg a 9 kg": { full: 44.45, outros: 69.15 },
  "De 9 kg a 13 kg": { full: 65.95, outros: 94.90 },
  "De 13 kg a 17 kg": { full: 73.45, outros: 125.05 },
  "De 17 kg a 23 kg": { full: 85.95, outros: 140.55 },
  "De 23 kg a 30 kg": { full: 98.95, outros: 146.70 },
  "De 30 kg a 40 kg": { full: 109.45, outros: 150.00 },
  "De 40 kg a 50 kg": { full: 116.95, outros: 155.85 },
  "De 50 kg a 60 kg": { full: 124.95, outros: 167.10 },
  "De 60 kg a 70 kg": { full: 141.45, outros: 181.70 },
  "De 70 kg a 80 kg": { full: 156.95, outros: 194.85 },
  "De 80 kg a 90 kg": { full: 174.95, outros: 207.70 },
  "De 90 kg a 100 kg": { full: 199.95, outros: 228.05 },
  "De 100 kg a 125 kg": { full: 223.45, outros: 244.30 },
  "De 125 kg a 150 kg": { full: 237.45, outros: 260.45 },
  "Maior que 150 kg": { full: 249.45, outros: 273.05 }
};

// Variáveis globais para armazenar os preços base
let basePrecoComum = 0;
let basePrecoPremium = 0;

function calcularPrecoML() {
  let custo = parseFloat(document.getElementById("custo").value) || 0;
  let margemPercent = parseFloat(document.getElementById("margem").value) || 0;
  let margem = margemPercent / 100;
  let imposto = 0.065; // Imposto fixo de 6,5%

  // Validação: a soma da margem, comissão e imposto deve ser inferior a 100%
  if (margem + 0.14 + imposto >= 1 || margem + 0.18 + imposto >= 1) {
      alert("A soma da margem, comissão e imposto deve ser inferior a 100%.");
      return;
  }

  // Cálculo do preço base considerando imposto de 6,5%
  basePrecoComum = custo / (1 - (margem + 0.14 + imposto));
  basePrecoPremium = custo / (1 - (margem + 0.18 + imposto));

  let resultadoBase =
      "Preço Base Produto Comum: R$ " + basePrecoComum.toFixed(2) + "\n" +
      "Preço Base Produto Premium: R$ " + basePrecoPremium.toFixed(2);
  document.getElementById("resultadoBase").innerText = resultadoBase;

  // Se o preço base for menor que R$79,90: aplica taxa fixa de R$6,75
  if (basePrecoComum < 79.90) {
      let finalComum = basePrecoComum + 6.75;
      let finalPremium = basePrecoPremium + 6.75;
      document.getElementById("resultadoFinal").innerText =
          "Preço Final Produto Comum: R$ " + finalComum.toFixed(2) + "\n" +
          "Preço Final Produto Premium: R$ " + finalPremium.toFixed(2);
      document.getElementById("areaFrete").style.display = "none";
  } else {
      // Se o preço base for ≥ R$79,90, exibe a área de frete
      document.getElementById("areaFrete").style.display = "block";
      document.getElementById("resultadoFinal").innerText =
          "Após o cálculo do preço base, selecione os dados de frete e clique em 'Calcular Frete e Preço Final'.";
  }
}

function calcularFrete() {
  let metodo = document.getElementById("metodoEnvio").value; // "full" ou "outros"
  let intervalo = document.getElementById("intervaloEnvio").value;
  let frete = shippingFees[intervalo][metodo];

  // Para produtos com preço base ≥ R$79,90:
  // Preço Final = (Preço Base + Frete) - 6,75
  let finalComum = basePrecoComum + frete - 6.75;
  let finalPremium = basePrecoPremium + frete - 6.75;

  let resultadoFinal =
      "Preço Final Produto Comum: R$ " + finalComum.toFixed(2) + "\n" +
      "Preço Final Produto Premium: R$ " + finalPremium.toFixed(2);
  document.getElementById("resultadoFinal").innerText = resultadoFinal;
}

// Abrir o modal
document.getElementById('openModal').onclick = function() {
  document.getElementById('modal').style.display = 'block';
};

// Fechar o modal
document.querySelector('.close').onclick = function() {
  document.getElementById('modal').style.display = 'none';
};

window.onclick = function(event) {
  if (event.target == document.getElementById('modal')) {
      document.getElementById('modal').style.display = 'none';
  }
};

function calcularCubagem() {
  const comprimento = parseFloat(document.getElementById('comprimento').value);
  const largura = parseFloat(document.getElementById('largura').value);
  const altura = parseFloat(document.getElementById('altura').value);
  const pesoReal = parseFloat(document.getElementById('peso').value);
  const cubagem = (comprimento * largura * altura) / 6000;
  document.getElementById('resultadoCubagem').innerText = 
      `Peso Cubado: ${cubagem.toFixed(2)} kg | Peso Real: ${pesoReal} kg`;
}

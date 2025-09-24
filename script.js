// Dados dos efeitos de magia
let efeitosData = null;

// Elementos do DOM
const sortearBtn = document.getElementById("sortearBtn");
const buscarBtn = document.getElementById("buscarBtn");
const numeroManual = document.getElementById("numeroManual");
const resultado = document.getElementById("resultado");
const numeroSorteado = document.getElementById("numeroSorteado");
const efeitoTexto = document.getElementById("efeitoTexto");
const explicacaoTexto = document.getElementById("explicacaoTexto");
const rangeTexto = document.getElementById("rangeTexto");

// Carrega os dados do arquivo JSON
async function carregarEfeitos() {
  try {
    const response = await fetch("efeitos.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    efeitosData = await response.json();
    console.log("Efeitos carregados com sucesso!");
  } catch (error) {
    console.error("Erro ao carregar efeitos:", error);
    alert(
      "Erro ao carregar os efeitos de magia. Verifique se o arquivo efeitos.json está presente."
    );
  }
}

function parseRange(rangeString) {
  const [min, max] = rangeString.split("-").map((num) => parseInt(num, 10));
  return { min, max };
}

function encontrarEfeito(numeroSorteado) {
  if (!efeitosData || !efeitosData.wild_magic_surge) {
    return null;
  }

  for (const item of efeitosData.wild_magic_surge) {
    const { min, max } = parseRange(item.range);
    if (numeroSorteado >= min && numeroSorteado <= max) {
      return {
        effect: item.effect,
        explanation: item.explanation,
        range: item.range,
      };
    }
  }
  return null;
}

function exibirEfeito(numero, animarNumero = true) {
  resultado.style.display = "block";

  if (animarNumero) {
    // Anima o número
    animarNumeroSorteado(numero);

    setTimeout(() => {
      mostrarEfeito(numero);
    }, 1600);
  } else {
    numeroSorteado.textContent = numero;
    mostrarEfeito(numero);
  }
}

function mostrarEfeito(numero) {
  const efeito = encontrarEfeito(numero);

  if (efeito) {
    efeitoTexto.textContent = efeito.effect;
    explicacaoTexto.textContent = efeito.explanation;
    rangeTexto.textContent = `Range: ${efeito.range}`;
  } else {
    efeitoTexto.textContent = "Efeito não encontrado para este número.";
    explicacaoTexto.textContent = "";
    rangeTexto.textContent = "";
  }
}

function sortearNumero() {
  return Math.floor(Math.random() * 100) + 1;
}

// Anima o número sendo sorteado
function animarNumeroSorteado(numeroFinal) {
  let contador = 0;
  const intervalo = 50; // milissegundos
  const duracaoTotal = 500; // 1.5 segundos
  const totalIteracoes = duracaoTotal / intervalo;

  const animacao = setInterval(() => {
    numeroSorteado.textContent = Math.floor(Math.random() * 100) + 1;
    contador++;

    if (contador >= totalIteracoes) {
      clearInterval(animacao);
      numeroSorteado.textContent = numeroFinal;
    }
  }, intervalo);
}

async function realizarSorteio() {
  if (!efeitosData) {
    alert(
      "Os efeitos ainda não foram carregados. Tente novamente em um momento."
    );
    return;
  }

  // Desabilita temporariamente o botão
  sortearBtn.disabled = true;
  sortearBtn.textContent = "Sorteando...";

  try {
    // Sorteia o número e exibe imediatamente
    const numero = sortearNumero();
    exibirEfeito(numero, false);
  } finally {
    // Sempre reabilita o botão, mesmo se der erro
    setTimeout(() => {
      sortearBtn.disabled = false;
      sortearBtn.textContent = "✨ Efeito de Surte de Magia ✨";
    }, 100);
  }
}

async function buscarEfeito() {
  if (!efeitosData) {
    alert(
      "Os efeitos ainda não foram carregados. Tente novamente em um momento."
    );
    return;
  }

  const numero = parseInt(numeroManual.value);

  if (!numero || numero < 1 || numero > 100) {
    alert("Por favor, digite um número válido entre 1 e 100.");
    numeroManual.focus();
    return;
  }

  // Desabilita o botão temporariamente
  buscarBtn.disabled = true;
  buscarBtn.textContent = "🔍 Buscando...";

  // Esconde o resultado anterior se houver
  resultado.style.display = "none";

  // Pequeno delay para feedback visual
  setTimeout(() => {
    exibirEfeito(numero, false);

    // Reabilita o botão
    buscarBtn.disabled = false;
    buscarBtn.textContent = "🔍 Buscar";

    // Limpa o input
    numeroManual.value = "";
  }, 500);
}

// Event listeners
sortearBtn.addEventListener("click", realizarSorteio);
buscarBtn.addEventListener("click", buscarEfeito);

// Enter no input para buscar
numeroManual.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !buscarBtn.disabled) {
    buscarEfeito();
  }
});

// Carrega os efeitos quando a página é carregada
document.addEventListener("DOMContentLoaded", carregarEfeitos);

// Adiciona efeito de teclado (Enter para sortear quando não há foco no input)
document.addEventListener("keydown", (event) => {
  if (
    event.key === "Enter" &&
    !sortearBtn.disabled &&
    document.activeElement !== numeroManual
  ) {
    realizarSorteio();
  }
});

document.getElementById("configBtn").addEventListener("click", function () {
  document.getElementById("menu").style.display = "none"; // Oculta o menu inicial
  document.getElementById("config").style.display = "flex"; // Exibe o menu de configurações

  document.getElementById("menuBtn").addEventListener("click", function () {
    document.getElementById("config").style.display = "none"; // Oculta o menu de configurações
    document.getElementById("menu").style.display = "flex"; // Exibe novamente o menu inicial
  }, { once: true });
});

// Adiciona um evento de clique ao botão "OK" para iniciar o jogo
document.getElementById("jogarBtn").addEventListener("click", function () {
  document.getElementById("menu").style.display = "none"; // Oculta o menu inicial
  document.getElementById("usuario").style.display = "flex"; // Exibe a seção de usuário
});

// Adiciona um evento de clique ao botão "JOGAR"
document.getElementById("userBtn").addEventListener("click", function () {
  const nome = document.getElementById("userName").value; // Obtém o valor do campo de entrada
  if (nome === "") return;

  localStorage.setItem('nome', nome); // Armazena o nome do usuário no localStorage
  // Oculta o menu inicial
  document.getElementById("usuario").style.display = "none";

  // Exibe a div que contém os canvas
  const contPai = document.getElementById("divCanvas");
  const canvasCenario = document.getElementById("cenario");
  const canvasSprites = document.getElementById("sprites");
  const canvasInterface = document.getElementById("interface");
  const canvasPergunta = document.getElementById("pergunta");

  contPai.style.display = "block";

  // Define as dimensões dos canvas com base no tamanho da div pai
  const largura = contPai.clientWidth;
  const altura = contPai.clientHeight;

  [canvasCenario, canvasSprites, canvasInterface, canvasPergunta].forEach(c => c.width = largura);

  canvasCenario.height = altura / 1.5; // Altura do canvas do cenário
  canvasSprites.height = altura / 1.5; // Altura do canvas de sprites
  canvasInterface.height = altura / 3; // Altura do canvas da interface
  canvasPergunta.height = canvasCenario.height / 4; // Altura do canvas de perguntas

  // Objeto que agrupa os canvas
  const conjuntoCanvas = {
    cenario: canvasCenario,
    sprites: canvasSprites,
    interface: canvasInterface,
    pergunta: canvasPergunta
  };

  // Adiciona um evento de redimensionamento para recarregar a página
  let esperarResize;
  window.addEventListener("resize", () => {
    clearTimeout(esperarResize);
    esperarResize = setTimeout(() => location.reload(), 200);
  });

  // Chama a função para iniciar o jogo, passando os canvas como parâmetro
  iniciarJogo(conjuntoCanvas);
});
// Função principal para inicializar ou reiniciar o jogo
async function iniciarJogo(canvas, iniciou = false) {
  if (!iniciou) {
    localStorage.setItem('vidas', 5);
    localStorage.setItem('pontuacao', 0);
    localStorage.setItem('pergunta', 1);
  }
  // Reutiliza o contexto salvo globalmente, ou inicializa os contextos 2D para os diferentes layers do jogo
  const contexto = iniciou ? window.contexto : {
    cenario: canvas.cenario.getContext('2d'),
    sprites: canvas.sprites.getContext('2d'),
    interface: canvas.interface.getContext('2d'),
    pergunta: canvas.pergunta.getContext('2d')
  };

  // Reutiliza imagens carregadas anteriormente, ou cria objetos com paths e instâncias de Image para carregamento
  const imagens = iniciou ? window.imagens : {
    fundo: { src: "../img/Background.png", image: new Image() },
    heroi: { src: "../img/Heroi.png", image: new Image() },
    vilao: { src: "../img/Vilao.png", image: new Image() }
  };

  // Se ainda não iniciou antes, carrega imagens e salva no escopo global para reutilização
  if (!iniciou) {
    await carregarImagens(imagens);
    window.contexto = contexto;
    window.imagens = imagens;
  }

  // Se já iniciou, reinicia apenas a animação e interface, mantendo cenários e imagens já carregadas
  if (iniciou) {
    const animacoes = iniciarAnimacao(contexto, canvas, imagens);
    desenharInterface(contexto, canvas, animacoes);
    return animacoes;
  }

  // Primeira inicialização: desenha cenário, inicia animações e desenha a interface do jogo
  desenharCenario(contexto, canvas, imagens);
  const animacoes = iniciarAnimacao(contexto, canvas, imagens);
  desenharInterface(contexto, canvas, animacoes);

  return animacoes;
}
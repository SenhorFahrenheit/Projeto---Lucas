// Inicia ou cancela o loop de animação dos personagens
function iniciarAnimacao(ctx, canvas, imagens) {

  const baseY = canvas.sprites.height;

  // Configuração inicial do herói com seus dados de sprite e animações
  const heroi = window.heroi || {
    colunas: 6,
    linhas: 17,
    larguraQuadro: imagens.heroi.image.width / 6,
    alturaQuadro: imagens.heroi.image.height / 17,
    posX: 200,
    posY: baseY - 268,
    escalaX: 200,
    escalaY: 150,
    animacoes: {
      idle: { linha: 0, inicioColuna: 0, frames: 6 },
      correr: { linha: 1, inicioColuna: 0, frames: 8 },
      atacar: { linha: 2, inicioColuna: 2, frames: 12 },
      morrer: { linha: 4, inicioColuna: 2, frames: 11 },
      apanhar: { linha: 6, inicioColuna: 1, frames: 4 },
    },
    animacaoAtual: 'idle',
    quadroAtual: 0
  };

  // Configuração inicial do vilão com seus dados de sprite e animações
  const vilao = window.vilao || {
    colunas: 8,
    linhas: 8,
    larguraQuadro: imagens.vilao.image.width / 8,
    alturaQuadro: imagens.vilao.image.height / 8,
    posX: 500,
    posY: baseY - 318,
    escalaX: 250,
    escalaY: 200,
    animacoes: {
      idle: { linha: 0, inicioColuna: 0, frames: 8 },
      correr: { linha: 1, inicioColuna: 0, frames: 8 },
      atacar: { linha: 2, inicioColuna: 0, frames: 10 },
      morrer: { linha: 3, inicioColuna: 2, frames: 13 }
    },
    animacaoAtual: 'idle',
    quadroAtual: 0
  };

  // Armazena os personagens globalmente para reutilização
  window.heroi = heroi;
  window.vilao = vilao;

  let tempoAnterior = Date.now();
  const intervaloFrame = 150; // Intervalo entre frames

  // Desenha os quadros dos personagens de acordo com a animação atual
  function desenharSprites() {
    ctx.sprites.clearRect(0, 0, canvas.sprites.width, canvas.sprites.height);

    if (heroi.animacaoAtual !== null) {
      const animHeroi = heroi.animacoes[heroi.animacaoAtual];
      const frameHeroi = animHeroi.inicioColuna + heroi.quadroAtual;
      const colHeroi = frameHeroi % heroi.colunas;
      const linHeroi = animHeroi.linha + Math.floor(frameHeroi / heroi.colunas);

      ctx.sprites.drawImage(
        imagens.heroi.image,
        colHeroi * heroi.larguraQuadro,
        linHeroi * heroi.alturaQuadro,
        heroi.larguraQuadro,
        heroi.alturaQuadro,
        heroi.posX,
        heroi.posY,
        heroi.escalaX,
        heroi.escalaY
      );
    } else {
      // Exibe animação "morrer" como fallback
      const animHeroi = heroi.animacoes.morrer;
      const frameHeroi = heroi.quadroAtual;
      const colHeroi = frameHeroi % heroi.colunas;
      const linHeroi = animHeroi.linha + Math.floor(frameHeroi / heroi.colunas);

      ctx.sprites.drawImage(
        imagens.heroi.image,
        colHeroi * heroi.larguraQuadro,
        linHeroi * heroi.alturaQuadro,
        heroi.larguraQuadro,
        heroi.alturaQuadro,
        heroi.posX,
        heroi.posY,
        heroi.escalaX,
        heroi.escalaY
      );
    }

    if (vilao.animacaoAtual !== null) {
      const animVilao = vilao.animacoes[vilao.animacaoAtual];
      const frameVilao = animVilao.inicioColuna + vilao.quadroAtual;
      const colVilao = frameVilao % vilao.colunas;
      const linVilao = animVilao.linha + Math.floor(frameVilao / vilao.colunas);

      ctx.sprites.drawImage(
        imagens.vilao.image,
        colVilao * vilao.larguraQuadro,
        linVilao * vilao.alturaQuadro,
        vilao.larguraQuadro,
        vilao.alturaQuadro,
        vilao.posX,
        vilao.posY,
        vilao.escalaX,
        vilao.escalaY
      );
    }
  }

  // Controla o ciclo de animação, avança frames conforme o tempo
  function animar() {
    const agora = Date.now();
    if (agora - tempoAnterior >= intervaloFrame) {
      if (heroi.animacaoAtual !== null) {
        const animHeroi = heroi.animacoes[heroi.animacaoAtual];
        heroi.quadroAtual = (heroi.quadroAtual + 1) % animHeroi.frames;
      }

      if (vilao.animacaoAtual !== null) {
        const animVilao = vilao.animacoes[vilao.animacaoAtual];
        vilao.quadroAtual = (vilao.quadroAtual + 1) % animVilao.frames;
      }
      tempoAnterior = agora;
    }
    desenharSprites();
    requestAnimationFrame(animar); // Loop contínuo de animação
  }

  animar();

  return {
    spriteHeroi: heroi,
    spriteVilao: vilao
  };
}

// Transição para a próxima fase com animação de saída/fade e reinício do jogo
function proximaFase(canvas, animacoes) {
  return new Promise(async (resolve) => {
    const fundo = document.getElementById('divCanvas');
    const heroi = animacoes.spriteHeroi;
    const velocidade = 2;

    heroi.animacaoAtual = 'correr';
    heroi.quadroAtual = 0;

    let deslocamentoFinalizado = false;

    function animarFase() {
      heroi.posX += velocidade;
      if (!deslocamentoFinalizado) {
        requestAnimationFrame(animarFase);
      }
    }

    function finalizarTransicao() {
      window.heroi = null;
      window.vilao = null;

      iniciarJogo(canvas, true).then(() => {
        fade(fundo, 'in', resolve);
      });
    }

    // Inicia animação do herói
    requestAnimationFrame(animarFase);

    // Inicia fade out e depois continua
    fade(fundo, 'out', () => {
      deslocamentoFinalizado = true;
      finalizarTransicao();
    });
  });
}
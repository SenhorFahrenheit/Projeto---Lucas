// Anima o vilão se aproximando do herói, atacando e voltando à posição inicial
function atacarHeroi(animacoes) {
  return new Promise((resolve) => {
    const vilao = animacoes.spriteVilao;
    const heroi = animacoes.spriteHeroi;
    const posXOriginal = vilao.posX;
    const destinoX = heroi.posX + 20;

    vilao.animacaoAtual = 'correr';
    vilao.quadroAtual = 0;

    const duracao = 1000;
    const inicio = Date.now();

    function animarAtaque() {
      const agora = Date.now();
      const progresso = Math.min(1, (agora - inicio) / duracao);
      vilao.posX = posXOriginal + (destinoX - posXOriginal) * progresso;

      if (progresso < 1) {
        requestAnimationFrame(animarAtaque);
      } else {
        vilao.animacaoAtual = 'atacar';
        vilao.quadroAtual = 0;

        const duracaoAtaque = 1100;
        const inicioAtaque = Date.now();

        // Após iniciar o ataque, aplica dano próximo ao final da animação
        function finalizarAtaque() {
          const agora = Date.now();
          const progressoAtaque = (agora - inicioAtaque) / duracaoAtaque;

          if (progressoAtaque >= 0.8) danoHeroi(animacoes);

          if (progressoAtaque < 1) {
            requestAnimationFrame(finalizarAtaque);
          } else {
            voltarPosicaoOriginal();
          }
        }

        requestAnimationFrame(finalizarAtaque);
      }
    }

    animarAtaque();

    // Anima o retorno do vilão para a posição inicial
    function voltarPosicaoOriginal() {
      const destinoOriginal = posXOriginal;
      const origemAtual = vilao.posX;

      vilao.animacaoAtual = 'correr';
      vilao.quadroAtual = 0;

      const duracaoVolta = 1000;
      const inicioVolta = Date.now();

      function animarVolta() {
        const agora = Date.now();
        const progresso = Math.min(1, (agora - inicioVolta) / duracaoVolta);
        vilao.posX = origemAtual + (destinoOriginal - origemAtual) * progresso;

        if (progresso < 1) {
          requestAnimationFrame(animarVolta);
        } else {
          vilao.animacaoAtual = 'idle';
          vilao.quadroAtual = 0;
          resolve();
        }
      }

      animarVolta();
    }
  });
}

// Controla a animação de dano/morte do vilão
function danoVilao(animacoes) {
  return new Promise((resolve) => {
    const vilao = animacoes.spriteVilao;
    vilao.animacaoAtual = 'morrer';
    vilao.quadroAtual = 0;

    const duracao = 2000;
    const inicio = Date.now();

    function animarMorte() {
      const agora = Date.now();
      const progresso = Math.min(1, (agora - inicio) / duracao);

      if (progresso < 0.9) {
        requestAnimationFrame(animarMorte);
      } else {
        vilao.animacaoAtual = null; // Encerra animação
        resolve();
      }
    }

    animarMorte();
  });
}
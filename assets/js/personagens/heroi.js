// Executa a sequência de ataque do herói até o vilão, com animação e sincronização
function atacarVilao(animacoes) {
  return new Promise((resolve) => {
    const heroi = animacoes.spriteHeroi;
    const posXOriginal = heroi.posX;

    heroi.animacaoAtual = 'correr';
    heroi.quadroAtual = 0;

    const destinoX = animacoes.spriteVilao.posX + 20;
    const duracaoCorrida = 1000;
    const inicioCorrida = Date.now();

    function animarAtaque() {
      const agora = Date.now();
      const progresso = Math.min(1, (agora - inicioCorrida) / duracaoCorrida);
      heroi.posX = posXOriginal + (destinoX - posXOriginal) * progresso;

      if (progresso < 1) {
        requestAnimationFrame(animarAtaque);
      } else {
        heroi.animacaoAtual = 'atacar';
        heroi.quadroAtual = 0;

        const duracaoAtaque = 1000;
        const inicioAtaque = Date.now();

        function finalizarAtaque() {
          const agora = Date.now();
          const progressoAtaque = (agora - inicioAtaque) / duracaoAtaque;

          if (progressoAtaque >= 0.8) danoVilao(animacoes).then(resolve);

          if (progressoAtaque < 1) {
            requestAnimationFrame(finalizarAtaque);
          } else {
            heroi.animacaoAtual = 'idle';
            heroi.quadroAtual = 0;
          }
        }

        requestAnimationFrame(finalizarAtaque);
      }
    }

    animarAtaque();
  });
}

// Controla a reação do herói ao tomar dano, com animação de apanhar ou morrer
function danoHeroi(animacoes) {
  return new Promise((resolve) => {
    const heroi = animacoes.spriteHeroi;

    if (parseInt(localStorage.getItem('vidas')) - 1 > 0) { // Ainda tem vidas restantes
      heroi.animacaoAtual = 'apanhar';
      heroi.quadroAtual = 0;

      const duracao = 1000;
      const inicio = Date.now();

      function animarDano() {
        const agora = Date.now();
        const progresso = Math.min(1, (agora - inicio) / duracao);

        if (progresso < 0.9) {
          requestAnimationFrame(animarDano);
        } else {
          heroi.animacaoAtual = 'idle';
          heroi.quadroAtual = 0;
          resolve();
        }
      }
      animarDano();
    } else { // Morre caso vidas acabem
      heroi.animacaoAtual = 'morrer';
      heroi.quadroAtual = 0;

      const duracao = 1800;
      const inicio = Date.now();

      function animarDano() {
        const agora = Date.now();
        const progresso = Math.min(1, (agora - inicio) / duracao);

        if (progresso < 0.9) {
          requestAnimationFrame(animarDano);
        } else {
          heroi.quadroAtual = heroi.animacoes.morrer.frames - 1; // Último frame
          heroi.animacaoAtual = null; // Encerra animação
          resolve();
        }
      }
      animarDano();
    }
  });
}
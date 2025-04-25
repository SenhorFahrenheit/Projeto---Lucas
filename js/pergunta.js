/** Aplica o estilo ao contexto da pergunta */
function configurarEstiloPergunta(ctx) {
  const fontSize = "1.5rem";
  ctx.pergunta.fillStyle = '#d1baba';
  ctx.pergunta.font = `${fontSize} "Press Start 2P"`;
  ctx.pergunta.textAlign = 'center';
  ctx.pergunta.textBaseline = 'middle';
}

/** Renderiza a pergunta centralizada com quebra de linha */
function desenharPergunta(ctx, canvas, texto) {
  ctx.pergunta.clearRect(0, 0, canvas.pergunta.width, canvas.pergunta.height);

  const larguraRet = canvas.pergunta.width * 0.95;
  const margem = canvas.pergunta.width - larguraRet;

  ctx.pergunta.fillStyle = '#872019';
  ctx.pergunta.fillRect(margem, 0, larguraRet - margem, canvas.pergunta.height);

  configurarEstiloPergunta(ctx);

  const maxWidth = canvas.pergunta.width * 0.9;
  const linhas = quebrarTexto(ctx.pergunta, texto, maxWidth);
  const alturaLinha = canvas.pergunta.height / linhas.length;
  const startY = canvas.pergunta.height / 2 - ((linhas.length - 1) * alturaLinha) / 2;

  linhas.forEach((linha, i) => {
    ctx.pergunta.fillText(linha, canvas.pergunta.width / 2, startY + i * alturaLinha);
  });
}

/** Mostra mensagem final e botão de reinício */
function finalizar(ctx, canvas, perdeu = false) {
  canvas.pergunta.style.zIndex = '5';
  canvas.sprites.style.zIndex = '5';
  canvas.cenario.style.zIndex = '4';
  canvas.cenario.style.height = '100%';
  canvas.cenario.style.width = '100%';
  canvas.sprites.style.top = 'unset';
  canvas.sprites.style.bottom = 0;

  ctx.pergunta.clearRect(0, 0, canvas.pergunta.width, canvas.pergunta.height);

  const container = document.getElementById('divCanvas');
  const blocoFinal = document.createElement('div');
  blocoFinal.classList.add('blocoFinal');

  const nome = localStorage.getItem('nome') || 'Jogador';
  const pontuacao = localStorage.getItem('pontuacao') || 0;

  const texto1 = document.createElement('span');
  texto1.textContent = `Obrigado por jogar, ${nome}!`;
  texto1.classList.add('textoFinal');

  const texto2 = document.createElement('span');
  texto2.textContent = `Sua pontuação final foi: ${pontuacao}`;

  const botao = document.createElement('button');
  botao.classList.add('voltarBtn');
  botao.textContent = 'Menu';

  blocoFinal.appendChild(texto1);
  blocoFinal.appendChild(texto2);
  blocoFinal.appendChild(botao);
  container.appendChild(blocoFinal);

  botao.addEventListener('click', () => {
    window.heroi = null;
    window.vilao = null;
    textos = null;
    ['pergunta', 'pontuacao', 'vidas', 'nome'].forEach(key => localStorage.removeItem(key));

    ctx.pergunta.clearRect(0, 0, canvas.pergunta.width, canvas.pergunta.height);
    ctx.sprites.clearRect(0, 0, canvas.sprites.width, canvas.sprites.height);
    ctx.cenario.clearRect(0, 0, canvas.cenario.width, canvas.cenario.height);

    canvas.pergunta.style.zIndex = '2';
    canvas.sprites.style.zIndex = '2';
    canvas.sprites.style.top = '0';
    canvas.cenario.style.zIndex = '1';
    canvas.cenario.style.height = 'unset';
    canvas.cenario.style.width = 'unset';

    container.style.display = 'none';
    document.getElementById('menu').style.display = 'flex';
    blocoFinal.remove();
  });

  const width = canvas.pergunta.width / 2;
  const height = canvas.pergunta.height / 2;
  ctx.pergunta.fillStyle = '#872019';
  ctx.pergunta.fillRect(width / 2, height / 2, width, height);

  ctx.pergunta.fillStyle = '#d1baba';
  ctx.pergunta.fillText(perdeu ? 'Você perdeu!' : 'Você venceu!', canvas.pergunta.width / 2, canvas.pergunta.height / 2);
}

/** Realiza quebra automática de texto baseado na largura máxima */
function quebrarTexto(ctx, texto, maxWidth) {
  const palavras = texto.split(' ');
  const linhas = [];
  let linhaAtual = '';

  palavras.forEach(palavra => {
    const linhaTeste = linhaAtual ? `${linhaAtual} ${palavra}` : palavra;
    const largura = ctx.measureText(linhaTeste).width;
    if (largura > maxWidth && linhaAtual) {
      linhas.push(linhaAtual);
      linhaAtual = palavra;
    } else {
      linhaAtual = linhaTeste;
    }
  });

  if (linhaAtual) linhas.push(linhaAtual);
  return linhas;
}
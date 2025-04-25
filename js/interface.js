let textos = null;

//Carrega e retorna os textos embaralhados
async function carregarTextosEmbaralhados() {
  const textos = await carregarTextos();
  return shuffleArray(textos).slice(0, 10);
}

//Carrega fonte necessária
async function carregarFonte(fonte = "Press Start 2P", tamanho = "1rem") {
  try {
    await document.fonts.load(`${tamanho} "${fonte}"`);
  } catch (err) {
    console.error("Erro ao carregar a fonte:", err);
  }
}

//Desenha fundo cinza da interface
function desenharFundo(ctx, canvas) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#cccccc';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

//Atualiza pergunta no localStorage
function avancarPerguntaAtual() {
  const atual = parseInt(localStorage.getItem('pergunta'));
  localStorage.setItem('pergunta', atual + 1);
}

//Desenha blocos de alternativas
function desenharAlternativas(ctx, canvas, textosAtual, posicoes, largura, altura, fontSize) {
  posicoes.forEach((pos, indice) => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(pos.x, pos.y, largura, altura);
    ctx.strokeStyle = '#898989';
    ctx.strokeRect(pos.x, pos.y, largura, altura);

    ctx.fillStyle = '#000000';
    ctx.font = `${fontSize} "Press Start 2P"`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const maxWidth = largura * 0.9;
    const linhas = quebrarTexto(ctx, textosAtual.alternatives[indice], maxWidth);
    const alturaLinha = altura / linhas.length;
    const startY = pos.y + altura / 2 - ((linhas.length - 1) * alturaLinha) / 2;

    linhas.forEach((linha, i) => {
      ctx.fillText(linha, pos.x + largura / 2, startY + i * alturaLinha);
    });
  });
}

//Função principal de renderização da interface
async function desenharInterface(ctx, canvas, animacoes) {
  desenharFundo(ctx.interface, canvas.interface);
  await carregarFonte();

  const perguntaAtual = parseInt(localStorage.getItem('pergunta'));
  let vidas = parseInt(localStorage.getItem('vidas'));
  let pontuacao = parseInt(localStorage.getItem('pontuacao'));

  if (!textos) textos = await carregarTextosEmbaralhados();
  const textosAtual = textos[perguntaAtual - 1];
  if (!textosAtual) {
    console.error('Texto não encontrado para a pergunta:', perguntaAtual);
    return;
  }

  avancarPerguntaAtual();

  desenharPergunta(ctx, canvas, textosAtual.question);

  const margem = 20, espacamentoVertical = 40, espacamentoHorizontal = 20;
  const larguraRet = (canvas.interface.width - 2 * margem - espacamentoHorizontal) / 2;
  const alturaRet = (canvas.interface.height - 2 * margem - espacamentoVertical) / 2;

  const posicoes = [
    { x: margem, y: margem },
    { x: margem + larguraRet + espacamentoHorizontal, y: margem },
    { x: margem, y: margem + alturaRet + espacamentoVertical },
    { x: margem + larguraRet + espacamentoHorizontal, y: margem + alturaRet + espacamentoVertical }
  ];

  desenharAlternativas(ctx.interface, canvas.interface, textosAtual, posicoes, larguraRet, alturaRet, "1rem");

  canvas.interface.addEventListener('click', async function verificarClique(evento) {
    const indiceClicado = detectarClique(canvas.interface, posicoes, evento, larguraRet, alturaRet);
    if (indiceClicado == null) return;

    canvas.interface.removeEventListener('click', verificarClique);

    if (indiceClicado === textosAtual.correct) {
      pontuacao += 10;
      localStorage.setItem('pontuacao', pontuacao);
      await atacarVilao(animacoes);
      perguntaAtual !== textos.length ? await proximaFase(canvas, animacoes) : finalizar(ctx, canvas);
    } else {
      await atacarHeroi(animacoes);
      vidas--;
      localStorage.setItem('vidas', vidas);

      if (vidas <= 0) finalizar(ctx, canvas, true);
      else {
        await explicar(ctx, canvas, textosAtual.question, textosAtual.alternatives[indiceClicado]);
        desenharInterface(ctx, canvas, animacoes);
      }
    }
  });
}

//Mostra explicação após resposta errada
async function explicar(ctx, canvas, pergunta, resposta) {
  desenharFundo(ctx.interface, canvas.interface);
  await carregarFonte();

  ctx.interface.fillStyle = '#000';
  ctx.interface.font = `1rem "Press Start 2P"`;
  ctx.interface.textAlign = 'center';
  ctx.interface.textBaseline = 'middle';
  ctx.interface.fillText("Gerando resposta...", canvas.interface.width / 2, canvas.interface.height / 2);

  let explicacao;
  try {
    explicacao = await buscarExplicacao(pergunta, resposta);
  } catch (erro) {
    // Se a API falhar, exibe mensagem de erro e espera 5 segundos
    desenharFundo(ctx.interface, canvas.interface);
    ctx.interface.fillText("Falha ao gerar resposta...", canvas.interface.width / 2, canvas.interface.height / 2);
    await new Promise(resolve => setTimeout(resolve, 5000));
    return; // Aqui sai da função e continua o fluxo da pergunta normalmente
  }

  if (!explicacao) return;

  // Redesenha fundo e exibe a explicação
  desenharFundo(ctx.interface, canvas.interface);
  await carregarFonte();

  ctx.interface.fillStyle = '#000';
  ctx.interface.font = `1rem "Press Start 2P"`;
  ctx.interface.textAlign = 'center';
  ctx.interface.textBaseline = 'middle';

  const linhasExplicacao = quebrarTexto(ctx.interface, explicacao, canvas.interface.width * 0.9);
  const alturaLinhaExp = canvas.interface.height / linhasExplicacao.length;
  const startYExp = canvas.interface.height / 2 - ((linhasExplicacao.length - 1) * alturaLinhaExp) / 2;

  linhasExplicacao.forEach((linha, i) => {
    ctx.interface.fillText(linha, canvas.interface.width / 2, startYExp + i * alturaLinhaExp);
  });

  // Espera tempo de leitura
  await new Promise(resolve => setTimeout(resolve, 15000));
}


async function buscarExplicacao(pergunta, resposta) {
  const response = await fetch('http://127.0.0.1:5000/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userQuestion: pergunta, userAnswer: resposta })
  });

  const data = await response.json();
  return data.response || "Desculpe, não consegui encontrar uma explicação.";
}

function shuffleArray(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

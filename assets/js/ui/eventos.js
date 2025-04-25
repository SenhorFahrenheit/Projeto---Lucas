//Detecta se o clique do usuário está dentro de uma das áreas (retângulos)
function detectarClique(canvas, posicoes, evento, largura, altura) {
  const retangulo = canvas.getBoundingClientRect();
  const clickX = evento.clientX - retangulo.left;
  const clickY = evento.clientY - retangulo.top;

  for (let i = 0; i < posicoes.length; i++) {
    const pos = posicoes[i];
    const dentroX = clickX >= pos.x && clickX <= pos.x + largura;
    const dentroY = clickY >= pos.y && clickY <= pos.y + altura;

    if (dentroX && dentroY) return i;
  }

  return null;
}

//Aplica efeito fade in/out

function fade(elemento, direcao = 'out', callback) {
  let opacidade = direcao === 'out' ? 1 : 0;
  const passo = 0.01;

  function animar() {
    if (direcao === 'out') {
      opacidade -= passo;
      if (opacidade <= 0) {
        elemento.style.opacity = 0;
        callback?.();
        return;
      }
    } else {
      opacidade += passo;
      if (opacidade >= 1) {
        elemento.style.opacity = 1;
        callback?.();
        return;
      }
    }

    elemento.style.opacity = opacidade;
    requestAnimationFrame(animar);
  }

  requestAnimationFrame(animar);
}

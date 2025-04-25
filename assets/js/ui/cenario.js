// Desenha o cenário de fundo do jogo com base na imagem fornecida
function desenharCenario(ctx, canvas, imagens) {
  const larguraImagem = imagens.fundo.image.width;
  const alturaImagem = imagens.fundo.image.height / 3; // Assume que a imagem tem 3 seções verticais

  ctx.cenario.drawImage(
    imagens.fundo.image,
    0,
    alturaImagem * 2,
    larguraImagem,
    alturaImagem,
    0,
    0,
    canvas.cenario.width,
    canvas.cenario.height
  );
}
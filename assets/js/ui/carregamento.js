// Carrega todas as imagens fornecidas em paralelo
async function carregarImagens(imagens) {
  const promessas = Object.entries(imagens).map(([chave, img]) => {
    return new Promise((resolve, reject) => {
      img.image.src = img.src;
      img.image.onload = resolve; // Resolve ao carregar
      img.image.onerror = () => reject(`Erro ao carregar imagem: ${img.src}`); // Rejeita se falhar
    });
  });

  // Aguarda o carregamento de todas as imagens antes de continuar
  await Promise.all(promessas);
}

// Carrega dados de texto de um arquivo JSON, usado por fase (caso necessário)
async function carregarTextos() {
  try {
    const resposta = await fetch(`assets/questions.json`); // Busca o arquivo local
    const dados = await resposta.json(); // Converte para objeto
    return dados || null;
  } catch (error) {
    console.error('Erro ao carregar textos:', error); // Loga erro no console
  }
}
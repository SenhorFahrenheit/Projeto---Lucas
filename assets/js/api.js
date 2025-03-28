// Função assíncrona para buscar uma explicação sobre uma resposta errada
async function fetchExplanation(userQuestion, userAnswer) {
    // Faz uma requisição para o servidor local na rota /chat
    const response = await fetch('http://127.0.0.1:5000/chat', {
      method: 'POST', // Define o método HTTP como POST para envio de dados
      headers: {
        'Content-Type': 'application/json', // Define o formato dos dados como JSON
      },
      body: JSON.stringify({
        userQuestion: userQuestion, // Envia a pergunta feita ao usuário
        userAnswer: userAnswer, // Envia a resposta escolhida pelo usuário
      }),
    });
  
    // Converte a resposta do servidor para JSON
    const data = await response.json();
    
    // Retorna a explicação para a resposta errada, se houver uma resposta válida do servidor
    if (data.response) {
      return data.response;
    } else {
      // Caso o servidor não forneça uma resposta válida, retorna uma mensagem padrão
      return "Desculpe, não conseguimos obter uma explicação.";
    }
}

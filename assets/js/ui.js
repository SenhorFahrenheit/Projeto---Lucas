// Função para iniciar o quiz
function startQuiz() {

      restartGame()
      
    // Obtém o nome do usuário a partir do campo de entrada e remove espaços extras
    const userName = document.getElementById("userName").value.trim();

    // Se o campo estiver vazio, exibe uma mensagem de erro e interrompe a execução
    if (userName === "") {
      document.getElementById("error").style.display = "block";
      return;
    }

    // Armazena o nome do usuário no localStorage para uso posterior
    localStorage.setItem("userName", userName);

    // Esconde a tela inicial e exibe a tela do quiz
    document.getElementById("start-screen").style.display = "none";
    document.getElementById("quiz-screen").style.display = "block";

    // Exibe uma mensagem de boas-vindas com o nome do usuário
    document.getElementById("welcomeMessage").innerText = `Bem-vindo, ${userName}!`;

    // Carrega a primeira pergunta do quiz
    loadQuestion();
}

// Função para finalizar o jogo e exibir a pontuação final
function endGame(score) {
  window.location.href = 'game-over.html';      
}

// Função para reiniciar o jogo
function restartGame() {
    // Reinicia as variáveis do jogo
    currentQuestionIndex = 0;
    score = 0;
    lives = 5;

    // Atualiza a pontuação no localStorage
    localStorage.setItem("userScore", score);

    // Esconde a tela do quiz e volta para a tela inicial
    document.getElementById("quiz-screen").style.display = "none";
    document.getElementById("start-screen").style.display = "block";
}

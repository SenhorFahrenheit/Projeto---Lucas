// Controle de navegação no menu
document.getElementById('start-btn').addEventListener('click', startGame);
// document.getElementById('settings-btn').addEventListener('click', openSettings);
// document.getElementById('exit-btn').addEventListener('click', exitGame);

// Função para iniciar o jogo
function startGame() {
  // Armazenar dados de início ou pontuação
  localStorage.setItem('userScore', 0);
  
  // Redireciona ou mostra a tela do quiz
  window.location.href = 'assets/quiz.html'; // Exemplo, se o quiz estiver em uma página separada
}
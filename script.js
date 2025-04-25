// Controle de navegação no menu
document.getElementById('start-btn').addEventListener('click', startGame);
// document.getElementById('settings-btn').addEventListener('click', openSettings);
// document.getElementById('exit-btn').addEventListener('click', exitGame);

// Função para iniciar o jogo
function startGame() {
  // Armazenar dados de início ou pontuação
  localStorage.setItem('userScore', 0);
  localStorage.setItem('userName', '');

  
  // Redireciona ou mostra a tela do quiz
  window.location.href = 'assets/quiz.html'; // Exemplo, se o quiz estiver em uma página separada
}

const typingText = document.getElementById('typing-text');
const text = `/*
* CodeQuest - Quiz de Lógica
* Criado por: Lucas e Karine
* Versão: 1.0
* Data: [Data Atual]
*/

function solveLogic(question) {
// Lógica complexa aqui...
if (question.isHard()) {
return "Desafio aceito!";
} else { return "Vamos para o próximo!"; }
}
`;
let charIndex = 0;

function type() {
    if (charIndex < text.length) {
        typingText.textContent += text.charAt(charIndex);
        charIndex++;
        setTimeout(type, 50);
    }
}

// Adiciona um atraso de 2 segundos antes de iniciar a digitação
setTimeout(type, 2000);
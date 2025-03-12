// assets/js/game-over.js

// Função que é chamada quando a página do fim de jogo é carregada
window.onload = function() {
    // Recuperando os dados armazenados no localStorage
    const userName = localStorage.getItem('userName');
    const userScore = localStorage.getItem('userScore');

    // Atualizando os elementos na tela com os dados do usuário
    document.getElementById('user-name').textContent = userName || 'Jogador';
    document.getElementById('user-score').textContent = userScore || 0;

    // Ação para o botão "Jogar Novamente"
    document.getElementById('play-again').addEventListener('click', function() {
        // Redireciona para o jogo novamente
        window.location.href = '../quiz.html';
    });
}

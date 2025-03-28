// Array para armazenar as perguntas carregadas do arquivo JSON
let questions = [];

// Define um índice aleatório inicial para a pergunta atual (entre 0 e 29)
let currentQuestionIndex = Math.floor(Math.random() * 30);

// Variáveis para armazenar a pontuação do jogador e o número de vidas restantes
let score = 0;
let lives = 5;

/**
 * Função assíncrona para carregar perguntas de um arquivo JSON.
 */
async function loadQuestions() {
  try {
    // Faz uma requisição para obter as perguntas do arquivo "questions.json"
    const response = await fetch("questions.json");
    
    // Converte a resposta para um array de objetos JSON
    questions = await response.json();
    
    // Embaralha as perguntas e seleciona apenas as 10 primeiras
    questions = shuffleArray(questions).slice(0, 10);
    
    // Define o índice da pergunta atual como 0 (primeira pergunta da lista embaralhada)
    currentQuestionIndex = 0;
  } catch (error) {
    // Caso ocorra um erro na requisição, exibe uma mensagem no console
    console.error("Erro ao carregar as perguntas:", error);
  }
}

/**
 * Função para exibir a pergunta atual e suas alternativas na interface do usuário.
 */
function loadQuestion() {
  // Verifica se as perguntas foram carregadas corretamente
  if (questions.length === 0) {
    console.error("Nenhuma pergunta carregada.");
    return;
  }

  // Obtém os elementos HTML para exibir a pergunta e as opções de resposta
  const questionText = document.getElementById("question-text");
  const options = document.querySelectorAll(".option");
  
  // Obtém a pergunta atual a partir do índice
  const currentQuestion = questions[currentQuestionIndex];

  // Exibe o texto da pergunta na interface
  questionText.innerText = currentQuestion.question;

  // Define o texto das opções de resposta e adiciona um evento de clique para cada uma
  options.forEach((option, index) => {
    option.innerText = currentQuestion.alternatives[index];
    option.onclick = () => selectAnswer(index); // Chama a função selectAnswer ao clicar
  });
}

/**
 * Função para embaralhar um array aleatoriamente.
 * @param {Array} array - O array a ser embaralhado.
 * @returns {Array} - O array embaralhado.
 */
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

/**
 * Função assíncrona chamada quando o usuário seleciona uma resposta.
 * @param {number} selectedIndex - Índice da resposta selecionada pelo usuário.
 */
async function selectAnswer(selectedIndex) {
  // Verifica se a resposta selecionada é a correta
  if (selectedIndex === questions[currentQuestionIndex].correct) {
    // Incrementa a pontuação do jogador
    score += 10;

    // Armazena a pontuação no localStorage para persistência
    localStorage.setItem("userScore", score);

    // Atualiza a exibição da pontuação na interface
    document.getElementById("score").innerText = score;
  } else {
    // Exibe um alerta informando que a resposta está errada
    alert("Resposta errada");

    // Reduz o número de vidas
    lives--;

    // Se o jogador perder todas as vidas, finaliza o jogo
    if (lives === 0) {
      endGame(score);
      return;
    }

    // Obtém a resposta selecionada e a pergunta atual
    const userAnswer = questions[currentQuestionIndex].alternatives[selectedIndex];
    const userQuestion = questions[currentQuestionIndex].question;

    // Busca uma explicação para a resposta errada (supondo que fetchExplanation existe)
    const explanation = await fetchExplanation(userQuestion, userAnswer);

    // Exibe a pergunta, a resposta do usuário e a explicação do erro no console
    console.log("Questão: " + userQuestion);
    console.log("Resposta: " + userAnswer);
    console.log("Explicação do erro: " + explanation);
  }

  // Avança para a próxima pergunta
  currentQuestionIndex++;

  // Se ainda houver perguntas, carrega a próxima, senão finaliza o jogo
  if (currentQuestionIndex < questions.length) {
    loadQuestion();
  } else {
    endGame(score);
  }
}

// Carrega as perguntas quando a página for carregada
window.onload = loadQuestions;

// testes

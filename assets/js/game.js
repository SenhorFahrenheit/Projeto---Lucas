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
    option.classList.remove("correct-answer"); // Remove a classe 'correct-answer'
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
let lastCorrectTime = null; // Armazena o tempo da última resposta correta

// Função principal chamada quando o usuário seleciona uma resposta
async function selectAnswer(selectedIndex) {
  // Obtém referência para o botão de alternar explicação
  const toggleButton = document.getElementById("toggleExplanation");
  toggleButton.style.display = "none"; // Esconde o botão inicialmente
  
  try {
    // Obtém a questão atual e verifica se a resposta está correta
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedIndex === currentQuestion.correct;

    if (isCorrect) {
      handleCorrectAnswer(); // Chama a função para tratar a resposta correta
    } else {
      await handleIncorrectAnswer(selectedIndex); // Chama a função para tratar a resposta errada
    }
  } catch (error) {
    console.error("Erro ao gerar explicação:", error); // Loga o erro no console
    toggleButton.innerText = "Falha ao gerar uma resposta"; // Atualiza o botão de explicação
  } finally {
    toggleButton.disabled = false; // Reabilita o botão
  }

  nextQuestion(); // Avança para a próxima questão
}

// Função chamada quando a resposta do usuário está correta
function handleCorrectAnswer() {
  const now = Date.now(); // Obtém o tempo atual em milissegundos
  let points = calculatePoints(now); // Calcula a pontuação com base no tempo de resposta
  
  score += points; // Adiciona os pontos à pontuação total
  lastCorrectTime = now; // Atualiza o tempo da última resposta correta
  localStorage.setItem("userScore", score); // Salva a pontuação no localStorage
}

// Função chamada quando a resposta do usuário está errada
async function handleIncorrectAnswer(selectedIndex) {
  const toggleButton = document.getElementById("toggleExplanation");
  toggleButton.style.display = "block"; // Exibe o botão de explicação
  toggleButton.disabled = true; // Desabilita o botão durante o carregamento
  toggleButton.innerText = "Gerando resposta..."; // Atualiza o texto do botão

  alert("Resposta errada"); // Exibe um alerta informando que a resposta está errada
  if (--lives === 0) return endGame(); // Se não houver mais vidas, encerra o jogo

  // Obtém a questão atual e destaca a alternativa correta (borda verde)
  const currentQuestion = questions[currentQuestionIndex];
  const correctOptionElement = document.querySelectorAll(".option")[currentQuestion.correct];
  correctOptionElement.classList.add("correct-answer");

  // Obtém a resposta do usuário e busca uma explicação para o erro
  const userAnswer = currentQuestion.alternatives[selectedIndex];
  const explanation = await fetchExplanation(currentQuestion.question, userAnswer);

  displayExplanation(currentQuestion.question, userAnswer, explanation); // Exibe a explicação na interface
  toggleButton.innerText = "Mostrar Explicação"; // Atualiza o botão
  toggleButton.addEventListener("click", toggleExplanation); // Adiciona o evento de clique para alternar a explicação
}

// Função para calcular a pontuação com base no tempo de resposta
function calculatePoints(now) {
  if (!lastCorrectTime) return 10; // Se for a primeira resposta correta, retorna 10 pontos

  const timeDiff = (now - lastCorrectTime) / 1000; // Calcula a diferença de tempo em segundos
  const multiplier = timeDiff < 5 ? 2 : timeDiff < 10 ? 1.5 : 1; // Define um multiplicador baseado no tempo
  
  return Math.round(10 * multiplier); // Retorna a pontuação ajustada
}

// Função para avançar para a próxima questão
function nextQuestion() {
  currentQuestionIndex++; // Incrementa o índice da pergunta atual
  
  // Se houver mais perguntas, carrega a próxima; caso contrário, finaliza o jogo
  currentQuestionIndex < questions.length ? loadQuestion() : endGame(score);
}



function displayExplanation(question, answer, explanation) {
  const explanationArea = document.getElementById("explanationArea");
  explanationArea.innerHTML = `
      <h2>Questão: ${question}</h2>
      <p>Sua resposta: ${answer}</p>
      <p>Explicação do erro: ${explanation}</p>
  `;
  explanationArea.style.display = "none"; // Inicialmente oculta a explicação
}

function toggleExplanation() {
  const explanationArea = document.getElementById("explanationArea");
  const toggleButton = document.getElementById("toggleExplanation");

  if (explanationArea.style.display === "none") {
      explanationArea.style.display = "block";
      toggleButton.innerText = "Ocultar Explicação";
  } else {
      explanationArea.style.display = "none";
      toggleButton.innerText = "Mostrar Explicação";
  }
}
// Carrega as perguntas quando a página for carregada
window.onload = loadQuestions;

// testes

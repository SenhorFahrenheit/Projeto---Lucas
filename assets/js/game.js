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
  
async function selectAnswer(selectedIndex) {
  const toggleButton = document.getElementById("toggleExplanation"); // Referência para o botão de ocultar resposta
  toggleButton.style.display = "none";
  
  
  // qualquer erro gerado dentro do escopo de TRY, ele consegue tratar
  try {
    // Verifica se a resposta está correta
    if (selectedIndex === questions[currentQuestionIndex].correct) {
      const now = Date.now(); // Obtém o tempo atual em milissegundos
      let points = 10; // Pontuação base para uma resposta correta

      // Se houver um registro da última resposta correta, calcula o tempo entre respostas
      if (lastCorrectTime) {
        let timeDiff = (now - lastCorrectTime) / 1000; // Diferença de tempo em segundos

        // Define um multiplicador com base no tempo de resposta:
        // - Se for menor que 5s, dobra os pontos (x2)
        // - Se for entre 5s e 10s, aplica um multiplicador de 1.5
        // - Se for maior que 10s, mantém os pontos normais (x1)
        let multiplier = timeDiff < 5 ? 2 : timeDiff < 10 ? 1.5 : 1;

        // Ajusta a pontuação final arredondando para um número inteiro
        points = Math.round(points * multiplier);
      }

      score += points; // Adiciona os pontos calculados à pontuação total
      lastCorrectTime = now; // Atualiza o tempo da última resposta correta
      localStorage.setItem("userScore", score); // Salva a pontuação no localStorage
    } 
    // Se a resposta estiver errada...
    else {
      // Exibe o botão na interface
      toggleButton.style.display = "block";
      // Desabilita o clique do botão durante o carregamento
      toggleButton.disabled = true; 
      // Exibe "Gerando resposta..." enquanto a resposta está sendo gerada
      toggleButton.innerText = "Gerando resposta...";

      // Exibe um alerta para resposta errada
      alert("Resposta errada");
      lives--; // Reduz uma vida

      // Se o jogador perder todas as vidas, encerra o jogo
      if (lives === 0) {
        endGame();
        return;
      }

      // Obtém a resposta selecionada e a pergunta atual
      const userAnswer = questions[currentQuestionIndex].alternatives[selectedIndex];
      const userQuestion = questions[currentQuestionIndex].question;

      // Obtém o índice e o elemento HTML da resposta correta
      const correctIndex = questions[currentQuestionIndex].correct;
      const correctOptionElement = document.querySelectorAll(".option")[correctIndex];

      // Destaca a resposta correta na interface
      correctOptionElement.classList.add("correct-answer");

      // Busca e exibe a explicação para a resposta errada
      const explanation = await fetchExplanation(userQuestion, userAnswer);
      displayExplanation(userQuestion, userAnswer, explanation);

      // Exibe o botão para alternar a explicação
      document.getElementById("toggleExplanation").style.display = "block";
      document.getElementById("toggleExplanation").addEventListener("click", toggleExplanation);
    }

    // Atualiza o texto do botão para "Mostrar Explicação" após a resposta ser processada
    toggleButton.innerText = "Mostrar Explicação";

  } catch (error) {
    // Caso haja erro ao gerar a resposta, atualiza o botão para indicar falha
    toggleButton.innerText = "Falha ao gerar uma resposta";
    console.error("Erro ao gerar explicação:", error);
  } finally {
    // Reabilita o botão caso a resposta tenha sido gerada ou falhado
    toggleButton.disabled = false;
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

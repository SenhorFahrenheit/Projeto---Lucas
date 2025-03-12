let questions = [];
let currentQuestionIndex = 0;
let score = 0;

async function loadQuestions() {
  try {
    const response = await fetch("questions.json"); // Carrega o arquivo JSON
    console.log(response)
    questions = await response.json(); // Converte para objeto JS
    console.log(questions)
    startQuiz(); // Inicia o quiz após carregar as perguntas
  } catch (error) {
    console.error("Erro ao carregar as perguntas:", error);
  }
}

function startQuiz() {
  const userName = document.getElementById("userName").value.trim();

  if (userName === "") {
    document.getElementById("error").style.display = "block";
    return;
  }

  localStorage.setItem("userName", userName);

  document.getElementById("start-screen").style.display = "none";
  document.getElementById("quiz-screen").style.display = "block";

  document.getElementById("welcomeMessage").innerText = `Bem-vindo, ${userName}!`;

  loadQuestion();
}

function loadQuestion() {
  if (questions.length === 0) {
    console.error("Nenhuma pergunta carregada.");
    return;
  }

  const questionText = document.getElementById("question-text");
  const options = document.querySelectorAll(".option");

  const currentQuestion = questions[currentQuestionIndex];

  questionText.innerText = currentQuestion.question;

  options.forEach((option, index) => {
    option.innerText = currentQuestion.options[index];
    option.onclick = () => selectAnswer(index);
  });
}

function selectAnswer(selectedIndex) {
  if (selectedIndex === questions[currentQuestionIndex].correct) {
    score += 10;
    document.getElementById("score").innerText = score;
  }

  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    loadQuestion();
  } else {
    endGame();
  }
}

function endGame() {
  const userName = localStorage.getItem("userName");
  document.getElementById("quiz-screen").innerHTML = `
    <h2>Fim de jogo!</h2>
    <p>${userName}, sua pontuação final foi: <strong>${score}</strong></p>
    <button onclick="restartGame()">Jogar Novamente</button>
  `;
}

function restartGame() {
  currentQuestionIndex = 0;
  score = 0;
  loadQuestion();
}

// Carrega as perguntas quando a página for aberta
window.onload = loadQuestions;

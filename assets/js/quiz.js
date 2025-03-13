let questions = [];
let currentQuestionIndex = Math.floor(Math.random() * 30); //Definir sem sorteio para testes
let score = 0;
let lives = 5;

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

async function loadQuestions() {
  try {
    const response = await fetch("questions.json"); // Carrega o arquivo JSON
    questions = await response.json(); // Converte para objeto JS
    questions = shuffleArray(questions).slice(0, 10); //Embaralha as 30 questões e fatia 10
    currentQuestionIndex = 0; // Garante que o índice começa do primeiro
    console.log(questions) //Para testes
    // startQuiz(); // Inicia o quiz após carregar as perguntas
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
  localStorage.setItem("userScore", score);
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
    option.innerText = currentQuestion.alternatives[index];
    option.onclick = () => selectAnswer(index);
  });
}

async function selectAnswer(selectedIndex) {
  if (selectedIndex === questions[currentQuestionIndex].correct) {
    score += 10;
    // Atualiza a pontuação no localStorage
    localStorage.setItem("userScore", score);
    document.getElementById("score").innerText = score;
  }
  else{
    alert("Resposta errada")
    lives--
    console.log(lives)
    if (lives === 0) {
      endGame();
      return;
    }
    // const userAnswer = currentQuestion.alternatives[selectedIndex];
    const userAnswer = questions[currentQuestionIndex].alternatives[selectedIndex];
    const userQuestion = questions[currentQuestionIndex].question;
    console.log(userQuestion)
    console.log(userAnswer);
    const explanation = await fetchExplanation(userQuestion, userAnswer);
  }
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    loadQuestion();
  } else {
    endGame();
  }
}

// não está pronta, falta aperfeiçoar e criar a API
async function fetchExplanation(userQuestion, userAnswer) {
  try {
    const response = await fetch("", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userQuestion: userQuestion,
        userAnswer: userAnswer
      })
    });

    const data = await response.json();
    return data.explanation; // A API deve retornar uma explicação
  } catch (error) {
    console.error("Erro ao buscar explicação:", error);
    return "Não foi possível obter uma explicação no momento.";
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
  lives = 5; // Resetando as vidas
  localStorage.setItem("userScore", score);
  document.getElementById("quiz-screen").style.display = "none";
  document.getElementById("start-screen").style.display = "block";
}


// // Carrega as perguntas quando a página for aberta
window.onload = loadQuestions;

// arquivo responsável por Perguntas, Respostas e Pontuação

function startQuiz() {
    const userName = document.getElementById('userName').value;
  
    // Verifica se o nome foi inserido
    if (!userName) {
      document.getElementById('error').style.display = 'block';  // Exibe mensagem de erro
      return;
    }
  
    // Armazenando o nome no localStorage para persistência
    localStorage.setItem('userName', userName);
  
    // Exibe a tela do quiz e esconde a tela de boas-vindas
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('quiz-screen').style.display = 'block';
  
    // Exibe a saudação com o nome do usuário
    document.getElementById('welcomeMessage').innerText = `Bem-vindo, ${userName}! Vamos começar o quiz.`;
  
    // Começar o quiz aqui (exemplo: carregar as perguntas)
    loadQuestions();
  }
  
  // Função para carregar as perguntas (apenas um exemplo simples)
  function loadQuestions() {
    const questions = [
      {
        question: "Qual a sintaxe correta para declarar uma variável em JavaScript?",
        options: ["let x;", "variable x;", "var x =;", "int x;"],
        correct: 0
      },
      {
        question: "Qual o operador lógico para 'E' em JavaScript?",
        options: ["&&", "||", "!", "=="],
        correct: 0
      },
      // Adicione mais perguntas aqui
    ];
  
    // Vamos armazenar a pontuação em uma variável global
    let score = 0;
  
    // Mostrar a primeira pergunta
    const questionContainer = document.getElementById('question-container');
    questionContainer.innerHTML = ''; // Limpa o container de perguntas
  
    questions.forEach((question, index) => {
      const questionElement = document.createElement('div');
      questionElement.classList.add('question');
  
      // Pergunta
      const questionText = document.createElement('p');
      questionText.innerText = `${index + 1}. ${question.question}`;
      questionElement.appendChild(questionText);
  
      // Alternativas
      question.options.forEach((option, i) => {
        const button = document.createElement('button');
        button.innerText = option;
        button.onclick = () => checkAnswer(i, question.correct);
        questionElement.appendChild(button);
      });
  
      questionContainer.appendChild(questionElement);
    });
  
    // Função para verificar se a resposta está correta
    function checkAnswer(selected, correct) {
      if (selected === correct) {
        score++;
        document.getElementById('score').innerText = score;
      }
  
      // Mostrar a próxima pergunta ou terminar o quiz
      // Para simplificação, vamos mostrar apenas uma pergunta por vez
    }
  }
  
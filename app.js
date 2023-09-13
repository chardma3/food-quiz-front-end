// bring in the items
const _question = document.getElementById("question");
const _quizScore = document.querySelector(".quiz-score");
const _result = document.getElementById("result");
const _btnDropdown = document.getElementById("btn-dropdown");
const _nav = document.getElementById("nav-dropdown");
const _restart = document.getElementById("restart");
const _option1 = document.getElementById("option1");
const _option2 = document.getElementById("option2");
const _option3 = document.getElementById("option3");
const _levelElements = document.querySelectorAll(".level");
const _selectedLevelElement = document.getElementById("selected-level");

let score = 0;
let selectedLevel = 1;
let questions = [];
let filteredQuestions = [];
let randomQuestion;

// functions
async function loadQuestion() {
  const APIUrl = "https://food-quiz-api.onrender.com/questions/";
  const result = await fetch(APIUrl);
  const data = await result.json();
  questions = data;
  console.log(questions);
  // Filter questions based on selected level
  filteredQuestions = questions.filter(
    (question) => question.level === selectedLevel
  );
  console.log(filteredQuestions);
  displayRandomQuestion();
}

function displayRandomQuestion() {
  if (filteredQuestions.length === 0) {
    if (selectedLevel < 5) {
      //transition to next level
      selectedLevel++;
      filteredQuestions = questions.filter(
        (question) => question.level === selectedLevel
      );
      // Update the selected level element in the DOM
      _selectedLevelElement.textContent = `Level ${selectedLevel}`;
      console.log("Filtered Questions:", filteredQuestions);
    } else {
      //reached last level, go back to level 1
      _result.textContent = "Congrats! You finished the quiz!";
      selectedLevel = 1;
      filteredQuestions = questions.filter(
        (question) => question.level === selectedLevel
      );
    }
  }
  const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
  randomQuestion = filteredQuestions[randomIndex];

  _question.innerHTML = randomQuestion.question;
  _selectedLevelElement.textContent = `Level ${selectedLevel}`;
  _option1.textContent = randomQuestion.option1;
  _option2.textContent = randomQuestion.option2;
  _option3.textContent = randomQuestion.option3;

  filteredQuestions.splice(randomIndex, 1);
}

loadQuestion();

function checkAnswer(selectedOption) {
  if (selectedOption === randomQuestion.answer) {
    _result.textContent = "Correct!";
    displayRandomQuestion();
    score++;
  } else {
    _result.textContent = "Incorrect!";
    if (score > 0) {
      score--;
    }
  }

  setTimeout(() => {
    _result.textContent = "";
  }, 2000);

  // Update the score display
  _quizScore.textContent = `Score: ${score}`;
}

function restart() {
  filteredQuestions = [];
  selectedLevel = 1; // reset the selected level to 1
  filteredQuestions = Array.from(questions).filter(
    (question) => question.level === selectedLevel
  );

  loadQuestion();
  score = 0;
  _quizScore.textContent = `Score: ${0}`;
  _result.textContent = "";
  // Update the selected level element in the DOM
  _selectedLevelElement.textContent = `Level ${selectedLevel}`;
  console.log("Filtered Questions for Level 1:", filteredQuestions);
}

// Event listeners
_btnDropdown.addEventListener("click", () => {
  console.log("dropdown clicked");
  if (!_btnDropdown.classList.contains("is-open")) {
    _btnDropdown.classList.add("is-open");
    _nav.classList.add("is-open");
  } else {
    _btnDropdown.classList.remove("is-open");
    _nav.classList.remove("is-open");
  }
});

// Event Listener for level selection
_levelElements.forEach((element) => {
  element.addEventListener("click", () => {
    selectedLevel = parseInt(element.getAttribute("data-level"));
    filteredQuestions = questions.filter(
      (question) => question.level === selectedLevel
    );
    displayRandomQuestion();
    _btnDropdown.classList.remove("is-open"); // Close the dropdown menu
    _nav.classList.remove("is-open");
    console.log(
      `Level ${selectedLevel} has been clicked, and here are the array of filtered questions:`,
      filteredQuestions
    );
  });
});

_option1.addEventListener("click", () => {
  checkAnswer(1);
  console.log("answer button 1 clicked");
});

_option2.addEventListener("click", () => {
  checkAnswer(2);
  console.log("answer button 2 clicked");
});

_option3.addEventListener("click", () => {
  checkAnswer(3);
  console.log("answer button 3 clicked");
});

_restart.addEventListener("click", () => {
  restart();
  console.log("restart button clicked");
});

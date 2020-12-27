// variables to keep track of quiz state
var currentQuestionIndex = 0;
var time = questions.length * 15;
var timerId;

// variables to reference DOM elements
var questionsEl = document.getElementById("questions");
var timerEl = document.getElementById("time");
var choicesEl = document.getElementById("choices");
var submitBtn = document.getElementById("submit");
var startBtn = document.getElementById("start");
var initialsEl = document.getElementById("initials");
var feedbackEl = document.getElementById("feedback");
var startScrn = document.getElementById("start-screen");
var endScrn = document.getElementById("end-screen");
var finalEL = document.getElementById("final-score");

// sound effects
var sfxRight = new Audio("assets/sfx/correct.wav");
var sfxWrong = new Audio("assets/sfx/incorrect.wav");

function startQuiz() {
  // hide start screen
  startScrn.classList.add("hide")
  // un-hide questions section
  questionsEl.classList.remove("hide")
  // start timer
  clockTick();
  // show starting time
  timerEl.textContent = time;


  getQuestion();
}

function getQuestion() {
  // get current question object from array
  var currentQuestion = questions[currentQuestionIndex];

  // update title with current question
  questionsEl.firstElementChild.textContent = currentQuestion.title

  // clear out any old question choices
  questionsEl.lastElementChild.innerHTML = ''

  // loop over choices
  currentQuestion.choices.forEach(function(choice, i) {
    // create new button for each choice
    newBtn = document.createElement("button");
    newBtn.setAttribute("value", choice)
    
    choice = currentQuestion.choices[i]
    newBtn.innerText = choice;

    // attach click event listener to each choice
    newBtn.addEventListener("click", questionClick);

    // display on the page
    questionsEl.lastElementChild.appendChild(newBtn);

  });
}

function questionClick() {
  // check if user guessed wrong
  console.log(this.value)
  if (this.value !== questions[currentQuestionIndex].answer) {
    // penalize time
    time -= 15;

    if (time < 0) {
      time = 0;
    }

    // display new time on page
    timerEl.textContent = time;

    // play "wrong" sound effect

    feedbackEl.textContent = "Wrong!";
  } else {
    // play "right" sound effect

    feedbackEl.textContent = "Correct!";
  }

  // flash right/wrong feedback on page for half a second
  feedbackEl.setAttribute("class", "feedback");
  setTimeout(function() {
    feedbackEl.setAttribute("class", "feedback hide");
  }, 1000);

  // move to next question
  currentQuestionIndex++

  // check if we've run out of questions
  if (currentQuestionIndex === questions.length) {
    quizEnd();
  } else {
    getQuestion();
  }
}

function quizEnd() {
  // stop timer
  clearInterval(timerInterval);
  // show end screen
  endScrn.classList.remove("hide")
  // show final score
  finalEL.textContent = time
  // hide questions section
  questionsEl.setAttribute("class", "hide");
}

function clockTick() {
  // update time
  timerInterval = setInterval(function() {
    time--;
    timerEl.textContent = time;

    // check if user ran out of time
    if (time <= 0) {
      quizEnd();
    }
  }, 1000);
}

function saveHighscore() {
  // get value of input box
  var initials = document.getElementById("initials").value


  // make sure value wasn't empty
  if (initials !== "") {
    // get saved scores from localstorage, or if not any, set to empty array
    
    var highscores = JSON.parse(window.localStorage.getItem("highscores")) || [];
    console.log(highscores)

    // format new score object for current user
    var newScore = {
      score: time,
      initials: initials
    };

    console.log(newScore);

    // save to localstorage
    highscores.push(newScore);
    console.log(highscores)
    localStorage.setItem("highscores", JSON.stringify(highscores));

    // redirect to next page
    window.location.href = "highscores.html";
  }
}

function checkForEnter(event) {
  // "13" represents the enter key
  if (event.keyCode === 13) {
    saveHighscore();
  }
}

// user clicks button to submit initials
submitBtn.addEventListener("click", saveHighscore);

// user clicks button to start quiz
startBtn.addEventListener("click", startQuiz);

initialsEl.addEventListener("onkeyup", checkForEnter);

/**
 * CubeLearner - Hauptanwendungslogik
 * State Machine für das Training
 */

// App State
const AppState = {
  MENU: 'menu',
  READY: 'ready',
  RUNNING: 'running',
  RESULT: 'result'
};

let state = {
  currentState: AppState.MENU,
  selectedExercise: null,
  currentRound: 0,
  totalRounds: 10,
  rounds: [],           // Speichert alle Runden-Daten
  startTime: null,
  roundStartTime: null
};

// DOM Elemente
let elements = {};

/**
 * Initialisiert die App
 */
function initApp() {
  // DOM Elemente cachen
  elements = {
    menuScreen: document.getElementById('menu-screen'),
    readyScreen: document.getElementById('ready-screen'),
    runningScreen: document.getElementById('running-screen'),
    resultScreen: document.getElementById('result-screen'),
    exerciseList: document.getElementById('exercise-list'),
    exerciseName: document.getElementById('exercise-name'),
    cubeContainer: document.getElementById('cube-container'),
    svgElement: document.getElementById('cube'),
    roundCounter: document.getElementById('round-counter'),
    instructions: document.getElementById('instructions'),
    resultBody: document.getElementById('result-body'),
    totalTime: document.getElementById('total-time'),
    correctCount: document.getElementById('correct-count'),
    accuracy: document.getElementById('accuracy')
  };

  // Würfel erstellen
  createCube(elements.svgElement, 300);

  // Übungsliste rendern
  renderExerciseList();

  // Keyboard Events
  document.addEventListener('keydown', handleKeyPress);

  // Zeige Menü
  showState(AppState.MENU);

  console.log('CubeLearner initialisiert!');
}

/**
 * Rendert die Übungsliste im Menü
 */
function renderExerciseList() {
  const exercises = getExerciseList();
  elements.exerciseList.innerHTML = '';

  exercises.forEach(ex => {
    const button = document.createElement('button');
    button.className = 'exercise-button';
    button.innerHTML = `
      <strong>${ex.name}</strong>
      <span>${ex.description}</span>
    `;
    button.addEventListener('click', () => selectExercise(ex.id));
    elements.exerciseList.appendChild(button);
  });
}

/**
 * Wählt eine Übung aus und geht zum Ready-Screen
 */
function selectExercise(exerciseId) {
  state.selectedExercise = getExercise(exerciseId);
  state.totalRounds = state.selectedExercise.rounds;
  elements.exerciseName.textContent = state.selectedExercise.name;
  showState(AppState.READY);
}

/**
 * Startet die Übung
 */
function startExercise() {
  state.currentRound = 0;
  state.rounds = [];
  state.startTime = performance.now();

  showState(AppState.RUNNING);
  nextRound();
}

/**
 * Zeigt die nächste Runde an
 */
function nextRound() {
  if (state.currentRound >= state.totalRounds) {
    finishExercise();
    return;
  }

  // Generiere die Runde
  const roundData = state.selectedExercise.generateRound();
  state.rounds.push({
    ...roundData,
    userAnswer: null,
    correct: null,
    time: null
  });

  // Update UI
  elements.roundCounter.textContent = `Runde ${state.currentRound + 1} / ${state.totalRounds}`;

  // Würfel zurücksetzen und Muster anzeigen
  resetCubeColors();
  roundData.pattern.forEach(p => {
    setFieldColor(p.face, p.row, p.col, p.color);
  });

  // Timer starten
  state.roundStartTime = performance.now();
}

/**
 * Verarbeitet die Antwort des Benutzers
 */
function submitAnswer(userSaysCorrect) {
  if (state.currentState !== AppState.RUNNING) return;

  const roundTime = performance.now() - state.roundStartTime;
  const currentRoundData = state.rounds[state.currentRound];

  currentRoundData.userAnswer = userSaysCorrect;
  currentRoundData.correct = (userSaysCorrect === currentRoundData.isCorrect);
  currentRoundData.time = roundTime;

  // Kurzes visuelles Feedback
  showFeedback(currentRoundData.correct);

  state.currentRound++;

  // Kurze Pause vor nächster Runde
  setTimeout(() => {
    nextRound();
  }, 300);
}

/**
 * Zeigt visuelles Feedback für richtig/falsch
 */
function showFeedback(isCorrect) {
  const container = elements.cubeContainer;
  container.classList.add(isCorrect ? 'feedback-correct' : 'feedback-wrong');
  setTimeout(() => {
    container.classList.remove('feedback-correct', 'feedback-wrong');
  }, 250);
}

/**
 * Beendet die Übung und zeigt Ergebnisse
 */
function finishExercise() {
  const totalTime = performance.now() - state.startTime;
  const correctAnswers = state.rounds.filter(r => r.correct).length;
  const accuracyPercent = Math.round((correctAnswers / state.totalRounds) * 100);

  // Ergebnis-Tabelle füllen
  elements.resultBody.innerHTML = '';
  state.rounds.forEach((round, index) => {
    const row = document.createElement('tr');
    row.className = round.correct ? 'result-correct' : 'result-wrong';
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${round.isCorrect ? 'Richtig' : 'Falsch'}</td>
      <td>${round.userAnswer ? 'J (Richtig)' : 'K (Falsch)'}</td>
      <td>${round.correct ? '✓' : '✗'}</td>
      <td>${(round.time / 1000).toFixed(2)}s</td>
    `;
    elements.resultBody.appendChild(row);
  });

  // Zusammenfassung
  elements.totalTime.textContent = (totalTime / 1000).toFixed(2);
  elements.correctCount.textContent = `${correctAnswers} / ${state.totalRounds}`;
  elements.accuracy.textContent = accuracyPercent;

  // Würfel zurücksetzen
  resetCubeColors();

  showState(AppState.RESULT);
}

/**
 * Zurück zum Menü
 */
function backToMenu() {
  resetCubeColors();
  showState(AppState.MENU);
}

/**
 * Übung wiederholen
 */
function restartExercise() {
  showState(AppState.READY);
}

/**
 * Zeigt einen bestimmten State an
 */
function showState(newState) {
  state.currentState = newState;

  // Alle Screens verstecken
  elements.menuScreen.classList.add('hidden');
  elements.readyScreen.classList.add('hidden');
  elements.runningScreen.classList.add('hidden');
  elements.resultScreen.classList.add('hidden');

  // Cube Container je nach State anzeigen
  if (newState === AppState.RUNNING) {
    elements.cubeContainer.classList.remove('hidden');
  } else {
    elements.cubeContainer.classList.add('hidden');
  }

  // Aktiven Screen anzeigen
  switch (newState) {
    case AppState.MENU:
      elements.menuScreen.classList.remove('hidden');
      break;
    case AppState.READY:
      elements.readyScreen.classList.remove('hidden');
      break;
    case AppState.RUNNING:
      elements.runningScreen.classList.remove('hidden');
      break;
    case AppState.RESULT:
      elements.resultScreen.classList.remove('hidden');
      break;
  }
}

/**
 * Keyboard Event Handler
 */
function handleKeyPress(event) {
  const key = event.key.toLowerCase();

  switch (state.currentState) {
    case AppState.READY:
      if (key === ' ' || event.code === 'Space') {
        event.preventDefault();
        startExercise();
      }
      break;

    case AppState.RUNNING:
      if (key === 'j') {
        submitAnswer(true);  // User sagt: "Ist richtig"
      } else if (key === 'k') {
        submitAnswer(false); // User sagt: "Ist falsch"
      }
      break;

    case AppState.RESULT:
      if (key === ' ' || event.code === 'Space') {
        event.preventDefault();
        restartExercise();
      } else if (key === 'escape' || key === 'm') {
        backToMenu();
      }
      break;
  }
}

// App starten wenn DOM geladen
document.addEventListener('DOMContentLoaded', initApp);

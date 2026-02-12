/**
 * CubeLearner - Hauptanwendungslogik
 * State Machine für das Training
 */

// App State
const AppState = {
  MENU: 'menu',
  INFO: 'info',
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
    infoScreen: document.getElementById('info-screen'),
    infoExerciseName: document.getElementById('info-exercise-name'),
    infoContent: document.getElementById('info-content'),
    btnInfoBack: document.getElementById('btn-info-back'),
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
    accuracy: document.getElementById('accuracy'),
    // Buttons - Richtig/Falsch
    answerButtons: document.getElementById('answer-buttons'),
    btnCorrect: document.getElementById('btn-correct'),
    btnWrong: document.getElementById('btn-wrong'),
    btnExit: document.getElementById('btn-exit'),
    // Buttons - Farbwahl
    colorButtons: document.getElementById('color-buttons'),
    btnGreen: document.getElementById('btn-green'),
    btnRed: document.getElementById('btn-red'),
    btnBlue: document.getElementById('btn-blue'),
    btnOrange: document.getElementById('btn-orange'),
    btnExitColor: document.getElementById('btn-exit-color'),
    // Buttons - Eck-Position
    cornerButtons: document.getElementById('corner-buttons'),
    btnCornerFL: document.getElementById('btn-corner-fl'),
    btnCornerBL: document.getElementById('btn-corner-bl'),
    btnCornerBR: document.getElementById('btn-corner-br'),
    btnCornerFR: document.getElementById('btn-corner-fr'),
    btnExitCorner: document.getElementById('btn-exit-corner'),
    // Andere Buttons
    btnStart: document.getElementById('btn-start'),
    btnBackMenu: document.getElementById('btn-back-menu'),
    btnRestart: document.getElementById('btn-restart'),
    btnMenu: document.getElementById('btn-menu')
  };

  // Würfel erstellen
  createCube(elements.svgElement, 300);

  // Übungsliste rendern
  renderExerciseList();

  // Keyboard Events
  document.addEventListener('keydown', handleKeyPress);

  // Button Events
  initButtonHandlers();

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
    const wrapper = document.createElement('div');
    wrapper.className = 'exercise-button-wrapper';

    const button = document.createElement('button');
    button.className = 'exercise-button';
    button.innerHTML = `
      <strong>${ex.name}</strong>
      <span>${ex.description}</span>
    `;
    button.addEventListener('click', () => selectExercise(ex.id));

    const infoBtn = document.createElement('button');
    infoBtn.className = 'btn-info';
    infoBtn.innerHTML = 'ⓘ';
    infoBtn.title = 'Info zur Übung';
    infoBtn.addEventListener('click', () => showInfo(ex.id));

    wrapper.appendChild(button);
    wrapper.appendChild(infoBtn);
    elements.exerciseList.appendChild(wrapper);
  });

  // Generelle Info-Button
  const generalInfoBtn = document.createElement('button');
  generalInfoBtn.className = 'exercise-button general-info-button';
  generalInfoBtn.innerHTML = `
    <strong>Über CubeLearner</strong>
    <span>Was diese App trainiert und wie das Farbschema funktioniert</span>
  `;
  generalInfoBtn.addEventListener('click', showGeneralInfo);
  elements.exerciseList.appendChild(generalInfoBtn);
}

/**
 * Zeigt die Info-Seite für eine Übung
 */
function showInfo(exerciseId) {
  const exercise = getExercise(exerciseId);
  elements.infoExerciseName.textContent = exercise.name;
  elements.infoContent.innerHTML = exercise.infoHTML;

  // Beispiel-Cube anzeigen
  resetCubeColors();
  if (exercise.infoPattern) {
    exercise.infoPattern.forEach(p => {
      if (p.color === 'highlight') {
        highlightField(p.face, p.row, p.col);
      } else {
        setFieldColor(p.face, p.row, p.col, p.color);
      }
    });
  }

  showState(AppState.INFO);
}

/**
 * Zeigt die generelle Info-Seite
 */
function showGeneralInfo() {
  elements.infoExerciseName.textContent = 'Über CubeLearner';
  elements.infoContent.innerHTML = `
    <h3>Worum geht es?</h3>
    <p>Du kannst den Rubik's Cube bereits mit der <strong>Anfängermethode</strong>
    (Layer-by-Layer) lösen — und möchtest jetzt <strong>schneller</strong> werden.</p>
    <p>Ein großer Teil der Lösungszeit geht nicht für das Drehen verloren, sondern für
    das <strong>Suchen und Erkennen</strong> von Farbmustern. Welche Kante gehört wohin?
    Welche Ecke passt zu welcher Position?</p>
    <p>Genau das trainiert CubeLearner: Deine <strong>visuelle Wahrnehmung</strong> der
    Farbpositionen auf dem Würfel. Je schneller du Farben und ihre Zusammenhänge erkennst,
    desto weniger Denkpausen brauchst du beim Lösen.</p>

    <h3>Das Farbschema</h3>
    <p>CubeLearner verwendet das <strong>westliche Standard-Farbschema</strong>. Dieses
    Schema ist bei den meisten Würfeln (z.B. von Rubik's, GAN, MoYu) voreingestellt.</p>

    <h3>Gegenüberliegende Seiten</h3>
    <p>Jeweils zwei Farben liegen sich immer gegenüber:</p>
    <ul>
      <li><strong>Weiß ↔ Gelb</strong> (oben/unten)</li>
      <li><strong>Rot ↔ Orange</strong></li>
      <li><strong>Blau ↔ Grün</strong></li>
    </ul>

    <h3>Reihenfolge der Seitenfarben</h3>
    <p>Wenn <strong>Gelb oben</strong> ist und du von oben auf den Würfel schaust, gehen
    die 4 Seitenfarben im <strong>Uhrzeigersinn</strong>:</p>
    <p><strong>Rot → Grün → Orange → Blau → Rot …</strong></p>
    <p>Daraus kannst du alle Nachbarschaften ableiten:</p>
    <ul>
      <li>Grün hat links <strong>Rot</strong> und rechts <strong>Orange</strong></li>
      <li>Rot hat links <strong>Blau</strong> und rechts <strong>Grün</strong></li>
      <li>Blau hat links <strong>Orange</strong> und rechts <strong>Rot</strong></li>
      <li>Orange hat links <strong>Grün</strong> und rechts <strong>Blau</strong></li>
    </ul>

    <h3>Die Übungen</h3>
    <p>Die 4 Übungen trainieren verschiedene Aspekte dieser Farberkennung — von einfachen
    Kantenpaaren bis hin zu kompletten Eckpositionen. Tippe im Menü auf das
    <strong>ⓘ</strong>-Symbol neben einer Übung, um eine detaillierte Erklärung zu erhalten.</p>
  `;

  showState(AppState.INFO);
  // Kein Beispiel-Cube für die generelle Info
  elements.cubeContainer.classList.add('hidden');
}

/**
 * Wählt eine Übung aus und geht zum Ready-Screen
 */
function selectExercise(exerciseId) {
  state.selectedExercise = getExercise(exerciseId);
  state.totalRounds = state.selectedExercise.rounds;
  elements.exerciseName.textContent = state.selectedExercise.name;

  // Zeige die richtigen Key-Hints
  updateKeyHints();

  showState(AppState.READY);
}

/**
 * Aktualisiert die Key-Hints auf dem Ready-Screen je nach Übungstyp
 */
function updateKeyHints() {
  const keyHintsBoolean = document.getElementById('key-hints-boolean');
  const keyHintsColor = document.getElementById('key-hints-color');
  const keyHintsCorner = document.getElementById('key-hints-corner');

  // Alle verstecken
  keyHintsBoolean.classList.add('hidden');
  keyHintsColor.classList.add('hidden');
  keyHintsCorner.classList.add('hidden');

  // Je nach Übungstyp anzeigen
  const answerType = state.selectedExercise.answerType;
  if (answerType === 'color-choice') {
    keyHintsColor.classList.remove('hidden');
  } else if (answerType === 'corner-position') {
    keyHintsCorner.classList.remove('hidden');
  } else {
    keyHintsBoolean.classList.remove('hidden');
  }
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
    if (p.color === 'highlight') {
      highlightField(p.face, p.row, p.col);
    } else {
      setFieldColor(p.face, p.row, p.col, p.color);
    }
  });

  // Timer starten
  state.roundStartTime = performance.now();
}

/**
 * Verarbeitet die Antwort des Benutzers (Richtig/Falsch)
 */
function submitAnswer(userSaysCorrect) {
  if (state.currentState !== AppState.RUNNING) return;
  if (state.selectedExercise.answerType === 'color-choice') return;

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
 * Verarbeitet die Farb-Antwort des Benutzers
 */
function submitColorAnswer(chosenColor) {
  if (state.currentState !== AppState.RUNNING) return;
  if (state.selectedExercise.answerType !== 'color-choice') return;

  const roundTime = performance.now() - state.roundStartTime;
  const currentRoundData = state.rounds[state.currentRound];

  currentRoundData.userAnswer = chosenColor;
  currentRoundData.correct = (chosenColor === currentRoundData.correctColor);
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
 * Verarbeitet die Eck-Position-Antwort des Benutzers
 */
function submitCornerAnswer(chosenPosition) {
  if (state.currentState !== AppState.RUNNING) return;
  if (state.selectedExercise.answerType !== 'corner-position') return;

  const roundTime = performance.now() - state.roundStartTime;
  const currentRoundData = state.rounds[state.currentRound];

  currentRoundData.userAnswer = chosenPosition;
  currentRoundData.correct = (chosenPosition === currentRoundData.correctPosition);
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
  const answerType = state.selectedExercise.answerType;

  state.rounds.forEach((round, index) => {
    const row = document.createElement('tr');
    row.className = round.correct ? 'result-correct' : 'result-wrong';

    let patternText, answerText;
    if (answerType === 'color-choice') {
      patternText = translateColor(round.correctColor);
      answerText = translateColor(round.userAnswer);
    } else if (answerType === 'corner-position') {
      patternText = translateCorner(round.correctPosition);
      answerText = translateCorner(round.userAnswer);
    } else {
      patternText = round.isCorrect ? 'Richtig' : 'Falsch';
      answerText = round.userAnswer ? 'J (Richtig)' : 'K (Falsch)';
    }

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${patternText}</td>
      <td>${answerText}</td>
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
  elements.infoScreen.classList.add('hidden');
  elements.readyScreen.classList.add('hidden');
  elements.runningScreen.classList.add('hidden');
  elements.resultScreen.classList.add('hidden');

  // Cube Container und Answer Buttons je nach State anzeigen
  if (newState === AppState.RUNNING) {
    elements.cubeContainer.classList.remove('hidden');
    // Je nach Übungstyp richtige Buttons anzeigen
    elements.answerButtons.classList.add('hidden');
    elements.colorButtons.classList.add('hidden');
    elements.cornerButtons.classList.add('hidden');

    if (state.selectedExercise.answerType === 'color-choice') {
      elements.colorButtons.classList.remove('hidden');
    } else if (state.selectedExercise.answerType === 'corner-position') {
      elements.cornerButtons.classList.remove('hidden');
    } else {
      elements.answerButtons.classList.remove('hidden');
    }
  } else if (newState === AppState.INFO) {
    elements.cubeContainer.classList.remove('hidden');
    elements.answerButtons.classList.add('hidden');
    elements.colorButtons.classList.add('hidden');
    elements.cornerButtons.classList.add('hidden');
  } else {
    elements.cubeContainer.classList.add('hidden');
    elements.answerButtons.classList.add('hidden');
    elements.colorButtons.classList.add('hidden');
    elements.cornerButtons.classList.add('hidden');
  }

  // Aktiven Screen anzeigen
    switch (newState) {
    case AppState.MENU:
      elements.menuScreen.classList.remove('hidden');
      break;
    case AppState.INFO:
      elements.infoScreen.classList.remove('hidden');
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
 * Initialisiert Button Event Handler
 */
function initButtonHandlers() {
  // Info Screen
  elements.btnInfoBack.addEventListener('click', backToMenu);

  // Ready Screen
  elements.btnStart.addEventListener('click', startExercise);
  elements.btnBackMenu.addEventListener('click', backToMenu);

  // Running Screen (Richtig/Falsch-Buttons)
  elements.btnCorrect.addEventListener('click', () => submitAnswer(true));
  elements.btnWrong.addEventListener('click', () => submitAnswer(false));
  elements.btnExit.addEventListener('click', backToMenu);

  // Running Screen (Farb-Buttons)
  elements.btnGreen.addEventListener('click', () => submitColorAnswer('green'));
  elements.btnRed.addEventListener('click', () => submitColorAnswer('red'));
  elements.btnBlue.addEventListener('click', () => submitColorAnswer('blue'));
  elements.btnOrange.addEventListener('click', () => submitColorAnswer('orange'));
  elements.btnExitColor.addEventListener('click', backToMenu);

  // Running Screen (Eck-Position-Buttons)
  elements.btnCornerFL.addEventListener('click', () => submitCornerAnswer('FL'));
  elements.btnCornerBL.addEventListener('click', () => submitCornerAnswer('BL'));
  elements.btnCornerBR.addEventListener('click', () => submitCornerAnswer('BR'));
  elements.btnCornerFR.addEventListener('click', () => submitCornerAnswer('FR'));
  elements.btnExitCorner.addEventListener('click', backToMenu);

  // Result Screen
  elements.btnRestart.addEventListener('click', restartExercise);
  elements.btnMenu.addEventListener('click', backToMenu);
}

/**
 * Keyboard Event Handler
 */
function handleKeyPress(event) {
  const key = event.key.toLowerCase();

  switch (state.currentState) {
    case AppState.INFO:
      if (key === 'escape') {
        backToMenu();
      }
      break;

    case AppState.READY:
      if (key === ' ' || event.code === 'Space') {
        event.preventDefault();
        startExercise();
      } else if (key === 'escape') {
        backToMenu();
      }
      break;

    case AppState.RUNNING:
      if (state.selectedExercise.answerType === 'color-choice') {
        // Farbwahl-Modus: 1-4 für Farben
        if (key === '1') {
          submitColorAnswer('green');
        } else if (key === '2') {
          submitColorAnswer('red');
        } else if (key === '3') {
          submitColorAnswer('blue');
        } else if (key === '4') {
          submitColorAnswer('orange');
        } else if (key === 'escape') {
          backToMenu();
        }
      } else if (state.selectedExercise.answerType === 'corner-position') {
        // Eck-Position-Modus: 1-4 für Ecken
        if (key === '1') {
          submitCornerAnswer('FL');
        } else if (key === '2') {
          submitCornerAnswer('BL');
        } else if (key === '3') {
          submitCornerAnswer('BR');
        } else if (key === '4') {
          submitCornerAnswer('FR');
        } else if (key === 'escape') {
          backToMenu();
        }
      } else {
        // Richtig/Falsch-Modus: J/K
        if (key === 'j') {
          submitAnswer(true);  // User sagt: "Ist richtig"
        } else if (key === 'k') {
          submitAnswer(false); // User sagt: "Ist falsch"
        } else if (key === 'escape') {
          backToMenu();
        }
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

/**
 * Übersetzt Farbnamen ins Deutsche
 */
function translateColor(color) {
  const translations = {
    'green': 'Grün',
    'red': 'Rot',
    'blue': 'Blau',
    'orange': 'Orange',
    'yellow': 'Gelb',
    'white': 'Weiß'
  };
  return translations[color] || color;
}

/**
 * Übersetzt Eck-Positionen ins Deutsche
 */
function translateCorner(position) {
  const translations = {
    'FL': '↙ V-Links',
    'BL': '↖ H-Links',
    'BR': '↗ H-Rechts',
    'FR': '↘ V-Rechts'
  };
  return translations[position] || position;
}

// App starten wenn DOM geladen
document.addEventListener('DOMContentLoaded', initApp);

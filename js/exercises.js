/**
 * CubeLearner - Übungen
 * Definition der verfügbaren Übungen
 */

const EXERCISES = {
  'edge-pair-recognition': {
    id: 'edge-pair-recognition',
    name: 'Kantenpaar-Erkennung',
    description: 'Erkenne ob Front oben-mitte und Links oben-mitte korrekt eingefärbt sind',
    rounds: 10,

    // Die korrekte Kombination: Front row=0, col=1 UND Left row=0, col=0 (vorderste Spalte)
    correctPattern: [
      { face: 'front', row: 0, col: 1, color: 'green' },
      { face: 'left', row: 0, col: 0, color: 'orange' }
    ],

    // Generiert eine zufällige Kombination (richtig oder falsch)
    generateRound() {
      const isCorrect = Math.random() < 0.5;

      if (isCorrect) {
        return {
          pattern: this.correctPattern,
          isCorrect: true
        };
      } else {
        // Generiere eine falsche Kombination
        const wrongPatterns = [
          // Falsche Position auf Front
          [
            { face: 'front', row: 0, col: 0, color: 'green' },
            { face: 'left', row: 0, col: 0, color: 'orange' }
          ],
          [
            { face: 'front', row: 0, col: 2, color: 'green' },
            { face: 'left', row: 0, col: 0, color: 'orange' }
          ],
          [
            { face: 'front', row: 1, col: 1, color: 'green' },
            { face: 'left', row: 0, col: 0, color: 'orange' }
          ],
          // Falsche Position auf Left
          [
            { face: 'front', row: 0, col: 1, color: 'green' },
            { face: 'left', row: 0, col: 1, color: 'orange' }
          ],
          [
            { face: 'front', row: 0, col: 1, color: 'green' },
            { face: 'left', row: 0, col: 2, color: 'orange' }
          ],
          [
            { face: 'front', row: 0, col: 1, color: 'green' },
            { face: 'left', row: 1, col: 0, color: 'orange' }
          ],
          // Beide falsch
          [
            { face: 'front', row: 1, col: 0, color: 'green' },
            { face: 'left', row: 1, col: 1, color: 'orange' }
          ],
          [
            { face: 'front', row: 2, col: 1, color: 'green' },
            { face: 'left', row: 2, col: 0, color: 'orange' }
          ]
        ];

        const randomWrong = wrongPatterns[Math.floor(Math.random() * wrongPatterns.length)];
        return {
          pattern: randomWrong,
          isCorrect: false
        };
      }
    }
  }
};

/**
 * Gibt alle verfügbaren Übungen zurück
 */
function getExerciseList() {
  return Object.values(EXERCISES).map(ex => ({
    id: ex.id,
    name: ex.name,
    description: ex.description
  }));
}

/**
 * Gibt eine bestimmte Übung zurück
 */
function getExercise(id) {
  return EXERCISES[id];
}

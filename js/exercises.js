/**
 * CubeLearner - Übungen
 * Definition der verfügbaren Übungen
 *
 * Standard Rubik's Cube Farbschema (Westliches Schema):
 * - Gegenüberliegende Seiten: Weiß ↔ Gelb, Rot ↔ Orange, Blau ↔ Grün
 * - Bei Gelb oben, im Uhrzeigersinn von oben: Rot → Grün → Orange → Blau
 *
 * Das bedeutet für die Seitenfarben (wenn Gelb oben ist):
 * - Front = Grün  → Links = Orange, Rechts = Rot
 * - Front = Rot   → Links = Grün,   Rechts = Blau
 * - Front = Blau  → Links = Rot,    Rechts = Orange
 * - Front = Orange → Links = Blau,  Rechts = Grün
 */

// Die 4 Seitenfarben (ohne Gelb/Weiß)
const SIDE_COLORS = ['green', 'red', 'blue', 'orange'];

// Die 3 sichtbaren oberen mittleren Felder
const VISIBLE_FIELDS = [
  { face: 'front', row: 0, col: 1, name: 'Front' },
  { face: 'left', row: 0, col: 1, name: 'Links' },
  { face: 'right', row: 0, col: 1, name: 'Rechts' }
];

// Alle möglichen Feld-Kombinationen (2 aus 3)
const FIELD_COMBINATIONS = [
  { fields: ['front', 'left'], name: 'Front-Links' },
  { fields: ['front', 'right'], name: 'Front-Rechts' },
  { fields: ['left', 'right'], name: 'Links-Rechts' }
];

/**
 * Korrekte Farbpaare für jede Feld-Kombination
 *
 * Im Uhrzeigersinn von oben (mit Gelb oben): Rot → Grün → Orange → Blau
 *
 * Front-Links: Links ist im Uhrzeigersinn VOR Front
 * Front-Rechts: Rechts ist im Uhrzeigersinn NACH Front
 * Links-Rechts: Beide müssen zur gleichen Front-Farbe passen
 */
const CORRECT_PAIRS = {
  // Front → Links (Links ist die vorherige Farbe im Uhrzeigersinn)
  'front-left': {
    'green': 'orange',
    'red': 'green',
    'blue': 'red',
    'orange': 'blue'
  },

  // Front → Rechts (Rechts ist die nächste Farbe im Uhrzeigersinn)
  'front-right': {
    'green': 'red',
    'red': 'blue',
    'blue': 'orange',
    'orange': 'green'
  },

  // Links → Rechts (beide müssen zur gleichen impliziten Front passen)
  // Wenn Front=Grün: Links=Orange, Rechts=Rot
  // Wenn Front=Rot: Links=Grün, Rechts=Blau
  // Wenn Front=Blau: Links=Rot, Rechts=Orange
  // Wenn Front=Orange: Links=Blau, Rechts=Grün
  'left-right': {
    'orange': 'red',    // Front wäre Grün
    'green': 'blue',    // Front wäre Rot
    'red': 'orange',    // Front wäre Blau
    'blue': 'green'     // Front wäre Orange
  }
};

/**
 * Prüft ob ein Farbpaar für eine bestimmte Feld-Kombination korrekt ist
 */
function isPairCorrect(field1, field2, color1, color2) {
  // Sortiere die Felder alphabetisch für konsistenten Key
  const sortedFields = [field1, field2].sort();
  const key = sortedFields.join('-');

  const correctPairs = CORRECT_PAIRS[key];
  if (!correctPairs) return false;

  // Prüfe in beide Richtungen
  if (sortedFields[0] === field1) {
    // field1 ist das erste im sortierten Array
    return correctPairs[color1] === color2;
  } else {
    // field2 ist das erste im sortierten Array
    return correctPairs[color2] === color1;
  }
}

/**
 * Generiert alle möglichen Kombinationen für eine Feld-Paarung
 */
function generateAllPairsForFields(field1, field2) {
  const pairs = [];

  SIDE_COLORS.forEach(color1 => {
    SIDE_COLORS.forEach(color2 => {
      // Gleiche Farbe ist nicht möglich
      if (color1 === color2) return;

      const isCorrect = isPairCorrect(field1, field2, color1, color2);
      pairs.push({
        field1,
        field2,
        color1,
        color2,
        isCorrect
      });
    });
  });

  return pairs;
}

/**
 * Holt die Feld-Definition für einen Feld-Namen
 */
function getFieldDef(fieldName) {
  return VISIBLE_FIELDS.find(f => f.face === fieldName);
}

const EXERCISES = {
  'edge-pair-recognition': {
    id: 'edge-pair-recognition',
    name: 'Kantenpaar-Erkennung',
    description: 'Erkenne ob zwei zufällig gewählte obere Kantenfarben korrekt zueinander liegen',
    rounds: 10,

    // Generiert eine zufällige Runde
    generateRound() {
      // 1. Wähle zufällig 2 der 3 Felder
      const combinationIndex = Math.floor(Math.random() * FIELD_COMBINATIONS.length);
      const combination = FIELD_COMBINATIONS[combinationIndex];
      const [field1Name, field2Name] = combination.fields;

      // 2. Generiere alle Paare für diese Kombination
      const allPairs = generateAllPairsForFields(field1Name, field2Name);
      const correctPairs = allPairs.filter(p => p.isCorrect);
      const wrongPairs = allPairs.filter(p => !p.isCorrect);

      // 3. Wähle 50% richtig / 50% falsch
      const shouldBeCorrect = Math.random() < 0.5;
      const selectedPair = shouldBeCorrect
        ? correctPairs[Math.floor(Math.random() * correctPairs.length)]
        : wrongPairs[Math.floor(Math.random() * wrongPairs.length)];

      // 4. Hole die Feld-Definitionen
      const field1Def = getFieldDef(field1Name);
      const field2Def = getFieldDef(field2Name);

      return {
        pattern: [
          { face: field1Def.face, row: field1Def.row, col: field1Def.col, color: selectedPair.color1 },
          { face: field2Def.face, row: field2Def.row, col: field2Def.col, color: selectedPair.color2 }
        ],
        isCorrect: selectedPair.isCorrect,
        combination: combination.name,
        color1: selectedPair.color1,
        color2: selectedPair.color2
      };
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

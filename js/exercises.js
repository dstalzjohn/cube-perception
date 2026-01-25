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

// ============================================================
// ECKEN-DEFINITIONEN
// ============================================================

/**
 * Die 4 oberen Ecken des Würfels
 * Jede Ecke hat 3 Farben: Gelb + zwei benachbarte Seitenfarben
 * Die Farben sind als Set definiert (Reihenfolge egal für Identifikation)
 */
const UPPER_CORNERS = [
  ['yellow', 'green', 'orange'],   // Vorne-Links bei Grün vorne
  ['yellow', 'green', 'red'],      // Vorne-Rechts bei Grün vorne
  ['yellow', 'blue', 'red'],       // Vorne-Rechts bei Blau vorne
  ['yellow', 'blue', 'orange']     // Vorne-Links bei Blau vorne
];

/**
 * Korrekte Ecke für jede Kanten-Farbe und Position
 * Key: Kantenfarbe
 * Value: { left: [Eckenfarben], right: [Eckenfarben] }
 */
const CORRECT_CORNER_FOR_EDGE = {
  'green': {
    left: ['yellow', 'green', 'orange'],
    right: ['yellow', 'green', 'red']
  },
  'red': {
    left: ['yellow', 'red', 'green'],
    right: ['yellow', 'red', 'blue']
  },
  'blue': {
    left: ['yellow', 'blue', 'red'],
    right: ['yellow', 'blue', 'orange']
  },
  'orange': {
    left: ['yellow', 'orange', 'blue'],
    right: ['yellow', 'orange', 'green']
  }
};

/**
 * Eck-Positionen auf dem Würfel
 * Für linke und rechte obere Ecke
 */
const CORNER_POSITIONS = {
  left: [
    { face: 'front', row: 0, col: 0 },
    { face: 'left', row: 0, col: 0 },
    { face: 'top', row: 0, col: 0 }
  ],
  right: [
    { face: 'front', row: 0, col: 2 },
    { face: 'right', row: 0, col: 0 },
    { face: 'top', row: 0, col: 2 }
  ]
};

/**
 * Prüft ob zwei Ecken gleich sind (als Farb-Sets)
 */
function cornersEqual(corner1, corner2) {
  const set1 = new Set(corner1);
  const set2 = new Set(corner2);
  if (set1.size !== set2.size) return false;
  for (const color of set1) {
    if (!set2.has(color)) return false;
  }
  return true;
}

/**
 * Rotiert ein Array um n Positionen
 */
function rotateArray(arr, n) {
  const len = arr.length;
  const rotation = ((n % len) + len) % len;
  return [...arr.slice(rotation), ...arr.slice(0, rotation)];
}

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

// ============================================================
// ÜBUNGEN
// ============================================================

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
  },

  'corner-edge-recognition': {
    id: 'corner-edge-recognition',
    name: 'Ecke-Kante-Erkennung',
    description: 'Erkenne ob die Ecke zur Kante gehört (Position, nicht Orientierung)',
    rounds: 10,

    generateRound() {
      // 1. Wähle zufällige Kantenfarbe
      const edgeColor = SIDE_COLORS[Math.floor(Math.random() * SIDE_COLORS.length)];

      // 2. Wähle zufällig linke oder rechte Ecke
      const cornerSide = Math.random() < 0.5 ? 'left' : 'right';

      // 3. Bestimme die korrekte Ecke für diese Kombination
      const correctCorner = CORRECT_CORNER_FOR_EDGE[edgeColor][cornerSide];

      // 4. Entscheide ob richtig oder falsch (50/50)
      const shouldBeCorrect = Math.random() < 0.5;

      // 5. Wähle die anzuzeigende Ecke
      let displayedCorner;
      if (shouldBeCorrect) {
        displayedCorner = [...correctCorner];
      } else {
        // Wähle eine falsche Ecke (eine der anderen 3)
        const wrongCorners = UPPER_CORNERS.filter(c => !cornersEqual(c, correctCorner));
        displayedCorner = [...wrongCorners[Math.floor(Math.random() * wrongCorners.length)]];
      }

      // 6. Zufällige Orientierung der Ecke (0, 1 oder 2 Rotationen)
      const orientation = Math.floor(Math.random() * 3);
      const rotatedColors = rotateArray(displayedCorner, orientation);

      // 7. Erstelle das Pattern
      const cornerPositions = CORNER_POSITIONS[cornerSide];
      const pattern = [
        // Kante (Front oben-mitte)
        { face: 'front', row: 0, col: 1, color: edgeColor },
        // Ecke (3 Felder)
        { face: cornerPositions[0].face, row: cornerPositions[0].row, col: cornerPositions[0].col, color: rotatedColors[0] },
        { face: cornerPositions[1].face, row: cornerPositions[1].row, col: cornerPositions[1].col, color: rotatedColors[1] },
        { face: cornerPositions[2].face, row: cornerPositions[2].row, col: cornerPositions[2].col, color: rotatedColors[2] }
      ];

      return {
        pattern,
        isCorrect: shouldBeCorrect,
        edgeColor,
        cornerSide: cornerSide === 'left' ? 'Links' : 'Rechts',
        cornerColors: displayedCorner,
        orientation
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

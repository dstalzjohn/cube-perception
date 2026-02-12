/**
 * CubeLearner - Übungen
 * Definition der verfügbaren Übungen
 *
 * Standard Rubik's Cube Farbschema (Westliches Schema):
 * - Gegenüberliegende Seiten: Weiß ↔ Gelb, Rot ↔ Orange, Blau ↔ Grün
 * - Bei Gelb oben, im Uhrzeigersinn von oben: Rot → Grün → Orange → Blau
 *
 * Das bedeutet für die Seitenfarben (wenn Gelb oben ist):
 * - Front = Grün  → Links = Rot,    Rechts = Orange
 * - Front = Rot   → Links = Blau,   Rechts = Grün
 * - Front = Blau  → Links = Orange, Rechts = Rot
 * - Front = Orange → Links = Grün,  Rechts = Blau
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
 * Nachbarfarben im Uhrzeigersinn (von oben gesehen mit Gelb oben)
 * Rot → Grün → Orange → Blau → Rot
 */
const CLOCKWISE_NEIGHBORS = {
  'green': { left: 'red', right: 'orange', opposite: 'blue' },
  'red': { left: 'blue', right: 'green', opposite: 'orange' },
  'blue': { left: 'orange', right: 'red', opposite: 'green' },
  'orange': { left: 'green', right: 'blue', opposite: 'red' }
};

/**
 * Die 4 Eck-Positionen und ihre sichtbaren Facetten
 * FL = Vorne-Links, BL = Hinten-Links, BR = Hinten-Rechts, FR = Vorne-Rechts
 */
const CORNER_POSITION_DATA = {
  FL: {
    name: 'Vorne-Links',
    positions: [
      { face: 'top', row: 0, col: 0 },
      { face: 'front', row: 0, col: 0 },
      { face: 'left', row: 0, col: 0 }
    ]
  },
  BL: {
    name: 'Hinten-Links',
    positions: [
      { face: 'top', row: 2, col: 0 },
      { face: 'left', row: 0, col: 2 }
      // back nicht sichtbar
    ]
  },
  BR: {
    name: 'Hinten-Rechts',
    positions: [
      { face: 'top', row: 2, col: 2 },
      { face: 'right', row: 0, col: 2 }
      // back nicht sichtbar
    ]
  },
  FR: {
    name: 'Vorne-Rechts',
    positions: [
      { face: 'top', row: 0, col: 2 },
      { face: 'front', row: 0, col: 2 },
      { face: 'right', row: 0, col: 0 }
    ]
  }
};

/**
 * Eck-Positions-Reihenfolge für Buttons (gegen Uhrzeigersinn von FL)
 */
const CORNER_BUTTON_ORDER = ['FL', 'BL', 'BR', 'FR'];

/**
 * Generiert die korrekten Ecken für eine gegebene Front-Farbe
 *
 * Die Reihenfolge der Farben entspricht den sichtbaren Positionen in CORNER_POSITION_DATA:
 * - FL: [top, front, left]
 * - FR: [top, front, right]
 * - BL: [top, left, back] - back nicht sichtbar
 * - BR: [top, right, back] - back nicht sichtbar
 *
 * Bei korrekter Orientierung: erste Farbe = yellow (zeigt nach oben)
 */
function getCornersForFront(frontColor) {
  const neighbors = CLOCKWISE_NEIGHBORS[frontColor];
  const leftColor = neighbors.left;
  const rightColor = neighbors.right;
  const backColor = neighbors.opposite;

  return {
    FL: ['yellow', frontColor, leftColor],
    FR: ['yellow', frontColor, rightColor],
    BL: ['yellow', leftColor, backColor],
    BR: ['yellow', rightColor, backColor]
  };
}

/**
 * Korrekte Ecke für jede Kanten-Farbe und Position
 * Key: Kantenfarbe
 * Value: { left: [Eckenfarben], right: [Eckenfarben] }
 */
const CORRECT_CORNER_FOR_EDGE = {
  'green': {
    left: ['yellow', 'green', 'red'],
    right: ['yellow', 'green', 'orange']
  },
  'red': {
    left: ['yellow', 'red', 'blue'],
    right: ['yellow', 'red', 'green']
  },
  'blue': {
    left: ['yellow', 'blue', 'orange'],
    right: ['yellow', 'blue', 'red']
  },
  'orange': {
    left: ['yellow', 'orange', 'green'],
    right: ['yellow', 'orange', 'blue']
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
  // Front → Links (Links ist die nächste Farbe im Uhrzeigersinn)
  'front-left': {
    'green': 'red',
    'red': 'blue',
    'blue': 'orange',
    'orange': 'green'
  },

  // Front → Rechts (Rechts ist die vorherige Farbe im Uhrzeigersinn)
  'front-right': {
    'green': 'orange',
    'red': 'green',
    'blue': 'red',
    'orange': 'blue'
  },

  // Links → Rechts (beide müssen zur gleichen impliziten Front passen)
  // Wenn Front=Grün: Links=Rot, Rechts=Orange
  // Wenn Front=Rot: Links=Blau, Rechts=Grün
  // Wenn Front=Blau: Links=Orange, Rechts=Rot
  // Wenn Front=Orange: Links=Grün, Rechts=Blau
  'left-right': {
    'red': 'orange',    // Front wäre Grün
    'blue': 'green',    // Front wäre Rot
    'orange': 'red',    // Front wäre Blau
    'green': 'blue'     // Front wäre Orange
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

    infoHTML: `
      <h3>Worum geht es?</h3>
      <p>Auf dem Würfel werden zwei der drei sichtbaren oberen Kantensteine eingefärbt.
      Du musst beurteilen, ob diese beiden Farben <strong>korrekt zueinander liegen</strong> —
      also ob sie so auch auf einem gelösten Würfel vorkommen würden.</p>

      <h3>Das Farbschema</h3>
      <p>Beim Standard-Rubik's-Cube (westliches Schema) mit <strong>Gelb oben</strong> gilt
      im Uhrzeigersinn von oben gesehen:</p>
      <p><strong>Rot → Grün → Orange → Blau → Rot</strong></p>

      <h3>Beispiele</h3>
      <ul>
        <li><strong>Front = Grün, Links = Rot</strong> → Richtig (Rot liegt links von Grün)</li>
        <li><strong>Front = Grün, Rechts = Orange</strong> → Richtig (Orange liegt rechts von Grün)</li>
        <li><strong>Front = Grün, Links = Blau</strong> → Falsch (Blau liegt gegenüber von Grün)</li>
        <li><strong>Links = Rot, Rechts = Orange</strong> → Richtig (Front wäre Grün)</li>
      </ul>

      <h3>Bedienung</h3>
      <p>Drücke <strong>J</strong> (oder den Button „Richtig"), wenn das Paar korrekt ist.<br>
      Drücke <strong>K</strong> (oder den Button „Falsch"), wenn das Paar nicht zusammenpasst.</p>
    `,

    infoPattern: [
      { face: 'front', row: 0, col: 1, color: 'green' },
      { face: 'left', row: 0, col: 1, color: 'red' },
      { face: 'top', row: 1, col: 1, color: 'yellow' }
    ],

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
          { face: field2Def.face, row: field2Def.row, col: field2Def.col, color: selectedPair.color2 },
          { face: 'top', row: 1, col: 1, color: 'yellow' }  // Orientierung (Zentrum)
        ],
        isCorrect: selectedPair.isCorrect,
        combination: combination.name,
        color1: selectedPair.color1,
        color2: selectedPair.color2
      };
    }
  },

  'edge-color-quiz': {
    id: 'edge-color-quiz',
    name: 'Kantenfarbe raten',
    description: 'Wähle die richtige Farbe für den markierten Kantenstein',
    rounds: 10,
    answerType: 'color-choice',  // Neuer Antworttyp

    infoHTML: `
      <h3>Worum geht es?</h3>
      <p>Ein Kantenstein wird mit seiner Farbe angezeigt, ein anderer ist <strong>markiert</strong>
      (hervorgehoben). Du musst die <strong>korrekte Farbe</strong> für den markierten Stein wählen,
      basierend auf dem Farbschema des Würfels.</p>

      <h3>Das Farbschema</h3>
      <p>Mit <strong>Gelb oben</strong>, im Uhrzeigersinn von oben:</p>
      <p><strong>Rot → Grün → Orange → Blau → Rot</strong></p>
      <p>Daraus ergeben sich die Nachbarfarben:</p>
      <ul>
        <li>Grün: Links = <strong>Rot</strong>, Rechts = <strong>Orange</strong></li>
        <li>Rot: Links = <strong>Blau</strong>, Rechts = <strong>Grün</strong></li>
        <li>Blau: Links = <strong>Orange</strong>, Rechts = <strong>Rot</strong></li>
        <li>Orange: Links = <strong>Grün</strong>, Rechts = <strong>Blau</strong></li>
      </ul>

      <h3>Beispiel</h3>
      <p>Im Beispiel-Würfel unten ist die Front-Kante <strong>Grün</strong> und die linke Kante
      ist markiert. Die richtige Antwort wäre <strong>Rot</strong>, weil Rot links von Grün liegt.</p>

      <h3>Bedienung</h3>
      <p>Wähle die richtige Farbe per Button oder mit den Tasten <strong>1-4</strong>
      (1=Grün, 2=Rot, 3=Blau, 4=Orange).</p>
    `,

    infoPattern: [
      { face: 'front', row: 0, col: 1, color: 'green' },
      { face: 'left', row: 0, col: 1, color: 'highlight' },
      { face: 'top', row: 1, col: 1, color: 'yellow' }
    ],

    generateRound() {
      // 1. Wähle zufällig 2 der 3 Felder
      const combinationIndex = Math.floor(Math.random() * FIELD_COMBINATIONS.length);
      const combination = FIELD_COMBINATIONS[combinationIndex];
      const [field1Name, field2Name] = combination.fields;

      // 2. Wähle zufällig welches Feld die Farbe zeigt und welches geraten werden muss
      const showFirst = Math.random() < 0.5;
      const shownField = showFirst ? field1Name : field2Name;
      const hiddenField = showFirst ? field2Name : field1Name;

      // 3. Wähle eine zufällige Farbe für das gezeigte Feld
      const shownColor = SIDE_COLORS[Math.floor(Math.random() * SIDE_COLORS.length)];

      // 4. Bestimme die korrekte Farbe für das versteckte Feld
      const sortedFields = [shownField, hiddenField].sort();
      const key = sortedFields.join('-');
      const correctPairs = CORRECT_PAIRS[key];

      let correctColor;
      if (sortedFields[0] === shownField) {
        // shownField ist erstes im Key
        correctColor = correctPairs[shownColor];
      } else {
        // hiddenField ist erstes im Key, also umgekehrt suchen
        correctColor = Object.keys(correctPairs).find(k => correctPairs[k] === shownColor);
      }

      // 5. Hole die Feld-Definitionen
      const shownFieldDef = getFieldDef(shownField);
      const hiddenFieldDef = getFieldDef(hiddenField);

      return {
        pattern: [
          { face: shownFieldDef.face, row: shownFieldDef.row, col: shownFieldDef.col, color: shownColor },
          { face: hiddenFieldDef.face, row: hiddenFieldDef.row, col: hiddenFieldDef.col, color: 'highlight' },
          { face: 'top', row: 1, col: 1, color: 'yellow' }  // Orientierung (Zentrum)
        ],
        correctColor: correctColor,
        shownField: shownField,
        hiddenField: hiddenField,
        shownColor: shownColor
      };
    }
  },

  'corner-edge-recognition': {
    id: 'corner-edge-recognition',
    name: 'Ecke-Kante-Erkennung',
    description: 'Erkenne ob die Ecke zur Kante gehört (Position, nicht Orientierung)',
    rounds: 10,

    infoHTML: `
      <h3>Worum geht es?</h3>
      <p>Auf dem Würfel werden eine <strong>Kante</strong> (oben-mitte der Front) und eine
      <strong>Ecke</strong> (3 Felder an einer Ecke) eingefärbt. Du musst beurteilen, ob die
      Ecke <strong>zur Kante gehört</strong> — also ob sie an dieser Position auf einem
      gelösten Würfel liegen würde.</p>

      <h3>Wichtig: Position, nicht Orientierung!</h3>
      <p>Es geht nur darum, ob die <strong>richtigen Farben</strong> in der Ecke sind — die
      Orientierung (welche Farbe wohin zeigt) spielt <strong>keine Rolle</strong>. Solange die
      Ecke die drei korrekten Farben enthält, ist sie richtig.</p>

      <h3>Beispiel</h3>
      <p>Die Front-Kante zeigt <strong>Grün</strong>. Die linke Ecke muss dann die Farben
      <strong>Gelb, Grün und Rot</strong> enthalten (egal in welcher Reihenfolge), weil die
      linke Ecke neben der grünen Kante die Farben Gelb (oben), Grün (Front) und Rot (links) hat.</p>

      <h3>Bedienung</h3>
      <p>Drücke <strong>J</strong> (oder „Richtig"), wenn die Ecke zur Kante gehört.<br>
      Drücke <strong>K</strong> (oder „Falsch"), wenn die Ecke nicht dorthin gehört.</p>
    `,

    infoPattern: [
      { face: 'front', row: 0, col: 1, color: 'green' },
      { face: 'front', row: 0, col: 0, color: 'green' },
      { face: 'left', row: 0, col: 0, color: 'red' },
      { face: 'top', row: 0, col: 0, color: 'yellow' },
      { face: 'top', row: 1, col: 1, color: 'yellow' }
    ],

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
        { face: cornerPositions[2].face, row: cornerPositions[2].row, col: cornerPositions[2].col, color: rotatedColors[2] },
        // Orientierung (Top Zentrum)
        { face: 'top', row: 1, col: 1, color: 'yellow' }
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
  },

  'find-correct-corner': {
    id: 'find-correct-corner',
    name: 'Richtige Ecke finden',
    description: 'Finde die eine Ecke, die an der richtigen Position ist',
    rounds: 10,
    answerType: 'corner-position',

    infoHTML: `
      <h3>Worum geht es?</h3>
      <p>Alle <strong>4 oberen Ecken</strong> und die <strong>Kanten und Zentren</strong> des
      Würfels werden eingefärbt. Allerdings ist nur <strong>eine einzige Ecke</strong> an der
      richtigen Position — die anderen drei sind zyklisch vertauscht. Finde die richtige!</p>

      <h3>Wie erkenne ich die richtige Ecke?</h3>
      <p>Jede Ecke hat 3 Farben. Auf einem gelösten Würfel muss jede Ecke genau die 3 Farben
      der angrenzenden Seiten enthalten. Vergleiche die Farben jeder Ecke mit den benachbarten
      Zentren und Kanten.</p>

      <h3>Beispiel</h3>
      <p>Wenn <strong>Grün</strong> vorne ist, <strong>Rot</strong> links und
      <strong>Orange</strong> rechts, dann gilt:</p>
      <ul>
        <li><strong>Vorne-Links (↙)</strong>: Gelb + Grün + Rot</li>
        <li><strong>Hinten-Links (↖)</strong>: Gelb + Rot + Blau</li>
        <li><strong>Hinten-Rechts (↗)</strong>: Gelb + Orange + Blau</li>
        <li><strong>Vorne-Rechts (↘)</strong>: Gelb + Grün + Orange</li>
      </ul>
      <p>Prüfe, welche der 4 angezeigten Ecken die korrekten Farben für ihre Position hat.</p>

      <h3>Bedienung</h3>
      <p>Wähle die richtige Ecke per Button oder mit den Tasten <strong>1-4</strong>
      (1=↙, 2=↖, 3=↗, 4=↘).</p>
    `,

    infoPattern: [
      { face: 'top', row: 1, col: 1, color: 'yellow' },
      { face: 'top', row: 0, col: 1, color: 'yellow' },
      { face: 'top', row: 1, col: 0, color: 'yellow' },
      { face: 'top', row: 1, col: 2, color: 'yellow' },
      { face: 'top', row: 2, col: 1, color: 'yellow' },
      { face: 'front', row: 1, col: 1, color: 'green' },
      { face: 'left', row: 1, col: 1, color: 'red' },
      { face: 'right', row: 1, col: 1, color: 'orange' },
      { face: 'front', row: 0, col: 1, color: 'green' },
      { face: 'left', row: 0, col: 1, color: 'red' },
      { face: 'right', row: 0, col: 1, color: 'orange' },
      { face: 'top', row: 0, col: 0, color: 'yellow' },
      { face: 'front', row: 0, col: 0, color: 'green' },
      { face: 'left', row: 0, col: 0, color: 'red' },
      { face: 'top', row: 2, col: 0, color: 'yellow' },
      { face: 'left', row: 0, col: 2, color: 'blue' },
      { face: 'top', row: 2, col: 2, color: 'yellow' },
      { face: 'right', row: 0, col: 2, color: 'blue' },
      { face: 'top', row: 0, col: 2, color: 'yellow' },
      { face: 'front', row: 0, col: 2, color: 'green' },
      { face: 'right', row: 0, col: 0, color: 'orange' }
    ],

    generateRound() {
      // 1. Wähle zufällige Front-Farbe
      const frontColor = SIDE_COLORS[Math.floor(Math.random() * SIDE_COLORS.length)];
      const neighbors = CLOCKWISE_NEIGHBORS[frontColor];
      const leftColor = neighbors.left;
      const rightColor = neighbors.right;

      // 2. Hole die korrekten Ecken für diese Orientierung
      const correctCorners = getCornersForFront(frontColor);

      // 3. Wähle zufällig welche Ecke richtig positioniert ist
      const correctPositionIndex = Math.floor(Math.random() * 4);
      const correctPosition = CORNER_BUTTON_ORDER[correctPositionIndex];

      // 4. Erstelle die zyklische Vertauschung der anderen 3 Ecken
      // Die anderen 3 Ecken im Uhrzeigersinn oder gegen Uhrzeigersinn rotieren
      const otherPositions = CORNER_BUTTON_ORDER.filter((_, i) => i !== correctPositionIndex);
      const rotateClockwise = Math.random() < 0.5;

      // Mapping: Position -> angezeigte Ecke
      const displayedCorners = {};
      displayedCorners[correctPosition] = correctCorners[correctPosition];

      if (rotateClockwise) {
        // Im Uhrzeigersinn: pos[0] zeigt Ecke von pos[2], pos[1] zeigt Ecke von pos[0], pos[2] zeigt Ecke von pos[1]
        displayedCorners[otherPositions[0]] = correctCorners[otherPositions[2]];
        displayedCorners[otherPositions[1]] = correctCorners[otherPositions[0]];
        displayedCorners[otherPositions[2]] = correctCorners[otherPositions[1]];
      } else {
        // Gegen Uhrzeigersinn: pos[0] zeigt Ecke von pos[1], pos[1] zeigt Ecke von pos[2], pos[2] zeigt Ecke von pos[0]
        displayedCorners[otherPositions[0]] = correctCorners[otherPositions[1]];
        displayedCorners[otherPositions[1]] = correctCorners[otherPositions[2]];
        displayedCorners[otherPositions[2]] = correctCorners[otherPositions[0]];
      }

      // 5. Generiere zufällige Orientierungen für alle 4 Ecken
      const orientations = {};
      CORNER_BUTTON_ORDER.forEach(pos => {
        orientations[pos] = Math.floor(Math.random() * 3);
      });

      // 6. Erstelle das Pattern
      const pattern = [];

      // Gelbes Kreuz
      pattern.push({ face: 'top', row: 1, col: 1, color: 'yellow' });
      pattern.push({ face: 'top', row: 0, col: 1, color: 'yellow' });
      pattern.push({ face: 'top', row: 1, col: 0, color: 'yellow' });
      pattern.push({ face: 'top', row: 1, col: 2, color: 'yellow' });
      pattern.push({ face: 'top', row: 2, col: 1, color: 'yellow' });

      // Zentren
      pattern.push({ face: 'front', row: 1, col: 1, color: frontColor });
      pattern.push({ face: 'left', row: 1, col: 1, color: leftColor });
      pattern.push({ face: 'right', row: 1, col: 1, color: rightColor });

      // Kanten (obere Reihe)
      pattern.push({ face: 'front', row: 0, col: 1, color: frontColor });
      pattern.push({ face: 'left', row: 0, col: 1, color: leftColor });
      pattern.push({ face: 'right', row: 0, col: 1, color: rightColor });

      // 7. Füge die 4 Ecken mit Rotation hinzu
      CORNER_BUTTON_ORDER.forEach(pos => {
        const cornerColors = displayedCorners[pos];
        const orientation = orientations[pos];
        const rotatedColors = rotateArray(cornerColors, orientation);
        const posData = CORNER_POSITION_DATA[pos];

        // Für vordere Ecken: [top, front, side]
        // Für hintere Ecken: [top, side] (back nicht sichtbar)
        posData.positions.forEach((fieldPos, index) => {
          if (index < rotatedColors.length) {
            pattern.push({
              face: fieldPos.face,
              row: fieldPos.row,
              col: fieldPos.col,
              color: rotatedColors[index]
            });
          }
        });
      });

      return {
        pattern,
        correctPosition,
        frontColor,
        displayedCorners,
        orientations
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
    description: ex.description,
    infoHTML: ex.infoHTML,
    infoPattern: ex.infoPattern
  }));
}

/**
 * Gibt eine bestimmte Übung zurück
 */
function getExercise(id) {
  return EXERCISES[id];
}
